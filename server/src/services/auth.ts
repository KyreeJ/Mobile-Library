import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


const app = express();
app.use(express.json()); 

let users: Array<{ username: string; email: string; password: string; _id: number }> = [];
let currentId = 1;


interface JwtPayload {
  _id: unknown;
  username: string;
  email: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    const secretKey = process.env.JWT_SECRET_KEY || '';

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }
      req.user = user as JwtPayload;
      next();
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

// Utility to sign a token
export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || 'default_secret';
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

// Sign Up (createUser) route
const createUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  // Check if the user already exists
  const userExists = users.find((user: { email: string }) => user.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }


  const hashedPassword = await bcrypt.hash(password, 10);

  // Creates a new user
  const newUser = {
    username,
    email,
    password: hashedPassword,
    _id: currentId++, 
  };

  // Store the user in the "database"
  users.push(newUser);

  // Send a success response
  res.status(201).json({ message: 'User created successfully' });
};

// Login routes
 const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;


  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }


  const token = signToken(user.username, user.email, user._id);


  res.json({ message: 'Login successful', token });
};


app.get('/protected', authenticateToken, (req: Request, res: Response) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

app.post('/signup', createUser);
app.post('/login', loginUser);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
