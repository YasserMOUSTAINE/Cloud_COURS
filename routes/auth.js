const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/authMiddleware');

//User registration;
router.post('/register', async (req, res) => {
    try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
    }
    });
//User login
router.post('/login', async (req, res) => {
    try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
    return res.status(401).json({ error: 'Authentication failed' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
    return res.status(401).json({ error: 'Authentication failed' });
    }
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
    expiresIn: '1h',
    });
    res.status(200).json({ token });
    } catch (error) {
    res.status(500).json({ error: 'Login failed' });
    }
    });

    router.get('/userinf', verifyToken, async (req, res) => {
        try {
            const user = await User.findById(req.userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.status(200).json({
                username: user.username,
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to get user information' });
        }
    });
    router.get('/usertoken', async (req, res) => {
        try {
            const token = req.header('Authorization').split(' ')[1]; // Récupérer le token JWT du header Authorization
            if (!token) {
                return res.status(401).json({ error: 'Access denied. No token provided.' });
            }
    
            // Vérifier le token
            const decoded = jwt.verify(token, 'your-secret-key');
            if (!decoded.userId) {
                return res.status(401).json({ error: 'Invalid token. No user ID found.' });
            }
    
            // Récupérer l'utilisateur en fonction de l'ID décodé à partir du token
            const user = await User.findById(decoded.userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            // Retourner les informations de l'utilisateur
            res.status(200).json({
                username: user.username,
                // Vous pouvez ajouter d'autres informations de l'utilisateur ici si nécessaire
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to get user information' });
        }
    });
    module.exports = router;
    