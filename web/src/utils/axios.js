import axios from 'axios';

const ipAddress = 'localhost';
const port = 3333;

export default axios.create({
  baseURL: `http://${ipAddress}:${port}`,
});