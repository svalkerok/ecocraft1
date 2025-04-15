import { useState } from 'react';

export default function AddPortfolio() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, category, description, image }),
    });
    alert('Portfolio item added');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL" />
      <button type="submit">Add</button>
    </form>
  );
}