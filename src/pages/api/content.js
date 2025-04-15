import fs from 'fs';
import path from 'path';

// Path to our content database JSON file
const dbPath = path.join(process.cwd(), 'src/data/content.json');

// Helper to ensure the data file exists
const ensureDbExists = () => {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  if (!fs.existsSync(dbPath)) {
    // Initial content data based on what's in the existing pages
    const initialData = {
      home: {
        heroTitle: 'Creating Beauty with Care for Nature',
        heroSubtitle: 'Eco-friendly handmade products that inspire',
        whyEcoCraftTitle: 'Why EcoCraft?',
        whyEcoCraftText: 'We combine unique design, natural materials, and craftsmanship to create things that do not harm nature.'
      },
      about: {
        introTitle: 'Про EcoCraft',
        introText: 'EcoCraft — це спільнота майстрів, які вірять у силу природи та ручної роботи. Заснований у 2020 році.',
        missionTitle: 'Наша місія',
        missionText: 'Поєднати красу хендмейд речей із турботою про довкілля.'
      },
      contacts: {
        introTitle: 'Зв\'яжіться з нами',
        introText: 'Маєте запитання чи хочете замовити унікальний виріб? Напишіть нам!'
      }
    };
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
  }
};

export default async function handler(req, res) {
  ensureDbExists();

  // GET all content
  if (req.method === 'GET') {
    try {
      const data = fs.readFileSync(dbPath, 'utf8');
      const content = JSON.parse(data);
      return res.status(200).json(content);
    } catch (error) {
      console.error('Error reading content data:', error);
      return res.status(500).json({ message: 'Failed to fetch content' });
    }
  }
  
  // UPDATE specific content
  else if (req.method === 'PUT') {
    try {
      const { page, field, value } = req.body;
      
      // Validate required fields
      if (!page || !field || value === undefined) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      
      // Read current content
      const data = fs.readFileSync(dbPath, 'utf8');
      const content = JSON.parse(data);
      
      // Check if the page and field exist
      if (!content[page] || content[page][field] === undefined) {
        return res.status(404).json({ message: 'Content field not found' });
      }
      
      // Update the content
      content[page][field] = value;
      
      // Save back to file
      fs.writeFileSync(dbPath, JSON.stringify(content, null, 2));
      
      return res.status(200).json({ message: 'Content updated successfully' });
    } catch (error) {
      console.error('Error updating content:', error);
      return res.status(500).json({ message: 'Failed to update content' });
    }
  }
  
  // Method not allowed
  else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 