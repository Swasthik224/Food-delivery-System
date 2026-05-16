import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth';
import { CartContext } from '../../context/cart';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const isAdmin = user?.role === 'ADMIN';

  const navLinks = isAdmin
    ? [{ to: '/', label: 'Restaurants' }, { to: '/orders', label: 'Orders' }, { to: '/admin', label: 'Dashboard' }]
    : [{ to: '/', label: 'Restaurants' }, { to: '/orders', label: 'My Orders' }];

  const isActive = (to) => location.pathname === to || (to === '/' && location.pathname.startsWith('/restaurant'));

  const handleLogout = () => { logout(); navigate('/auth'); };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🍽 FoodRush</Link>

      <div style={styles.links}>
        {navLinks.map(({ to, label }) => (
          <Link key={to} to={to} style={{ ...styles.link, ...(isActive(to) ? styles.activeLink : {}) }}>
            {label}
          </Link>
        ))}
      </div>

      <div style={styles.right}>
        <Link to="/cart" style={styles.cartBtn}>
          <span>🛒 Cart</span>
          {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
        </Link>

        <div style={styles.userChip}>
          <span style={styles.avatar}>{user?.name?.[0]?.toUpperCase()}</span>
          <span style={styles.userName}>{user?.name}</span>
          {isAdmin && <span style={styles.adminTag}>Admin</span>}
        </div>

        <button style={styles.logoutBtn} onClick={handleLogout}>Sign out</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: { position: 'sticky', top: 0, zIndex: 100, background: '#fff', borderBottom: '0.5px solid #e5e2da', padding: '0 1.5rem', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' },
  brand: { fontSize: 18, fontWeight: 600, color: '#D85A30', textDecoration: 'none', flexShrink: 0 },
  links: { display: 'flex', gap: 4 },
  link: { padding: '6px 14px', borderRadius: 8, fontSize: 13, textDecoration: 'none', color: '#666', transition: 'all 0.15s' },
  activeLink: { background: '#F5F3F0', color: '#1a1a1a', fontWeight: 500 },
  right: { display: 'flex', alignItems: 'center', gap: 10 },
  cartBtn: { position: 'relative', padding: '6px 14px', borderRadius: 8, border: '0.5px solid #d5d2ca', background: 'transparent', fontSize: 13, cursor: 'pointer', color: '#1a1a1a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 },
  badge: { position: 'absolute', top: -5, right: -5, background: '#D85A30', color: '#fff', borderRadius: '50%', width: 17, height: 17, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 },
  userChip: { display: 'flex', alignItems: 'center', gap: 6 },
  avatar: { width: 28, height: 28, borderRadius: '50%', background: '#FAECE7', color: '#993C1D', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  userName: { fontSize: 13, color: '#444', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  adminTag: { fontSize: 10, background: '#E6F1FB', color: '#185FA5', padding: '2px 8px', borderRadius: 999, fontWeight: 500 },
  logoutBtn: { padding: '6px 12px', borderRadius: 8, border: '0.5px solid #d5d2ca', background: 'transparent', fontSize: 13, cursor: 'pointer', color: '#666' },
};
