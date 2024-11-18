import { connect } from 'mssql';
const config = {
  user: 'maxmillin',
  password: 'milliaN@5867!',
  server: '14.0.1000',
  database: 'todo_app',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};



const connectToDB = async () => {
    try {
      const pool = await connect(config);
      return pool;
    } catch (err) {
      console.error('Database connection failed:', err);
      throw err;
    }
  };


  export default { connectToDB };
