import { useState, useEffect, useRef } from 'react';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Admin.module.css';
import { GetServerSidePropsContext } from 'next';

interface PortfolioItem {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string;
}

interface ContentData {
  home: {
    heroTitle: string;
    heroSubtitle: string;
    whyEcoCraftTitle: string;
    whyEcoCraftText: string;
  };
  about: {
    introTitle: string;
    introText: string;
    missionTitle: string;
    missionText: string;
  };
  contacts: {
    introTitle: string;
    introText: string;
  };
}

interface NewPortfolioItem {
  name: string;
  category: string;
  description: string;
  image: string;
}

interface AdminPanelProps {
  user: {
    username: string;
  };
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  console.log("getServerSideProps called on admin page");
  
  try {
    const token = context.req.cookies.token;
    const tempAuth = context.req.cookies.tempAuth;
    
    console.log("Token received:", token ? "yes" : "no");
    console.log("Temporary authentication received:", tempAuth ? "yes" : "no");
    
    // If there is temporary authentication, allow access
    if (tempAuth) {
      console.log("Using temporary authentication");
      return { props: { user: { username: 'admin' } } };
    }
    
    // Check JWT token if it exists
    if (!token) {
      console.log("Token missing, redirecting to login page");
      return { 
        redirect: { 
          destination: '/admin/simple-login', 
          permanent: false 
        } 
      };
    }
    
    // Verify token validity
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const decoded = jwt.verify(token, secret);
    console.log("Token successfully verified, data:", decoded);
    
    return { props: { user: { username: decoded.username } } };
  } catch (error) {
    console.error("Token verification error:", error);
    return { 
      redirect: { 
        destination: '/admin/simple-login', 
        permanent: false 
      } 
    };
  }
}

