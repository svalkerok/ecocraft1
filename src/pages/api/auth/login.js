import jwt from 'jsonwebtoken';

// In a real application, this would be stored in a database
// For simplicity, we're using hardcoded credentials here
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'ecocraft2023';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_replace_in_production';

export default async function handler(req, res) {
  console.log('Login API handler called', { method: req.method, body: req.body });
  
  // Only accept POST requests
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    const { username, password } = req.body;
    console.log('Received credentials:', { username, password: '***' });

    // Validate credentials
    if (!username || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if credentials match
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      console.log('Invalid credentials');
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    console.log('Credentials valid, creating token');
    // Create JWT token
    const token = jwt.sign(
      { userId: 1, username },
      JWT_SECRET,
      { expiresIn: '8h' } // Token expires in 8 hours
    );

    // Set HTTP-only cookie with the token
    res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 8}`);
    console.log('Token set in cookie, returning success');

    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
} 