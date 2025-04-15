import React from 'react';
import Image from 'next/image';

const About: React.FC = () => {
  const team = [
    { id: 1, name: 'Anna Levytska', role: 'Founder and Designer', image: '/img/team-anna.jpg' },
    { id: 2, name: 'Oleg Kravets', role: 'Wood Crafting Specialist', image: '/img/team-oleg.jpg' },
    { id: 3, name: 'Yulia Stepanenko', role: 'Textile Specialist', image: '/img/team-yulia.jpg' },
  ];

  return (
    <div className="about-page">
      <section className="about-intro card">
        <h1>About EcoCraft</h1>
        <p>EcoCraft is a community of artisans who believe in the power of nature and handcrafting. Founded in 2020.</p>
      </section>

      <section className="about-mission card">
        <h2>Our Mission</h2>
        <p>To combine the beauty of handmade items with care for the environment.</p>
        <div className="about-image">
          <Image 
            src="/img/about.jpg" 
            alt="Creation Process" 
            width={800} 
            height={500} 
            style={{ objectFit: "cover" }} 
          />
        </div>
      </section>

      <section className="about-team">
        <h2>Our Team</h2>
        <div className="team-grid">
          {team.map(member => (
            <div key={member.id} className="team-item card">
              <div className="image-container">
                <Image 
                  src={member.image} 
                  alt={member.name} 
                  fill
                  sizes="200px"
                  style={{ objectFit: "cover" }} 
                />
              </div>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;