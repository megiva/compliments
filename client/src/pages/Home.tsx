import React, { useEffect, useState } from 'react';

function Home() {
  const [compliment, setCompliment] = useState('');
  const [complimentId, setComplimentId] = useState<number | null>(null);
  const [saveMessage, setSaveMessage] = useState(''); // ✅ Message state

  const storedUserId = localStorage.getItem('userId');
  const userId = storedUserId ? Number(storedUserId) : null;
  const [welcomeVisible, setWelcomeVisible] = useState(true);


  useEffect(() => {
    fetchCompliment();
  
    const timer = setTimeout(() => setWelcomeVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);
  
  const fetchCompliment = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/compliment');
      const data = await res.json();
      setCompliment(data.compliment);
      setComplimentId(data.id);
    } catch (err) {
      console.error('Failed to fetch compliment:', err);
    }
  };
  

  const saveFavorite = async () => {
    if (!userId || complimentId === null) return;

    try {
      const res = await fetch('http://localhost:3000/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, complimentId }),
      });

      const data = await res.json();

      if (res.status === 201) {
        setSaveMessage('Saved to favorites!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else if (res.status === 409) {
        setSaveMessage('Already saved!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('Something went wrong.');
        setTimeout(() => setSaveMessage(''), 3000);
      }      
    } catch (err) {
      console.error('Save error:', err);
      setSaveMessage('Failed to save favorite.');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      {userId ? (
        <>
          {/*Show welcome message for 3 seconds */}
          {welcomeVisible && <p>Welcome back! Ready for a new compliment?</p>}
  
          <h2 style={{ fontStyle: 'italic' }}>{compliment}</h2>

          <div style={{ marginTop: '1rem' }}>
            <button onClick={saveFavorite}>💖 Save to Favorites</button>
            <button onClick={fetchCompliment} style={{ marginLeft: '1rem' }}>
              🔁 Get New Compliment
            </button>
          </div>

  
          {/*Confirmation message after saving */}
          {saveMessage && (
            <p style={{ marginTop: '1rem', color: 'pink' }}>{saveMessage}</p>
          )}
        </>
      ) : (
        <p>Please log in to save your favorites!</p>
      )}
    </div>
  );  
}

export default Home;
