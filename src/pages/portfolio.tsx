import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface PortfolioItem {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string;
}

const Portfolio: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolioItems = async () => {
      try {
        const response = await fetch('/api/portfolio');
        if (!response.ok) {
          throw new Error('Error loading data');
        }
        const data = await response.json();
        setItems(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching portfolio items:', error);
        setError('Could not load portfolio items');
        setLoading(false);
      }
    };

    fetchPortfolioItems();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="portfolio-page">
      <section className="portfolio-intro card">
        <h1>Our Portfolio</h1>
        <p>Explore our unique handmade products created with love for nature.</p>
      </section>

      <section className="portfolio-grid">
        {items.map(item => (
          <div key={item.id} className="portfolio-item card">
            <div className="image-container">
              <Image 
                src={item.image} 
                alt={item.name} 
                fill 
                sizes="(max-width: 768px) 100vw, 350px"
                style={{ objectFit: "cover" }} 
                priority={items.indexOf(item) < 4}
              />
            </div>
            <h3>{item.name}</h3>
            <p className="category">{item.category}</p>
            <p>{item.description}</p>
            <Link href={`/portfolio/${item.id}`}><button className="button primaryButton">Learn More</button></Link>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Portfolio;