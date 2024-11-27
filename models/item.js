const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, enum: ['Lost', 'Found'], required: true },
  location: { type: String, required: true },
  date: { type: Date, default: Date.now },
  image: { type: String },
  contact: { type: String, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Item', ItemSchema);
