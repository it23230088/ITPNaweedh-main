const mongoose = require('mongoose');

// Schema for glasses products
const glassesSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  folderName: {
    type: String,
    required: true
  },
  modelFile: {
    type: String,
    required: true
  },
  thumbnailFile: {
    type: String,
    required: true
  },
  position: {
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    z: {
      type: Number,
      default: 0
    }
  },
  scale: {
    type: Number,
    required: true
  },
//   price: {
//     type: Number,
//     required: false
//   },
//   description: {
//     type: String,
//     required: false
//   },
//   inStock: {
//     type: Boolean,
//     default: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
});