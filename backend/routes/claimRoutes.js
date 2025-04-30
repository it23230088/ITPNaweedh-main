import express from 'express';
import WarrantyClaim from '../models/WarrantyClaim.js'; // Ensure model is defined

const router = express.Router();
// Submit a claim
router.post('/', async (req, res) => {
  const newClaim = new WarrantyClaim(req.body);
  await newClaim.save();
  res.status(201).json(newClaim);
});

// Get all claims
router.get('/', async (req, res) => {
  res.json(await WarrantyClaim.find().populate('warrantyId'));
});

// Update claim status
router.put('/:id', async (req, res) => {
  res.json(await WarrantyClaim.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

export default router;
