import { useState, useEffect } from 'react';
import { api } from '../../services/api';

const STEP_LABELS = ['Placed', 'Confirmed', 'Preparing', 'On the way', 'Delivered'];
const STEP_STATUSES = ['PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];

const STATUS_STYLES = {
  PLACED:           { bg: '#E6F1FB', color: '#185FA5', label: 'Order placed' },
  CONFIRMED:        { bg: '#E6F1FB', color: '#185FA5', label: 'Confirmed' },
  PREPARING:        { bg: '#FAEEDA', color: '#854F0B', label: 'Preparing' },
  OUT_FOR_DELIVERY: { bg: '#FAEEDA', color: '#854F0B', label: 'Out for delivery' },
  DELIVERED:        { bg: '#EAF3DE', color: '#3B6D11', label: 'Delivered' },
  CANCELLED:        { bg: '#FCEBEB', color: '#A32D2D', label: 'Cancelled' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    api.getMyOrders()
      .catch(() => [
        { id: 1023, restaurantName: 'Biryani House', items: [{ name: 'Chicken Biryani', qty: 1, price: 249 }], totalAmount: 278, status: 'OUT_FOR_DELIVERY', placedAt: new Date(Date.now() - 20 * 60000).toISOString(), deliveryAddress: '42, Banjara Hills, Hyderabad' },
        { id: 1022, restaurantName: 'Pizza Paradise', items: [{ name: 'Margherita', qty: 2, price: 299 }], totalAmount: 637, status: 'DELIVERED', placedAt: new Date(Date.now() - 86400000).toISOString(), deliveryAddress: '42, Banjara Hills, Hyderabad' },
      ])
      .then(data => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const timeAgo = (isoStr) => {
    const diff = (now - new Date(isoStr)) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  if (loading) return <div style={styles.loading}>Loading your orders...</div>;

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>My orders</h1>

      {orders.length === 0 ? (
        <div style={styles.empty}>
          <span style={{ fontSize: 48 }}>📦</span>
          <p style={{ marginTop: 12, color: '#888' }}>No orders yet. Time to order something delicious!</p>
        </div>
      ) : (
        <div style={styles.list}>
          {orders.map(order => {
            const st = STATUS_STYLES[order.status] || STATUS_STYLES.PLACED;
            const stepIdx = STEP_STATUSES.indexOf(order.status);

            return (
              <div key={order.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <span style={styles.restName}>{order.restaurantName}</span>
                    <span style={styles.orderId}> · #{order.id}</span>
                  </div>
                  <span style={{ ...styles.badge, background: st.bg, color: st.color }}>{st.label}</span>
                </div>

                <p style={styles.itemList}>
                  {order.items.map(i => `${i.name} ×${i.qty}`).join(', ')}
                </p>

                <div style={styles.metaRow}>
                  <span style={styles.meta}>₹{order.totalAmount}</span>
                  <span style={styles.metaDot}>·</span>
                  <span style={styles.meta}>{timeAgo(order.placedAt)}</span>
                  <span style={styles.metaDot}>·</span>
                  <span style={styles.meta}>{order.deliveryAddress}</span>
                </div>

                {order.status !== 'CANCELLED' && (
                  <div style={styles.tracker}>
                    {STEP_LABELS.map((label, i) => (
                      <div key={label} style={styles.step}>
                        {i > 0 && <div style={{ ...styles.line, background: i <= stepIdx ? '#D85A30' : '#e5e2da' }} />}
                        <div style={{ ...styles.dot, background: i < stepIdx ? '#D85A30' : i === stepIdx ? '#FAECE7' : '#fff', border: `2px solid ${i <= stepIdx ? '#D85A30' : '#d5d2ca'}` }}>
                          {i < stepIdx && <span style={{ color: '#fff', fontSize: 9, fontWeight: 700 }}>✓</span>}
                        </div>
                        <span style={{ ...styles.stepLabel, color: i <= stepIdx ? '#D85A30' : '#aaa', fontWeight: i === stepIdx ? 600 : 400 }}>{label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: 720, margin: '0 auto', padding: '1.5rem' },
  heading: { fontSize: 22, fontWeight: 500, marginBottom: '1.5rem' },
  loading: { textAlign: 'center', padding: '4rem', color: '#888' },
  empty: { textAlign: 'center', padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: { background: '#fff', border: '0.5px solid #e5e2da', borderRadius: 14, padding: '1.25rem' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  restName: { fontSize: 15, fontWeight: 500 },
  orderId: { fontSize: 13, color: '#888' },
  badge: { fontSize: 11, padding: '3px 10px', borderRadius: 999, fontWeight: 500 },
  itemList: { fontSize: 13, color: '#555', marginBottom: 8 },
  metaRow: { display: 'flex', gap: 6, alignItems: 'center', marginBottom: 16 },
  meta: { fontSize: 12, color: '#888' },
  metaDot: { fontSize: 12, color: '#ccc' },
  tracker: { display: 'flex', alignItems: 'flex-start', gap: 0 },
  step: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, position: 'relative' },
  line: { position: 'absolute', top: 9, right: '50%', width: '100%', height: 2 },
  dot: { width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, flexShrink: 0 },
  stepLabel: { fontSize: 10, textAlign: 'center', lineHeight: 1.3 },
};
