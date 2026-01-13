import express from 'express';
import mongoose from 'mongoose';
import Bid from '../models/Bid.js';
import Gig from '../models/Gig.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Submit a bid for a gig
router.post('/', authenticate, async (req, res) => {
  try {
    const { gigId, message, price } = req.body;

    if (!gigId || !message || price === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if gig exists and is open
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.status !== 'open') {
      return res.status(400).json({ message: 'Gig is no longer open for bidding' });
    }

    // Check if user is the owner
    if (gig.ownerId.toString() === req.user.userId) {
      return res.status(400).json({ message: 'You cannot bid on your own gig' });
    }

    // Check if user already bid on this gig
    const existingBid = await Bid.findOne({
      gigId,
      freelancerId: req.user.userId
    });

    if (existingBid) {
      return res.status(400).json({ message: 'You have already bid on this gig' });
    }

    const bid = new Bid({
      gigId,
      freelancerId: req.user.userId,
      message,
      price
    });

    await bid.save();
    await bid.populate('freelancerId', 'name email');

    res.status(201).json(bid);
  } catch (error) {
    console.error('Create bid error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already bid on this gig' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all bids for a specific gig (Owner only)
router.get('/:gigId', authenticate, async (req, res) => {
  try {
    const { gigId } = req.params;

    // Check if gig exists
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Check if user is the owner
    if (gig.ownerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Only the gig owner can view bids' });
    }

    const bids = await Bid.find({ gigId })
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    console.error('Get bids error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Hire a freelancer (Atomic update with transaction)
router.patch('/:bidId/hire', authenticate, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bidId } = req.params;

    // Find the bid
    const bid = await Bid.findById(bidId).session(session);
    if (!bid) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Bid not found' });
    }

    // Find the gig
    const gig = await Gig.findById(bid.gigId).session(session);
    if (!gig) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Check if user is the owner
    if (gig.ownerId.toString() !== req.user.userId) {
      await session.abortTransaction();
      return res.status(403).json({ message: 'Only the gig owner can hire freelancers' });
    }

    // Check if gig is still open
    if (gig.status !== 'open') {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Gig is no longer open' });
    }

    // Check if bid is still pending
    if (bid.status !== 'pending') {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Bid is no longer pending' });
    }

    // Atomic operations within transaction
    // 1. Update gig status to assigned
    gig.status = 'assigned';
    await gig.save({ session });

    // 2. Mark chosen bid as hired
    bid.status = 'hired';
    await bid.save({ session });

    // 3. Reject all other bids for this gig and send notifications
    const rejectedBids = await Bid.find({
      gigId: bid.gigId,
      _id: { $ne: bidId },
      status: 'pending'
    }).populate('freelancerId', 'name email').session(session);

    await Bid.updateMany(
      {
        gigId: bid.gigId,
        _id: { $ne: bidId },
        status: 'pending'
      },
      {
        $set: { status: 'rejected' }
      },
      { session }
    );

    // Commit transaction
    await session.commitTransaction();

    // Get populated gig owner data
    await gig.populate('ownerId', 'name email');
    
    // Get updated bid with populated data
    await bid.populate('freelancerId', 'name email');

    // Get Socket.io instance once for all notifications
    const io = req.app.get('io');

    // Send rejection notifications to all rejected freelancers
    if (io && rejectedBids.length > 0) {
      for (const rejectedBid of rejectedBids) {
        const freelancerId = rejectedBid.freelancerId._id 
          ? rejectedBid.freelancerId._id.toString() 
          : rejectedBid.freelancerId.toString();
        
        const roomName = `user_${freelancerId}`;
        console.log(`Sending rejection notification to room: ${roomName}`);
        
        io.to(roomName).emit('bidRejected', {
          message: `Your bid for "${gig.title}" has been rejected. Another freelancer was hired for this project.`,
          gig: {
            id: gig._id.toString(),
            title: gig.title,
            description: gig.description,
            budget: gig.budget
          },
          bid: {
            id: rejectedBid._id.toString(),
            price: rejectedBid.price,
            message: rejectedBid.message
          },
          client: {
            name: gig.ownerId.name,
            email: gig.ownerId.email
          },
          timestamp: new Date().toISOString()
        });
      }
    }

    // Emit real-time notification via Socket.io for hired freelancer
    if (io) {
      // Get freelancer ID - handle both ObjectId and populated object
      const freelancerId = bid.freelancerId._id 
        ? bid.freelancerId._id.toString() 
        : bid.freelancerId.toString();
      
      const roomName = `user_${freelancerId}`;
      
      console.log(`Sending notification to room: ${roomName} for freelancer: ${freelancerId}`);
      
      io.to(roomName).emit('hired', {
        message: `You have been hired for "${gig.title}"!`,
        gig: {
          id: gig._id.toString(),
          title: gig.title,
          description: gig.description,
          budget: gig.budget
        },
        bid: {
          id: bid._id.toString(),
          price: bid.price,
          message: bid.message
        },
        client: {
          name: gig.ownerId.name,
          email: gig.ownerId.email
        },
        timestamp: new Date().toISOString()
      });
      
      // Also emit a general notification to all connected clients (for debugging)
      console.log(`Notification sent to room: ${roomName}`);
    }

    res.json({
      message: 'Freelancer hired successfully',
      bid,
      gig
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Hire error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    session.endSession();
  }
});

// Reject a bid (Owner can reject individual bids)
router.patch('/:bidId/reject', authenticate, async (req, res) => {
  try {
    const { bidId } = req.params;

    // Find the bid
    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    // Find the gig
    const gig = await Gig.findById(bid.gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Check if user is the owner
    if (gig.ownerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Only the gig owner can reject bids' });
    }

    // Check if bid is still pending
    if (bid.status !== 'pending') {
      return res.status(400).json({ message: 'Bid is no longer pending' });
    }

    // Update bid status to rejected
    bid.status = 'rejected';
    await bid.save();

    // Populate data for notification
    await bid.populate('freelancerId', 'name email');
    await gig.populate('ownerId', 'name email');

    // Emit real-time notification via Socket.io
    const io = req.app.get('io');
    if (io) {
      // Get freelancer ID - handle both ObjectId and populated object
      const freelancerId = bid.freelancerId._id 
        ? bid.freelancerId._id.toString() 
        : bid.freelancerId.toString();
      
      const roomName = `user_${freelancerId}`;
      
      console.log(`Sending rejection notification to room: ${roomName} for freelancer: ${freelancerId}`);
      
      io.to(roomName).emit('bidRejected', {
        message: `Your bid for "${gig.title}" has been rejected.`,
        gig: {
          id: gig._id.toString(),
          title: gig.title,
          description: gig.description,
          budget: gig.budget
        },
        bid: {
          id: bid._id.toString(),
          price: bid.price,
          message: bid.message
        },
        client: {
          name: gig.ownerId.name,
          email: gig.ownerId.email
        },
        timestamp: new Date().toISOString()
      });
      
      console.log(`Rejection notification sent to room: ${roomName}`);
    }

    res.json({
      message: 'Bid rejected successfully',
      bid,
      gig
    });
  } catch (error) {
    console.error('Reject bid error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

