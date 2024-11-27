const express = require('express');
const jwt = require('jsonwebtoken');
const Item = require('../models/item');
const router = express.Router();

// Middleware to authenticate requests
const authenticate = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

// Post an item
router.post('/', authenticate, async (req, res) => {
  const { title, description, category, status, location, image, contact } = req.body;
  try {
    const item = new Item({
      title, description, category, status, location, image, contact, postedBy: req.user
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Error posting item' });
  }
});

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().populate('postedBy', 'name');
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching items' });
  }
});

module.exports = router;
