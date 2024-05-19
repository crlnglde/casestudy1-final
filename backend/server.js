// server.js

const express = require('express');
const mongoose = require('mongoose');
const labaduhRoute = require('./b-routes/orderRoute.js');
const authRoutes = require('./b-routes/authRoute.js');
const cusRoutes = require('./b-routes/customerRoute.js');

const cors = require('cors')

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/laundrydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Routes
app.use('/auth', authRoutes);
app.use('/order', labaduhRoute);
app.use('/customer', cusRoutes);

// Start the server
const PORT = process.env.PORT || 3000;  
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
