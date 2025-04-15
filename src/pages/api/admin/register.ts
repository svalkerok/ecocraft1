import { hash } from 'bcrypt';
import { connectToDatabase } from '../../../utils/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    const hashedPassword = await hash(password, 10);
    const db = await connectToDatabase();
    const collection = db.collection('admins');
    await collection.insertOne({ username, password: hashedPassword });
    res.status(201).json({ message: 'Administrator created' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}