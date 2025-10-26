const express = require('express');
const dotenv =require('dotenv')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const router = express.Router();
dotenv.config();

// Register User
router.post('/register', async (req, res) => {
    // Request body now includes email and role
    const { username, password, email, role } = req.body;

    try {
        const existingUser = await  User.findOne({ email });
        // Checks for an existing user with the same email
        if(existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        // Converts "pass123" → "$2a$10$xyz...abc" (encrypted)
        const hashedPassword = await bcrypt.hash(password, 10);
        // Creates a new user with hashed password
        const newUser = await User.create({
            username,
            email,
            role,
            password: hashedPassword
        });
        // awaits saving of new user to database
        await newUser.save();

        res.status(201).json({ msg: 'User registered successfully!!'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Login User <logs in a user and give him/her a token>
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by unique email
        const user = await User.findOne({ email });
        // Checks if user exists
        if(!user) { 
            return res.status(400).json({ msg: 'User not found'});
        }
        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        // Checks if password matches
        if(!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials'});
        }
        // Generate JWT token
        const token = jwt.sign({ 
            id: user.id, 
            role: user.role
        },
           process.env.JWTSECRET, { expiresIn: "1d" });
           /**
            This token proves the user is logged in
            The user sends this token with future requests */

            // Returns token and user details
            res.status(200).json({ 
                token, 
                user: { id: user.id, name: user.name, role: user.role }
            })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

module.exports = router;