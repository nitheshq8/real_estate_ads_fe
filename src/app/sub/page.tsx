// pages/subscriptions.js
"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace the URL with your Odoo API endpoint
    axios
      .post('http://localhost:8069/api/subscriptions/by_companyById',{"params":{"company_id": "1"}})
      .then((response) => {
        
        setSubscriptions(response.data.result);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Error fetching subscriptions.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading subscriptions...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Company Subscriptions</h1>
      {subscriptions.length === 0 ? (
        <p>No subscriptions found.</p>
      ) : (
        <ul>
          {subscriptions.map((sub) => (
            <li
              key={sub.id}
              style={{
                marginBottom: '1rem',
                borderBottom: '1px solid #ccc',
                paddingBottom: '1rem'
              }}
            >
              <h2>{sub.name}</h2>
              <p>
                <strong>Company:</strong> {sub.company}
              </p>
              <p>
                <strong>Plan:</strong> {sub.subscription_plan}
              </p>
              <p>
                <strong>Price:</strong> {sub.price}
              </p>
              <p>
                <strong>Status:</strong> {sub.active ? 'Active' : 'Inactive'}
              </p>
              {/* Render additional fields as needed */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
