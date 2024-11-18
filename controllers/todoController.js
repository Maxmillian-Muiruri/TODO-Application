const { getDbConnection } = require('../utils/db');

const createTOdo = async (req, res) => {
    const {title, description} = req.body;
    const userId = req.user.id;


    try {
        const pool = getDbConnection();
const exist = await pool.request()
.input('title', sql.NVarChar, title)
.input('userId', sql.Int, userId)
.query('SELECT dbo.CheckToDoExist(@title, @userId) As exists')

if (exists.recordset[0].exists) {
    return res.status(400).json({error: 'TODO already exists' })
}
await pool.request()
.input('userId', sql.Int, userId)
      .input('title', sql.NVarChar, title)
      .input('description', sql.NVarChar, description)
      .execute('CreateTODO');

      res.status(201).json({ message: 'TODO created succcesfully' });

    } catch (error) {
        res.status(500).json({error: 'failed to create TODO'})
        
    }
}

module.exports = { createTodo };
