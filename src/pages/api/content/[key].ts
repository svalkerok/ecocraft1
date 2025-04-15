import { connectToDatabase } from '../../../../utils/db';

export default async function handler(req, res) {
  const { key } = req.query;
  const db = await connectToDatabase();
  const collection = db.collection('content');

  if (req.method === 'PUT') {
    const { value } = req.body;
    await collection.updateOne(
      { key },
      { $set: { value, type: 'text', page: 'home' } },
      { upsert: true }
    );
    res.status(200).json({ message: 'Text updated' });
  } else if (req.method === 'GET') {
    const content = await collection.findOne({ key });
    res.status(200).json(content || { value: '' });
  }
}