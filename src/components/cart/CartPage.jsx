import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/cart';
import PaymentModal from '../payment/PaymentModal';

export default function CartPage() {
  const { cart, updateQty, clearCart } = useContext(CartContext);
  const [address, setAddress] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const navigate = useNavigate();

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = cart.length > 0 ? (cart[0].deliveryFee || 29) : 0;
  const platformFee = 5;
  const total = subtotal + deliveryFee + platformFee;

  if (cart.length === 0) {
    return (
      <div style={styles.empty}>
        <span style={{ fontSize: 56 }}>🛒</span>
        <h2 style={{ fontWeight: 500, marginTop: 16 }}>Your cart is empty</h2>
        <p style={{ color: '#888', marginTop: 8, fontSize: 14 }}>Add items from a restaurant to get started</p>
        <button style={styles.browseBtn} onClick={() => navigate('/')}>Browse restaurants</button>
      </div>
    );
  }

  const restaurantName = cart[0]?.restaurantName || 'Selected Restaurant';

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Your cart</h1>

      <div style={styles.layout}>
        <div style={styles.left}>
          <div style={styles.card}>
            <p style={styles.fromText}>From {restaurantName}</p>

            {cart.map(item => (
              <div key={item.id} style={styles.cartItem}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{item.emoji || '🍽'}</span>
                <span style={styles.itemName}>{item.name}</span>
                <div style={styles.qtyCtrl}>
                  <button style={styles.qtyBtn} onClick={() => updateQty(item.id, -1)}>−</button>
                  <span style={styles.qtyNum}>{item.qty}</span>
                  <button style={styles.qtyBtn} onClick={() => updateQty(item.id, 1)}>+</button>
                </div>
                <span style={styles.itemPrice}>₹{item.price * item.qty}</span>
              </div>
            ))}

            <button style={styles.clearBtn} onClick={clearCart}>Remove all items</button>
          </div>

          <div style={styles.card}>
            <p style={styles.sectionLabel}>Delivery address</p>
            <textarea
              style={styles.textarea}
              rows={3}
              placeholder="Enter your full delivery address with landmark..."
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.right}>
          <div style={styles.card}>
            <h2 style={styles.summaryTitle}>Order summary</h2>
            <div style={styles.summaryRow}><span>Subtotal</span><span>₹{subtotal}</span></div>
            <div style={styles.summaryRow}><span>Delivery fee</span><span>₹{deliveryFee}</span></div>
            <div style={styles.summaryRow}><span>Platform fee</span><span>₹{platformFee}</span></div>
            <div style={styles.divider} />
            <div style={styles.totalRow}><span>Total</span><span>₹{total}</span></div>

            <button
              style={{ ...styles.payBtn, opacity: !address.trim() ? 0.6 : 1 }}
              disabled={!address.trim()}
              onClick={() => setShowPayment(true)}
            >
              Proceed to payment
            </button>
            {!address.trim() && <p style={styles.addrHint}>Please add a delivery address</p>}
          </div>
        </div>
      </div>

      {showPayment && (
        <PaymentModal
          total={total}
          address={address}
          onClose={() => setShowPayment(false)}
          onSuccess={() => { setShowPayment(false); navigate('/orders'); }}
        />
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: 900, margin: '0 auto', padding: '1.5rem' },
  heading: { fontSize: 22, fontWeight: 500, marginBottom: '1.5rem' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.25rem', alignItems: 'start' },
  left: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  right: {},
  card: { background: '#fff', border: '0.5px solid #e5e2da', borderRadius: 14, padding: '1.25rem' },
  fromText: { fontSize: 13, color: '#888', marginBottom: '0.75rem' },
  cartItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '0.5px solid #f0ede7' },
  itemName: { flex: 1, fontSize: 14 },
  qtyCtrl: { display: 'flex', alignItems: 'center', gap: 8, border: '0.5px solid #d5d2ca', borderRadius: 8, padding: '4px 8px' },
  qtyBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, color: '#D85A30', fontWeight: 600 },
  qtyNum: { fontSize: 14, fontWeight: 500, minWidth: 16, textAlign: 'center' },
  itemPrice: { fontSize: 14, fontWeight: 500, minWidth: 60, textAlign: 'right' },
  clearBtn: { background: 'none', border: 'none', color: '#888', fontSize: 12, cursor: 'pointer', marginTop: 12, padding: 0 },
  sectionLabel: { fontSize: 13, fontWeight: 500, marginBottom: 10 },
  textarea: { width: '100%', padding: '10px 12px', border: '0.5px solid #d5d2ca', borderRadius: 8, fontSize: 14, resize: 'none', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' },
  summaryTitle: { fontSize: 16, fontWeight: 500, marginBottom: '1rem' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#666', marginBottom: 10 },
  divider: { borderTop: '0.5px solid #e5e2da', margin: '12px 0' },
  totalRow: { display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 500, marginBottom: '1.25rem' },
  payBtn: { width: '100%', padding: 12, background: '#D85A30', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer' },
  addrHint: { fontSize: 12, color: '#888', textAlign: 'center', marginTop: 8 },
  empty: { textAlign: 'center', padding: '5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  browseBtn: { marginTop: 20, padding: '10px 24px', background: '#D85A30', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer', fontWeight: 500 },
};
