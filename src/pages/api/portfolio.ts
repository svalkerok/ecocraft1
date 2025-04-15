import { connectToDatabase } from '../../../utils/db';

export default async function handler(req, res) {
  const db = await connectToDatabase();
  const collection = db.collection('content');

  if (req.method === 'POST') {
    const { name, category, description, image } = req.body;
    await collection.insertOne({ type: 'portfolio', name, category, description, image });
    res.status(201).json({ message: 'Portfolio item added' });
  }
}