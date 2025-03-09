import React, { useEffect, useState } from 'react';
import './Leaderboard.css'; // Ensure this path is correct

function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      const fetchLeaderboard = async () => {
          try {
              const response = await fetch('http://localhost:3001/quiz/leaderboard'); // Ensure the URL is correct
              if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
              }
              const data = await response.json();
              setLeaderboardData(data);
          } catch (e) {
              setError(e.message);
              console.log(e);
          } finally {
              setLoading(false);
          }
      };

      fetchLeaderboard();
  }, []);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error loading leaderboard: {error}</p>;

  return (
      <div className="leaderboard-container">
          <h1 className="leaderboard-title">Leaderboard</h1>
          <table className="leaderboard-table">
              <thead>
                  <tr>
                      <th>Username</th>
                      <th>Score</th>
                      <th>Date</th>
                  </tr>
              </thead>
              <tbody>
                  {leaderboardData.map((entry, index) => (
                      <tr key={index}>
                          <td data-label="Username">{entry.username}</td>
                          <td data-label="Score">{entry.score}</td>
                          <td data-label="Date">{new Date(entry.date).toLocaleDateString()}</td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
  );
}

export default Leaderboard;
