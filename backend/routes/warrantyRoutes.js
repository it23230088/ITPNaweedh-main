import express from 'express';
import Warranty from '../models/Warranty.js';
// import transporter from '../config/email';

const router = express.Router();
// Create Warranty
router.post("/", async (req, res) => {
  try {
    console.log("Received warranty data:", req.body); // Debug log
    const newWarranty = new Warranty(req.body);
    await newWarranty.save();

    // Email sending code removed/commented out
    // const mailOptions = {
    //   from: process.env.GMAIL_USER,
    //   to: req.user.email,
    //   subject: 'Warranty Created',
    //   text: `Your warranty for ${newWarranty.productName} has been created.\n\nStart Date: ${newWarranty.startDate}\nEnd Date: ${newWarranty.endDate}\nDescription: ${newWarranty.description || 'N/A'}`
    // };
    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     console.error('Error sending email:', error);
    //   } else {
    //     console.log('Email sent:', info.response);
    //   }
    // });

    res.status(201).json(newWarranty);
  } catch (error) {
    console.error("Error creating warranty:", error); // Debug log
    res.status(400).json({ error: "Failed to create warranty" });
  }
});

// Get All Warranties
router.get("/", async (req, res) => {
  try {
    const warranties = await Warranty.find();
    res.json(warranties);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch warranties" });
  }
});

// Get Warranty Stats
router.get("/stats", async (req, res) => {
  try {
    const totalWarranties = await Warranty.countDocuments();
    const activeWarranties = await Warranty.countDocuments({
      endDate: { $gt: new Date() }
    });
    const expiringSoon = await Warranty.countDocuments({
      endDate: {
        $gt: new Date(),
        $lt: new Date(new Date().setDate(new Date().getDate() + 30))
      }
    });
    const expiredWarranties = await Warranty.countDocuments({
      endDate: { $lt: new Date() }
    });

    res.json({
      totalWarranties,
      activeWarranties,
      expiringSoon,
      expiredWarranties
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch warranty stats" });
  }
});

// Get Single Warranty
router.get("/:id", async (req, res) => {
  try {
    const warranty = await Warranty.findById(req.params.id);
    if (!warranty) {
      return res.status(404).json({ error: "Warranty not found" });
    }
    res.json(warranty);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch warranty" });
  }
});

// Update Warranty
router.put("/:id", async (req, res) => {
  try {
    const updatedWarranty = await Warranty.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedWarranty) {
      return res.status(404).json({ error: "Warranty not found" });
    }
    res.json(updatedWarranty);
  } catch (error) {
    res.status(500).json({ error: "Failed to update warranty" });
  }
});

// Delete Warranty
router.delete("/:id", async (req, res) => {
  try {
    const deletedWarranty = await Warranty.findByIdAndDelete(req.params.id);
    if (!deletedWarranty) {
      return res.status(404).json({ error: "Warranty not found" });
    }
    res.json({ message: "Warranty deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete warranty" });
  }
});

export default router;
