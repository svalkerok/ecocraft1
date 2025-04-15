import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Home: React.FC = () => { 
  const reviews = [
    { id: 1, name: 'Lisa K.', text: 'Ordered a bag made from recycled materials — it is simply amazing!', rating: 5 },
    { id: 2, name: 'Ryan C.', text: 'EcoCraft jewelry has become my favorite gift.', rating: 4 },
    { id: 3, name: 'Maria S.', text: 'Home decor looks stylish and modern.', rating: 5 },
  ];

  const popularProducts = [
    { id: 1, name: 'Wooden Vase', description: 'Elegant vase made from recycled wood.', image: '/img/organic-vase.webp' },
    { id: 2, name: 'Woven Bag', description: 'Durable bag made from natural fibers.', image: '/img/woven-bag.png' },
    { id: 3, name: 'Eco Jewelry', description: 'Unique jewelry made from recycled materials.', image: '/img/eco-jewelry.png' },
  ];

  return (
    <div>
      <section className="hero">
        <div className="hero-image">
          <Image src="/img/index.jpg" alt="EcoCraft" fill style={{ objectFit: "cover" }} />
        </div>
        <div className="hero-text card">
          <h1>Creating Beauty with Care for Nature</h1>
          <p>Eco-friendly handmade products that inspire</p>
          <Link href="/portfolio"><button className="button primaryButton">Open Portfolio</button></Link>
        </div>
      </section>

      <section className="description card">
        <h2>Why EcoCraft?</h2>
        <p>We combine unique design, natural materials, and craftsmanship to create things that do not harm nature.</p>
      </section>

      <section className="benefits">
        <h2>Our Advantages</h2>
        <div className="benefits-grid">
          <div className="benefit-item card"><h3>Eco-friendliness</h3><p>Only natural and recycled materials.</p></div>
          <div className="benefit-item card"><h3>Uniqueness</h3><p>Each product is a work of art.</p></div>
          <div className="benefit-item card"><h3>Quality</h3><p>Durability and attention to detail.</p></div>
        </div>
      </section>

      <section className="popular-products card">
        <h2>Popular Products</h2>
        <div className="products-grid">
          {popularProducts.map(product => (
            <div key={product.id} className="product-item card">
              <div className="image-container">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  style={{ objectFit: "cover" }} 
                />
              </div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <Link href="/portfolio"><button className="button primaryButton">Learn More</button></Link>
            </div>
          ))}
        </div>
      </section>

      <section className="reviews">
        <h2>What Our Clients Say</h2>
        <div className="reviews-grid">
          {reviews.map(review => (
            <div key={review.id} className="review-item card">
              <p className="review-text">"{review.text}"</p>
              <p className="review-author">— {review.name}</p>
              <p className="review-rating">Rating: {review.rating}/5</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Order Your Unique Eco-Friendly Item?</h2>
        <p>Our team is eager to help bring your ideas to life with sustainable craftsmanship</p>
        <Link href="/contacts"><button className="button primaryButton">Get in Touch</button></Link>
      </section>
    </div>
  );
};

export default Home;