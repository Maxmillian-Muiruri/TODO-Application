import express from 'express';
import { register, login } from '../controllers/authController.js';

import { registerUser, loginUser } from '../models/userModel.js';
import { sendMail } from '../config/email.js';
import jwt from 'jsonwebtoken';
import Joi from 'joi';

const router = express.Router();

// Registration route
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate({ email, password });
    if (error) return res.status(400).json({ message: error.details[0].message });

    const result = await registerUser(email, password);
    if (result) {
      sendMail(email, 'Welcome to Todo App', 'Thank you for registering!');
      res.status(201).json({ message: 'User registered successfully!' });
    } else {
      res.status(400).json({ message: 'Failed to register user' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await loginUser(email, password);
    if (user) {
      const token = jwt.sign({ id: user.Id, email: user.Email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
});

export default router; 
