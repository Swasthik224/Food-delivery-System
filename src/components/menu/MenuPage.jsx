import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/cart';
import { api } from '../../services/api';

export default function MenuPage() {

  const { id } = useParams();
  const navigate = useNavigate();

  const { cart, addItem, updateQty } =
    useContext(CartContext);

  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ reusable loader
  const loadData = async () => {
    try {

      const restaurants =
        await api.getRestaurants();

      const menuItems =
        await api.getMenu(id);

      setRestaurant(
        restaurants.find(
          r => String(r.id) === String(id)
        )
      );

      // ✅ only available items
      setMenu(
        menuItems.filter(item => item.available)
      );

    } catch (err) {
      console.error(
        'Error loading menu:',
        err
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ AUTO REFRESH
  useEffect(() => {

    loadData();

    // 🔥 refresh every 3 sec
    const interval = setInterval(() => {
      loadData();
    }, 3000);

    return () => clearInterval(interval);

  }, [id]);

  const getCartQty = (itemId) =>
    cart.find(c => c.id === itemId)?.qty || 0;

  const categories =
    [...new Set(menu.map(i => i.category))];

  if (loading) {
    return (
      <div style={styles.loading}>
        Loading menu...
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div style={styles.loading}>
        Restaurant not found.
      </div>
    );
  }

  return (
    <div style={styles.page}>

      <button
        style={styles.backBtn}
        onClick={() => navigate('/')}
      >
        ← Back to restaurants
      </button>

      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.restName}>
            {restaurant.name}
          </h1>

          <p style={styles.restMeta}>
            {restaurant.cuisine}
            {' · ★ '}
            {restaurant.rating}
            {' · '}
            {restaurant.deliveryTime} min
            {' · ₹'}
            {restaurant.deliveryFee}
            {' delivery fee'}
          </p>
        </div>
      </div>

      {/* MENU */}
      {categories.map(cat => (

        <div key={cat} style={styles.section}>

          <div style={styles.catTitle}>
            {cat}
          </div>

          {menu
            .filter(i => i.category === cat)
            .map(item => {

              const qty =
                getCartQty(item.id);

              return (

                <div
                  key={item.id}
                  style={styles.menuItem}
                >

                  <div style={styles.itemInfo}>

                    <span style={styles.itemName}>
                      {item.name}
                    </span>

                    <span style={styles.itemDesc}>
                      {item.description}
                    </span>

                    <span style={styles.itemPrice}>
                      ₹{item.price}
                    </span>

                  </div>

                  <div style={styles.itemActions}>

                    {qty === 0 ? (

                      <button
                        style={styles.addBtn}
                        onClick={() =>
                          addItem(item, Number(id))
                        }
                      >
                        Add
                      </button>

                    ) : (

                      <div style={styles.qtyCtrl}>

                        <button
                          style={styles.qtyBtn}
                          onClick={() =>
                            updateQty(item.id, -1)
                          }
                        >
                          −
                        </button>

                        <span style={styles.qtyNum}>
                          {qty}
                        </span>

                        <button
                          style={styles.qtyBtn}
                          onClick={() =>
                            updateQty(item.id, 1)
                          }
                        >
                          +
                        </button>

                      </div>

                    )}

                  </div>

                </div>

              );
            })}

        </div>

      ))}

      {/* CART BAR */}
      {cart.length > 0 && (

        <div style={styles.cartBar}>

          <span style={styles.cartBarText}>
            {cart.reduce(
              (s, i) => s + i.qty,
              0
            )} items · ₹
            {cart.reduce(
              (s, i) =>
                s + i.price * i.qty,
              0
            )}
          </span>

          <button
            style={styles.cartBarBtn}
            onClick={() =>
              navigate('/cart')
            }
          >
            View cart →
          </button>

        </div>

      )}

    </div>
  );
}

const styles = {

  page: {
    maxWidth: 700,
    margin: '0 auto',
    padding: '1.5rem 1.5rem 6rem'
  },

  loading: {
    textAlign: 'center',
    padding: '4rem',
    color: '#888'
  },

  backBtn: {
    background: 'none',
    border: 'none',
    color: '#888',
    cursor: 'pointer',
    fontSize: 13,
    marginBottom: '1rem',
    padding: 0
  },

  header: {
    marginBottom: '2rem'
  },

  restName: {
    fontSize: 22,
    fontWeight: 500,
    marginBottom: 6
  },

  restMeta: {
    fontSize: 13,
    color: '#888'
  },

  section: {
    marginBottom: '2rem'
  },

  catTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingBottom: 10,
    borderBottom: '0.5px solid #e5e2da',
    marginBottom: 4
  },

  menuItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '14px 0',
    borderBottom: '0.5px solid #f0ede7'
  },

  itemInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3
  },

  itemName: {
    fontSize: 14,
    fontWeight: 500
  },

  itemDesc: {
    fontSize: 12,
    color: '#888'
  },

  itemPrice: {
    fontSize: 14,
    fontWeight: 500,
    color: '#3B6D11'
  },

  addBtn: {
    padding: '7px 20px',
    border: '0.5px solid #D85A30',
    color: '#D85A30',
    background: 'transparent',
    borderRadius: 8,
    cursor: 'pointer'
  },

  qtyCtrl: {
    display: 'flex',
    gap: 10
  },

  qtyBtn: {
    border: 'none',
    cursor: 'pointer',
    color: '#D85A30'
  },

  qtyNum: {
    fontWeight: 'bold'
  },

  cartBar: {
    position: 'fixed',
    bottom: 24,
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#1a1a1a',
    color: '#fff',
    borderRadius: 12,
    padding: '14px 20px',
    display: 'flex',
    gap: 20
  },

  cartBarText: {
    fontSize: 14
  },

  cartBarBtn: {
    background: '#D85A30',
    border: 'none',
    color: '#fff',
    padding: '8px 18px',
    borderRadius: 8
  }

};