export default function AdminPanel({ user }: AdminPanelProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'content'>('portfolio');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [newItem, setNewItem] = useState<NewPortfolioItem>({
    name: '',
    category: '',
    description: '',
    image: ''
  });
  const [pageContent, setPageContent] = useState<ContentData>({
    home: {
      heroTitle: '',
      heroSubtitle: '',
      whyEcoCraftTitle: '',
      whyEcoCraftText: ''
    },
    about: {
      introTitle: '',
      introText: '',
      missionTitle: '',
      missionText: ''
    },
    contacts: {
      introTitle: '',
      introText: ''
    }
  });
  
  // Adding new states for working with images
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch portfolio items
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(data => setPortfolioItems(data))
      .catch(err => console.error('Error fetching portfolio items:', err));

    // Fetch page content
    fetch('/api/content')
      .then(res => res.json())
      .then(data => setPageContent(data))
      .catch(err => console.error('Error fetching content:', err));
  }, []);

  const handleLogout = () => {
    // Clear the main JWT token
    document.cookie = 'token=; Max-Age=0; path=/; domain=' + window.location.hostname;
    
    // Clear temporary authentication
    document.cookie = 'tempAuth=; Max-Age=0; path=/; domain=' + window.location.hostname;
    
    // Redirect to login page
    window.location.href = '/admin/simple-login';
  };

  // File change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setUploadError('');
    
    // Create temporary URL for preview
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setImagePreview(fileUrl);
      
      // Release reference when unmounting
      return () => URL.revokeObjectURL(fileUrl);
    } else {
      setImagePreview('');
    }
  };

  // Image upload function
  const handleImageUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload error');
      }
      
      // Set image URL in the form
      setNewItem({...newItem, image: data.imageUrl});
      setUploadError('');
      
      // Clear file input after successful upload
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Image upload error:', error);
      setUploadError(`Upload error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Cancel file selection handler
  const handleCancelFileSelect = () => {
    setSelectedFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddPortfolioItem = async () => {
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      
      if (res.ok) {
        const addedItem = await res.json();
        setPortfolioItems([...portfolioItems, addedItem]);
        setNewItem({ name: '', category: '', description: '', image: '' });
        alert('New item added successfully');
      } else {
        alert('Error adding item');
      }
    } catch (error) {
      console.error('Error adding portfolio item:', error);
      alert('Error adding item');
    }
  };

  const handleDeletePortfolioItem = async (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        const res = await fetch(`/api/portfolio/${id}`, {
          method: 'DELETE'
        });
        
        if (res.ok) {
          setPortfolioItems(portfolioItems.filter(item => item.id !== id));
          alert('Item successfully deleted');
        } else {
          alert('Error deleting item');
        }
      } catch (error) {
        console.error('Error deleting portfolio item:', error);
        alert('Error deleting item');
      }
    }
  };

  const handleSaveContent = async (page: keyof ContentData, field: string, value: string) => {
    try {
      const res = await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, field, value })
      });
      
      if (res.ok) {
        setPageContent({
          ...pageContent,
          [page]: {
            ...pageContent[page],
            [field]: value
          }
        });
        alert('Changes saved successfully');
      } else {
        alert('Error saving changes');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Error saving changes');
    }
  };

  const renderPortfolioTab = () => (
    <div className={styles['admin-section']}>
      <h2>Portfolio Management</h2>
      
      <div className={`${styles['admin-form']} ${styles.card}`}>
        <h3>Add New Item</h3>
        <input
          type="text"
          placeholder="Name"
          value={newItem.name}
          onChange={(e) => setNewItem({...newItem, name: e.target.value})}
        />
        <input
          type="text"
          placeholder="Category"
          value={newItem.category}
          onChange={(e) => setNewItem({...newItem, category: e.target.value})}
        />
        <textarea
          placeholder="Description"
          value={newItem.description}
          onChange={(e) => setNewItem({...newItem, description: e.target.value})}
        />
        
        {/* Image URL field */}
        <input
          type="text"
          placeholder="Image URL (e.g. /img/portfolio-item.jpg)"
          value={newItem.image}
          onChange={(e) => setNewItem({...newItem, image: e.target.value})}
        />
        
        {/* Image upload section */}
        <div className={styles['image-upload-section']}>
          <h4>Or Upload an Image</h4>
          
          <div className={styles['file-upload-container']}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className={styles['file-input']}
            />
            
            <button 
              type="button" 
              onClick={handleImageUpload}
              disabled={!selectedFile || isUploading}
              className={`${styles.button} ${styles.primaryButton} ${styles['upload-button']}`}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
            
            {selectedFile && (
              <button 
                type="button" 
                onClick={handleCancelFileSelect}
                className={`${styles.button} ${styles.secondaryButton}`}
                disabled={isUploading}
              >
                Cancel
              </button>
            )}
          </div>
          
          {uploadError && (
            <div className={styles['upload-error']}>
              {uploadError}
            </div>
          )}
          
          {imagePreview && (
            <div className={styles['image-preview-container']}>
              <h5>Preview:</h5>
              <div className={styles['image-preview']}>
                <Image 
                  src={imagePreview} 
                  alt="Preview" 
                  width={200} 
                  height={150} 
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          )}
        </div>
        
        <button onClick={handleAddPortfolioItem} className={`${styles.button} ${styles.primaryButton}`}>Add</button>
      </div>
      
      <div className={styles['admin-items']}>
        <h3>Existing Portfolio Items</h3>
        <div className={styles['admin-items-grid']}>
          {portfolioItems.map(item => (
            <div key={item.id} className={`${styles['admin-item']} ${styles.card}`}>
              {item.image && (
                <div className={styles['admin-item-image']}>
                  <Image src={item.image} alt={item.name} width={150} height={100} />
                </div>
              )}
              <h4>{item.name}</h4>
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Description:</strong> {item.description}</p>
              <button 
                onClick={() => handleDeletePortfolioItem(item.id)}
                className={`${styles.button} ${styles.dangerButton}`}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContentTab = () => (
    <div className={styles['admin-section']}>
      <h2>Website Content Editing</h2>
      
      <div className={`${styles['admin-content-section']} ${styles.card}`}>
        <h3>Homepage</h3>
        <div className={styles['admin-content-field']}>
          <label>Hero Section Title</label>
          <input
            type="text"
            value={pageContent.home.heroTitle}
            onChange={(e) => setPageContent({
              ...pageContent,
              home: {...pageContent.home, heroTitle: e.target.value}
            })}
          />
          <button 
            onClick={() => handleSaveContent('home', 'heroTitle', pageContent.home.heroTitle)}
            className={`${styles.button} ${styles.primaryButton}`}
          >
            Save
          </button>
        </div>
        <div className={styles['admin-content-field']}>
          <label>Hero Section Subtitle</label>
          <input
            type="text"
            value={pageContent.home.heroSubtitle}
            onChange={(e) => setPageContent({
              ...pageContent,
              home: {...pageContent.home, heroSubtitle: e.target.value}
            })}
          />
          <button 
            onClick={() => handleSaveContent('home', 'heroSubtitle', pageContent.home.heroSubtitle)}
            className={`${styles.button} ${styles.primaryButton}`}
          >
            Save
          </button>
        </div>
        <div className={styles['admin-content-field']}>
          <label>"Why EcoCraft?" Title</label>
          <input
            type="text"
            value={pageContent.home.whyEcoCraftTitle}
            onChange={(e) => setPageContent({
              ...pageContent,
              home: {...pageContent.home, whyEcoCraftTitle: e.target.value}
            })}
          />
          <button 
            onClick={() => handleSaveContent('home', 'whyEcoCraftTitle', pageContent.home.whyEcoCraftTitle)}
            className={`${styles.button} ${styles.primaryButton}`}
          >
            Save
          </button>
        </div>
        <div className={styles['admin-content-field']}>
          <label>"Why EcoCraft?" Text</label>
          <textarea
            value={pageContent.home.whyEcoCraftText}
            onChange={(e) => setPageContent({
              ...pageContent,
              home: {...pageContent.home, whyEcoCraftText: e.target.value}
            })}
          />
          <button 
            onClick={() => handleSaveContent('home', 'whyEcoCraftText', pageContent.home.whyEcoCraftText)}
            className={`${styles.button} ${styles.primaryButton}`}
          >
            Save
          </button>
        </div>
      </div>
      
      <div className={`${styles['admin-content-section']} ${styles.card}`}>
        <h3>About Us</h3>
        <div className={styles['admin-content-field']}>
          <label>Introduction Title</label>
          <input
            type="text"
            value={pageContent.about.introTitle}
            onChange={(e) => setPageContent({
              ...pageContent,
              about: {...pageContent.about, introTitle: e.target.value}
            })}
          />
          <button 
            onClick={() => handleSaveContent('about', 'introTitle', pageContent.about.introTitle)}
            className={`${styles.button} ${styles.primaryButton}`}
          >
            Save
          </button>
        </div>
        <div className={styles['admin-content-field']}>
          <label>Introduction Text</label>
          <textarea
            value={pageContent.about.introText}
            onChange={(e) => setPageContent({
              ...pageContent,
              about: {...pageContent.about, introText: e.target.value}
            })}
          />
          <button 
            onClick={() => handleSaveContent('about', 'introText', pageContent.about.introText)}
            className={`${styles.button} ${styles.primaryButton}`}
          >
            Save
          </button>
        </div>
      </div>
      
      <div className={`${styles['admin-content-section']} ${styles.card}`}>
        <h3>Contacts</h3>
        <div className={styles['admin-content-field']}>
          <label>Introduction Title</label>
          <input
            type="text"
            value={pageContent.contacts.introTitle}
            onChange={(e) => setPageContent({
              ...pageContent,
              contacts: {...pageContent.contacts, introTitle: e.target.value}
            })}
          />
          <button 
            onClick={() => handleSaveContent('contacts', 'introTitle', pageContent.contacts.introTitle)}
            className={`${styles.button} ${styles.primaryButton}`}
          >
            Save
          </button>
        </div>
        <div className={styles['admin-content-field']}>
          <label>Introduction Text</label>
          <textarea
            value={pageContent.contacts.introText}
            onChange={(e) => setPageContent({
              ...pageContent,
              contacts: {...pageContent.contacts, introText: e.target.value}
            })}
          />
          <button 
            onClick={() => handleSaveContent('contacts', 'introText', pageContent.contacts.introText)}
            className={`${styles.button} ${styles.primaryButton}`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles['admin-page']}>
      <header className={`${styles['admin-header']} ${styles.card}`}>
    <div>
          <h1>Admin Panel</h1>
          {user && <p className={styles.welcomeMessage}>Welcome, {user.username}!</p>}
        </div>
        <button onClick={handleLogout} className={`${styles.button} ${styles.secondaryButton}`}>Logout</button>
      </header>
      
      <div className={styles['admin-tabs']}>
        <button 
          className={`${styles['tab-button']} ${activeTab === 'portfolio' ? styles.active : ''}`}
          onClick={() => setActiveTab('portfolio')}
        >
          Portfolio
        </button>
        <button 
          className={`${styles['tab-button']} ${activeTab === 'content' ? styles.active : ''}`}
          onClick={() => setActiveTab('content')}
        >
          Website Content
        </button>
      </div>
      
      {activeTab === 'portfolio' ? renderPortfolioTab() : renderContentTab()}
    </div>
  );
}