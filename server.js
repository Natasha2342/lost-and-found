const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const uri = process.env.MONGO_URI;

// MongoDB connection
try {
    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
} catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit the process if connection fails
}

// Mongoose schema and model
const itemSchema = new mongoose.Schema({
    name: String,
    type: String,
    description: String,
    contactInfo: String
});

const LostItem = mongoose.model('LostItem', itemSchema);

// POST route to handle item submissions
app.post('/api/lost-items', async (req, res) => {
    try {
        const { name, type, description, contactInfo } = req.body;

        // Create a new item from the request body
        const newItem = new LostItem({
            name,
            type,
            description,
            contactInfo
        });

        // Save the item to the database
        await newItem.save();

        // Return the saved item in the response
        res.status(201).json(newItem);
    } catch (error) {
        console.error('Error saving item:', error);
        res.status(400).json({ message: 'Error saving item', error: error.message });
    }
});

// GET route to fetch all lost items
app.get('/api/lost-items', async (req, res) => {
    try {
        const items = await LostItem.find();
        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ message: 'Error fetching items' });
    }
});

// DELETE route to remove an item by its ID
app.delete('/api/lost-items/:id', async (req, res) => {
    const itemId = req.params.id;

    try {
        const deletedItem = await LostItem.findByIdAndDelete(itemId);

        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ message: 'Error deleting item' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
