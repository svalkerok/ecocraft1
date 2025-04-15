import React from 'react';

const Contacts: React.FC = () => {
  return (
    <div className="contacts-page">
      <section className="contacts-intro card">
        <h1>Contact Us</h1>
        <p>Have questions or want to order a unique item? Write to us!</p>
      </section>

      <section className="contacts-info">
        <h2>Our Contacts</h2>
        <ul>
          <li>📧 Email: <a href="mailto:info@ecocraft.com">info@ecocraft.com</a></li>
          <li>📞 Phone: +380 123 456 789</li>
          <li>📍 Address: Kyiv, Green Street, 15</li>
        </ul>
      </section>

      <section className="contacts-form card">
        <h2>Write to Us</h2>
        <form className="contact-form">
          <input type="text" placeholder="Your name" required />
          <input type="email" placeholder="Your email" required />
          <textarea placeholder="Your message" rows={5} required></textarea>
          <button type="submit" className="button primaryButton">Send</button>
        </form>
      </section>

      <section className="social-links">
        <h3>Follow Us</h3>
        <div>
          <a href="https://facebook.com/ecocraft" aria-label="Facebook" className="facebook" title="Follow us on Facebook"></a>
          <a href="https://instagram.com/ecocraft" aria-label="Instagram" className="instagram" title="Follow us on Instagram"></a>
          <a href="https://pinterest.com/ecocraft" aria-label="Pinterest" className="pinterest" title="Follow us on Pinterest"></a>
        </div>
      </section>
    </div>
  );
};

export default Contacts;