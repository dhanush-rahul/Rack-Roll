const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Approve a user as an admin
async function approveUser(req, res) {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, { role: 'admin' }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User approved as admin', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function registerUser(req, res) {
    try {
        const { name, email, password, role, locationId } = req.body;
        const newUser = new User({ name, email, password, role, locationId });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        console.log(password);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function currentUser(req, res) {
    try {
        // Extract token from headers
        const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password'); // Exclude password

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
}
module.exports = {
    approveUser,
    registerUser,
    loginUser,
    currentUser,
};
