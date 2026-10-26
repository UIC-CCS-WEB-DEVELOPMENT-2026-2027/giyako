import React from 'react';
import './UpcomingEvents.css';

const UpcomingEvents = () => {
  return (
    <div className="events-box">
      <h2 className="events-title">Upcoming University Events</h2>
      <ul className="events-list">
        <li>Campus Tech Summit 2026</li>
        <li>Design Workshop & Hackathon</li>
        <li>AI & Machine Learning Seminar</li>
        <li>Annual Career & Internship Fair</li>
      </ul>
    </div>
  );
};

export default UpcomingEvents;