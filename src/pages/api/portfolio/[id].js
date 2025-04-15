import fs from 'fs';
import path from 'path';

// Path to our mock database JSON file
const dbPath = path.join(process.cwd(), 'src/data/portfolio.json');

export default async function handler(req, res) {
  const { id } = req.query;
  
  // Ensure the file exists
  if (!fs.existsSync(dbPath)) {
    return res.status(404).json({ message: 'Portfolio database not found' });
  }

  // DELETE a specific portfolio item
  if (req.method === 'DELETE') {
    try {
      const data = fs.readFileSync(dbPath, 'utf8');
      let items = JSON.parse(data);
      
      // Find the item index
      const itemIndex = items.findIndex(item => item.id === parseInt(id));
      
      // If item doesn't exist
      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Portfolio item not found' });
      }
      
      // Remove the item
      items.splice(itemIndex, 1);
      
      // Save back to file
      fs.writeFileSync(dbPath, JSON.stringify(items, null, 2));
      
      return res.status(200).json({ message: 'Portfolio item deleted successfully' });
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      return res.status(500).json({ message: 'Failed to delete portfolio item' });
    }
  }
  
  // Method not allowed
  else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 