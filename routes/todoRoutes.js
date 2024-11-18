import { Router } from 'express';
import { createTodo, getTodos } from '../models/todoModel.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import Joi from 'joi';

const router = Router();

// Create Todo route
router.post('/', verifyToken, async (req, res) => {
    const { title, description, priority, dueDate } = req.body;

    const schema = Joi.object({
      title: Joi.string().min(3).required(),
      description: Joi.string(),
      priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
      dueDate: Joi.date(),
    });

    const { error } = schema.validate({ title, description, priority, dueDate });
    if (error) return res.status(400).json({ message: error.details[0].message });

    const result = await createTodo(req.user.id, title, description, priority, dueDate);
    if (result) {
        res.status(201).json({ message: 'Todo created successfully!' });
    } else {
        res.status(400).json({ message: 'Failed to create Todo' });
    }
});

// Get Todos route with pagination/filter
router.get('/', verifyToken, async (req, res) => {
    const { page = 1, limit = 10, status, priority, search } = req.query;

    const todos = await getTodos(req.user.id, page, limit, status, priority, search);
    res.json(todos);
});

export default router;  
