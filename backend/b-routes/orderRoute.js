//orderRoutes.js

const express = require('express');
const router = express.Router();
const Order = require('../models/orderSchema.js');


// POST route to handle order submissions
router.post('/postorder', async (req, res) => {
    const order = new Order(req.body)

    try {
        const response = await order.save()
        res.json(response);
        
    } catch (err) {
        res.json(err);
    }
});


// GET route to fetch all orders
router.get('/getorders', async (req, res) => {
    try {
        // Fetch all orders from the database
     
        const response = await Order.find({});
        res.json(response);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
    }
});

// PUT route to update order status by ID
router.put('/updatestatus/:orderId', async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        res.json(order);
    } catch (err) {
        console.error('Error updating order status:', err);
        res.status(500).json({ success: false, message: 'Failed to update order status.' });
    }
});



// GET route to fetch order status counts
router.get('/statusCounts', async (req, res) => {
    try {
        const pendingCount = await Order.countDocuments({ status: 'pending' });
        const readyToPickupCount = await Order.countDocuments({ status: 'ready for pick-up' });
        const pickedUpCount = await Order.countDocuments({ status: 'picked-up' });

        const statusCounts = {
            'pending': pendingCount,
            'ready for pick-up': readyToPickupCount,
            'picked-up': pickedUpCount
        };

        res.json(statusCounts);
    } catch (err) {
        console.error('Error fetching order status counts:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch order status counts.' });
    }
});

// GET route to fetch income data grouped by month and year
router.get('/income', async (req, res) => {
    try {
        // Fetch income data from the database and group by month and year
        const incomeData = await Order.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    totalAmount: { $sum: "$price" }
                }
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    month: "$_id.month",
                    totalAmount: 1
                }
            },
            { $sort: { year: 1, month: 1 } } // Sort by year and month in ascending order
        ]);

        res.json(incomeData);
    } catch (err) {
        console.error('Error fetching income data:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch income data.' });
    }
});

// GET route to fetch orders per day in a week
router.get('/ordersPerDay', async (req, res) => {
    try {
        const ordersPerDayData = await Order.aggregate([
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 }
              }
            },
            {
              $sort: { _id: 1 } // Sort by date in ascending order
            }
          ]);
          
        res.json(ordersPerDayData);
    } catch (err) {
        console.error('Error fetching orders per day data:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch orders per day data.' });
    }
});

// GET route to fetch services availed data
router.get('/servicesAvailed', async (req, res) => {
    try {
        const serviceAvailedData = await Order.aggregate([
            {
                $group: {
                    _id: "$service",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    serviceAvailed: "$_id",
                    count: 1
                }
            }
        ]);
        
        res.json(serviceAvailedData);
    } catch (err) {
        console.error('Error fetching services availed data:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch services availed data.' });
    }
});

// GET route to fetch load types data
router.get('/loadTypes', async (req, res) => {
    try {
        const loadTypesData = await Order.aggregate([
            {
                $group: {
                    _id: "$type",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    loadType: "$_id",
                    count: 1
                }
            }
        ]);
        
        res.json(loadTypesData);
    } catch (err) {
        console.error('Error fetching load types data:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch load types data.' });
    }
});

module.exports = router;
