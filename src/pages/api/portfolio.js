// This is a mock implementation as a real implementation would use a database
import fs from 'fs';
import path from 'path';

// Path to our mock database JSON file
const dbPath = path.join(process.cwd(), 'src/data/portfolio.json');

// Helper to ensure the data file exists
const ensureDbExists = () => {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  if (!fs.existsSync(dbPath)) {
    // Initial data based on what's in the portfolio.tsx
    const initialData = [
      { id: 1, name: 'Wooden Vase "Forest"', category: 'Decor', description: 'Handcrafted from recycled oak.', image: '/img/portfolio-vase.png' },
      { id: 2, name: 'Bag "Eco-Chic"', category: 'Accessories', description: 'Woven bag made from organic cotton.', image: '/img/portfolio-bag.jpg' },
      { id: 3, name: 'Necklace "Nature"', category: 'Jewelry', description: 'Made from recycled glass.', image: '/img/portfolio-necklace.jpg' },
      { id: 4, name: 'Notebook "Green"', category: 'Accessories', description: 'Cover made from recycled paper.', image: '/img/portfolio-notebook.png' },
    ];
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
  }
};

export default async function handler(req, res) {
  ensureDbExists();

  // Get all portfolio items
  if (req.method === 'GET') {
    try {
      const data = fs.readFileSync(dbPath, 'utf8');
      const items = JSON.parse(data);
      return res.status(200).json(items);
    } catch (error) {
      console.error('Error reading portfolio data:', error);
      return res.status(500).json({ message: 'Failed to fetch portfolio items' });
    }
  }
  
  // Add a new portfolio item
  else if (req.method === 'POST') {
    try {
      const data = fs.readFileSync(dbPath, 'utf8');
      const items = JSON.parse(data);
      
      // Create new item with generated ID
      const newItem = {
        id: Math.max(0, ...items.map(item => item.id)) + 1,
        ...req.body
      };
      
      // Add to items array
      items.push(newItem);
      
      // Save back to file
      fs.writeFileSync(dbPath, JSON.stringify(items, null, 2));
      
      return res.status(201).json(newItem);
    } catch (error) {
      console.error('Error adding portfolio item:', error);
      return res.status(500).json({ message: 'Failed to add portfolio item' });
    }
  }
  
  // Method not allowed
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 