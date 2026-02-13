require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const app = express();
app.use(express.json()); // This allows us to read JSON from the frontend

// REGISTRATION ROUTE
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create and Save user
        user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({ message: "User registered successfully!" });

    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

// For now, use a local string or a free MongoDB Atlas URI

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

app.listen(5000, () => console.log("Server running on port 5000"));