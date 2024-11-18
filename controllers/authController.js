import { registerUser, loginUser, getUserByEmail } from '../models/userModel.js'; 
import { sendMail } from '../config/email.js';  
import jwt from 'jsonwebtoken'; 

// Register controller
export const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await getUserByEmail(email);  // Use getUserByEmail to check existence
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Register new user
    const result = await registerUser(email, password);
    if (result) {
      // Send welcome email
      sendMail(email, 'Welcome to Todo App', 'Thank you for registering!');
      res.status(201).json({ message: 'User registered successfully!' });
    } else {
      res.status(400).json({ message: 'Failed to register user' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login controller
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Attempt to login user
    const user = await loginUser(email, password);
    if (user) {
      // Generate JWT token if login successful
      const token = jwt.sign(
        { id: user.Id, email: user.Email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }  // Adjust token expiration time as needed
      );
      res.json({ token });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export default { register, login };
