import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../../utils/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    const db = await connectToDatabase();
    const collection = db.collection('admins');
    const admin = await collection.findOne({ username });
    if (admin && await compare(password, admin.password)) {
      const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}