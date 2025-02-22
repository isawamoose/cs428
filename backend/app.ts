import express from 'express';
import bodyParser from 'body-parser';
import { login } from './userController';

const app = express();

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// POST route to handle login
app.post('/login', login);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});