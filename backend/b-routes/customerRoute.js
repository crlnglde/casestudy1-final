//customerRoute.js

const express = require('express');
const router = express.Router();
const CustomerModel = require('../models/customerSchema.js');

// Route to fetch all customers
router.get('/getlist', async (req, res) => {
    try {
        // Use the CustomerModel to fetch all customers
        const customers = await CustomerModel.find();
        res.json({ customers });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ error: 'Error fetching customers' });
    }
});

module.exports = router;
