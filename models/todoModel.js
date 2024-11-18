import { connectToDB } from '../config/db.js';
import sql from 'mssql';

export const createTodo = async (userId, title, description, priority, dueDate) => {
    const pool = await connectToDB();
    const result = await pool.request()
        .input('UserId', sql.Int, userId)
        .input('Title', sql.NVarChar(255), title)
        .input('Description', sql.NVarChar(sql.MAX), description)
        .input('Priority', sql.NVarChar(50), priority)
        .input('DueDate', sql.DateTime, dueDate)
        .execute('CreateTodo');

    return result.recordset;
};

export const getTodos = async (userId, page, limit, status, priority, search) => {
    const pool = await connectToDB();
    const result = await pool.request()
        .input('UserId', sql.Int, userId)
        .input('Page', sql.Int, page)
        .input('Limit', sql.Int, limit)
        .input('Status', sql.NVarChar(50), status)
        .input('Priority', sql.NVarChar(50), priority)
        .input('Search', sql.NVarChar(255), search)
        .execute('GetTodos');

    return result.recordset;
};


  export { createTodo, getTodos };
