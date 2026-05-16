import { useState, useEffect, useMemo } from 'react';
import RestaurantCard from './RestaurantCard';
import { api } from '../../services/api';

const CUISINES = ['All', 'Hyderabadi', 'Italian', 'American', 'Japanese', 'Chinese', 'Mexican', 'Indian'];

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState('');
  const [cuisine, setCuisine] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getRestaurants()
      .then(data => setRestaurants(data))
      .catch(() => {
        // Fallback demo data
        const demo = [
          { id: 1, name: 'Biryani House', cuisine: 'Hyderabadi', rating: 4.5, deliveryTime: 30, deliveryFee: 29, isOpen: true },
          { id: 2, name: 'Pizza Paradise', cuisine: 'Italian', rating: 4.2, deliveryTime: 40, deliveryFee: 39, isOpen: true },
          { id: 3, name: 'Burger Barn', cuisine: 'American', rating: 4.0, deliveryTime: 25, deliveryFee: 19, isOpen: false },
          { id: 4, name: 'Sushi Spot', cuisine: 'Japanese', rating: 4.7, deliveryTime: 45, deliveryFee: 59, isOpen: true },
        ];
        setRestaurants(demo);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = restaurants;
    if (cuisine !== 'All') result = result.filter(r => r.cuisine === cuisine);
    if (search.trim()) result = result.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));
    return result;
  }, [search, cuisine, restaurants]);

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Restaurants near you</h1>

      <input
        style={styles.searchInput}
        placeholder="Search for restaurants or cuisines..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div style={styles.chips}>
        {CUISINES.map(c => (
          <button
            key={c}
            style={{ ...styles.chip, ...(cuisine === c ? styles.activeChip : {}) }}
            onClick={() => setCuisine(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={styles.loading}>Loading restaurants...</div>
      ) : filtered.length === 0 ? (
        <div style={styles.empty}>
          <span style={{ fontSize: 48 }}>🍽</span>
          <p>No restaurants found. Try a different search.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filtered.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: 960, margin: '0 auto', padding: '1.5rem' },
  heading: { fontSize: 22, fontWeight: 500, marginBottom: '1.25rem' },
  searchInput: { width: '100%', padding: '11px 16px', border: '0.5px solid #d5d2ca', borderRadius: 10, fontSize: 14, marginBottom: '1rem', boxSizing: 'border-box', background: '#fff', outline: 'none' },
  chips: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.5rem' },
  chip: { padding: '6px 16px', borderRadius: 999, border: '0.5px solid #d5d2ca', background: '#fff', fontSize: 13, cursor: 'pointer', color: '#555' },
  activeChip: { background: '#FAECE7', color: '#993C1D', borderColor: '#F5C4B3', fontWeight: 500 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' },
  loading: { textAlign: 'center', color: '#888', padding: '3rem', fontSize: 14 },
  empty: { textAlign: 'center', color: '#888', padding: '3rem', fontSize: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 },
};
