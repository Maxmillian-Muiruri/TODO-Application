import { connectToDB } from '../config/db.js';
import bcrypt from 'bcrypt';
import sql from 'mssql';

// Function to register a user
export const registerUser = async (email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const pool = await connectToDB();
    const result = await pool.request()
        .input('Email', sql.NVarChar(255), email)
        .input('PasswordHash', sql.NVarChar(255), hashedPassword)
        .execute('RegisterUser');

    return result.recordset;  // Assuming result contains user data
};

// Function to login a user (verifies credentials)
export const loginUser = async (email, password) => {
    const pool = await connectToDB();
    const result = await pool.request()
        .input('Email', sql.NVarChar(255), email)
        .execute('GetUserByEmail');  // Assuming GetUserByEmail stored procedure

    if (result.recordset.length === 0) return null;  // No user found

    const user = result.recordset[0];
    const match = await bcrypt.compare(password, user.PasswordHash);  // Compare hashed password
    return match ? user : null;  // Return user if credentials match, else null
};

// Function to get user by email (used for checking if a user exists during registration)
export const getUserByEmail = async (email) => {
  const pool = await connectToDB();
  const result = await pool.request()
    .input('Email', sql.NVarChar(255), email)
    .execute('GetUserByEmail');  // Stored procedure to fetch user by email

  return result.recordset[0];  // Assuming one result or null if not found
};


  module.exports = { registerUser, loginUser, getUserByEmail };
