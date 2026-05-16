import { useState, useEffect } from 'react';
import { api } from '../../services/api';

const STATUSES = ['PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

const STATUS_STYLES = {
  PLACED:           { bg: '#E6F1FB', color: '#185FA5' },
  CONFIRMED:        { bg: '#E6F1FB', color: '#185FA5' },
  PREPARING:        { bg: '#FAEEDA', color: '#854F0B' },
  OUT_FOR_DELIVERY: { bg: '#FAEEDA', color: '#854F0B' },
  DELIVERED:        { bg: '#EAF3DE', color: '#3B6D11' },
  CANCELLED:        { bg: '#FCEBEB', color: '#A32D2D' },
};

const DEMO_ORDERS = [
  { id: 1023, userName: 'Rahul Kumar', restaurantName: 'Biryani House', totalAmount: 278, status: 'OUT_FOR_DELIVERY', placedAt: new Date(Date.now() - 20 * 60000).toISOString() },
  { id: 1022, userName: 'Priya Mehta', restaurantName: 'Pizza Paradise', totalAmount: 637, status: 'DELIVERED', placedAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 1021, userName: 'Amit Sharma', restaurantName: 'Burger Barn', totalAmount: 297, status: 'PREPARING', placedAt: new Date(Date.now() - 35 * 60000).toISOString() },
  { id: 1020, userName: 'Sneha Reddy', restaurantName: 'Sushi Spot', totalAmount: 747, status: 'CONFIRMED', placedAt: new Date(Date.now() - 10 * 60000).toISOString() },
  { id: 1019, userName: 'Vikram Nair', restaurantName: 'Biryani House', totalAmount: 329, status: 'PLACED', placedAt: new Date(Date.now() - 5 * 60000).toISOString() },
];

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    api.getAllOrders()
      .catch(() => DEMO_ORDERS)
      .then(data => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateStatus(orderId, newStatus).catch(() => {});
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch { 
      // ignore errors
    }
  };

  const revenue = orders.filter(o => o.status === 'DELIVERED').reduce((s, o) => s + o.totalAmount, 0);
  const active = orders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status)).length;
  const delivered = orders.filter(o => o.status === 'DELIVERED').length;

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const filtered = filterStatus === 'ALL' ? orders : orders.filter(o => o.status === filterStatus);

  const timeAgo = (iso) => {
    const diff = (now - new Date(iso)) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Admin Dashboard</h1>

      {/* Metrics */}
      <div style={styles.metrics}>
        <div style={styles.metric}>
          <span style={styles.metricLabel}>Total orders</span>
          <span style={styles.metricValue}>{orders.length}</span>
        </div>
        <div style={styles.metric}>
          <span style={styles.metricLabel}>Revenue</span>
          <span style={styles.metricValue}>₹{revenue.toLocaleString()}</span>
        </div>
        <div style={styles.metric}>
          <span style={styles.metricLabel}>Active orders</span>
          <span style={{ ...styles.metricValue, color: '#854F0B' }}>{active}</span>
        </div>
        <div style={styles.metric}>
          <span style={styles.metricLabel}>Delivered</span>
          <span style={{ ...styles.metricValue, color: '#3B6D11' }}>{delivered}</span>
        </div>
      </div>

      {/* Filter */}
      <div style={styles.filterRow}>
        {['ALL', ...STATUSES].map(s => (
          <button
            key={s}
            style={{ ...styles.filterChip, ...(filterStatus === s ? styles.filterActive : {}) }}
            onClick={() => setFilterStatus(s)}
          >
            {s.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      {loading ? (
        <div style={styles.loading}>Loading orders...</div>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Order ID', 'Customer', 'Restaurant', 'Amount', 'Time', 'Status'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => {
                const st = STATUS_STYLES[order.status] || STATUS_STYLES.PLACED;
                return (
                  <tr key={order.id} style={styles.tr}>
                    <td style={styles.td}><span style={styles.orderId}>#{order.id}</span></td>
                    <td style={styles.td}>{order.userName}</td>
                    <td style={styles.td}>{order.restaurantName}</td>
                    <td style={styles.td}><strong>₹{order.totalAmount}</strong></td>
                    <td style={{ ...styles.td, color: '#888', fontSize: 12 }}>{timeAgo(order.placedAt)}</td>
                    <td style={styles.td}>
                      <select
                        style={{ ...styles.statusSelect, background: st.bg, color: st.color }}
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                      >
                        {STATUSES.map(s => (
                          <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={styles.empty}>No orders found for this status.</div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: 1000, margin: '0 auto', padding: '1.5rem' },
  heading: { fontSize: 22, fontWeight: 500, marginBottom: '1.5rem' },
  metrics: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: '1.5rem' },
  metric: { background: '#fff', border: '0.5px solid #e5e2da', borderRadius: 12, padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: 6 },
  metricLabel: { fontSize: 12, color: '#888' },
  metricValue: { fontSize: 26, fontWeight: 500 },
  filterRow: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.25rem' },
  filterChip: { padding: '5px 14px', borderRadius: 999, border: '0.5px solid #d5d2ca', background: '#fff', fontSize: 12, cursor: 'pointer', color: '#555' },
  filterActive: { background: '#1a1a1a', color: '#fff', border: '0.5px solid #1a1a1a', fontWeight: 500 },
  loading: { textAlign: 'center', padding: '3rem', color: '#888' },
  tableWrap: { background: '#fff', border: '0.5px solid #e5e2da', borderRadius: 14, overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '11px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#888', background: '#F9F7F4', borderBottom: '0.5px solid #e5e2da' },
  tr: { borderBottom: '0.5px solid #f0ede7' },
  td: { padding: '12px 16px', fontSize: 13 },
  orderId: { fontFamily: 'monospace', background: '#F5F3F0', padding: '2px 8px', borderRadius: 6, fontSize: 12 },
  statusSelect: { padding: '4px 10px', border: 'none', borderRadius: 999, fontSize: 12, cursor: 'pointer', fontWeight: 500, outline: 'none' },
  empty: { textAlign: 'center', padding: '2rem', color: '#888', fontSize: 13 },
};
