import express from 'express';
import bodyParser from 'body-parser';
import { UserService } from './service/userService';
import { Database } from './database/Database';

const app = express();
const db = new Database();
const userService = new UserService(db);

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// POST route to handle login
app.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const success = await userService.login(username, password);
  if (success) {
    res.send('Login successful');
  } else {
    res.status(401).send('Invalid username or password');
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
