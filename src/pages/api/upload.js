import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// Disable default body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Create public/uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB file size limit
    });

    return new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('File upload error:', err);
          return resolve(res.status(500).json({ error: 'File upload error' }));
        }

        // In formidable v2+, files come as an array
        const fileArray = files.image;
        if (!fileArray || fileArray.length === 0) {
          return resolve(res.status(400).json({ error: 'File not found' }));
        }
        
        const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;
        
        // Get original filename and create a new unique name
        const originalFilename = file.originalFilename || file.originalFilename || 'image';
        const fileExt = path.extname(originalFilename);
        const timestamp = new Date().getTime();
        const newFilename = `portfolio-${timestamp}${fileExt}`;
        
        // Full path to the new file
        const newFilePath = path.join(uploadDir, newFilename);
        
        // If formidable didn't move the file automatically, move it
        if (file.filepath !== newFilePath) {
          fs.copyFileSync(file.filepath, newFilePath);
          fs.unlinkSync(file.filepath); // Delete temporary file
        }
        
        // Relative path for client use
        const imageUrl = `/uploads/${newFilename}`;
        
        return resolve(res.status(200).json({ 
          success: true,
          imageUrl
        }));
      });
    });
  } catch (error) {
    console.error('Error during upload:', error);
    return res.status(500).json({ error: 'Server error during file upload' });
  }
} 