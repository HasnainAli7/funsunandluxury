import mysql from 'mysql2/promise';

const dbConfig = {
  host: '193.203.166.126',
  user: 'u151443970_funsun',
  password: 'F@n$unluxry321', // Replace with your MySQL password
  database: 'u151443970_funsunluxry',
};
export async function connect() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('MySQL connected!');
    return connection;
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
    return null;
  }
}