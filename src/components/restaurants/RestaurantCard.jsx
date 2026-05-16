import { useNavigate } from 'react-router-dom';

export default function RestaurantCard({ restaurant }) {
  const navigate = useNavigate();
  const { id, name, cuisine, rating, deliveryTime, deliveryFee, imageUrl, isOpen } = restaurant;

  return (
    <div
      style={{ ...styles.card, opacity: isOpen ? 1 : 0.65 }}
      onClick={() => isOpen && navigate(`/restaurant/${id}`)}
    >
      <div style={styles.imgBox}>
        {imageUrl
          ? <img src={imageUrl} alt={name} style={styles.img} />
          : <span style={styles.emoji}>{getEmoji(cuisine)}</span>
        }
        {!isOpen && <div style={styles.closedOverlay}>Closed</div>}
      </div>

      <div style={styles.info}>
        <div style={styles.topRow}>
          <span style={styles.name}>{name}</span>
          <span style={styles.rating}>★ {rating}</span>
        </div>
        <span style={styles.cuisine}>{cuisine}</span>
        <div style={styles.meta}>
          <span style={styles.metaItem}>🕐 {deliveryTime} min</span>
          <span style={styles.dot}>·</span>
          <span style={styles.metaItem}>₹{deliveryFee} delivery</span>
        </div>
      </div>
    </div>
  );
}

function getEmoji(cuisine) {
  const map = { Hyderabadi: '🍛', Italian: '🍕', American: '🍔', Japanese: '🍱', Chinese: '🥡', Mexican: '🌮', Indian: '🍲' };
  return map[cuisine] || '🍽';
}

const styles = {
  card: { background: '#fff', border: '0.5px solid #e5e2da', borderRadius: 14, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.15s', display: 'flex', flexDirection: 'column' },
  imgBox: { height: 140, background: '#F9F7F4', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  emoji: { fontSize: 48 },
  closedOverlay: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 15 },
  info: { padding: '12px 14px 14px' },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  name: { fontSize: 15, fontWeight: 500 },
  rating: { fontSize: 13, color: '#BA7517', fontWeight: 500 },
  cuisine: { fontSize: 12, color: '#888', display: 'block', marginBottom: 8 },
  meta: { display: 'flex', alignItems: 'center', gap: 6 },
  metaItem: { fontSize: 12, color: '#666' },
  dot: { color: '#ccc', fontSize: 12 },
};
