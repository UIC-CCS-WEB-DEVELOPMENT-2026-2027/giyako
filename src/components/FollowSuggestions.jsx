import React from 'react';
import './FollowSuggestions.css';

const FollowSuggestions = () => {
  const suggestions = [
    {
      id: 1,
      name: 'Person 1',
      program: 'BS Computer Science',
      avatar: '/avatars/1.png',
      posters: [],
    },
    {
      id: 2,
      name: 'Person 2',
      program: 'BS Information Tech',
      avatar: '/avatars/2.png',
      posters: [],
    },
    {
      id: 3,
      name: 'Person 3',
      program: 'BS Data Science',
      avatar: '/avatars/3.png',
      posters: [],
    },
  ];

  return (
    <div className="suggestions-box">
      <h2 className="section-title">People you may click with (suggestions)</h2>

      <div className="cards-grid">
        {suggestions.map((user) => (
          <div key={user.id} className="user-card">
            <div className="user-header">
              <img src={user.avatar} alt={user.name} className="user-avatar" />
              <div className="user-info">
                <h3 className="user-name">{user.name}</h3>
                <p className="user-program">{user.program}</p>
              </div>
            </div>

            <div className="enjoys-section">
              <p className="enjoys-label">also enjoys...</p>
              <div className="posters-row">
                {user.posters.map((img, i) => (
                  <img key={i} src={img} alt="poster" className="poster-img" />
                ))}
                <div className="poster-placeholder"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="refresh-container">
        <button className="refresh-btn">Refresh</button>
      </div>
    </div>
  );
};

export default FollowSuggestions;