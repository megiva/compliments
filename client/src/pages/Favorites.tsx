import React, { useEffect, useState } from 'react';

function Favorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      console.warn("No logged-in user found.");
      return;
    }

    fetch(`http://localhost:3000/favorites/${userId}`)
      .then(res => res.json())
      .then(data => {
        setFavorites(data.favorites.map(f => f.text));
      });
  }, [userId]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>💖 My Favorite Compliments</h2>
      {favorites.length > 0 ? (
        <ul>
          {favorites.map((text, index) => (
            <li key={index}>{text}</li>
          ))}
        </ul>
      ) : (
        <p>No favorites yet or not logged in.</p>
      )}
    </div>
  );
}

export default Favorites;
