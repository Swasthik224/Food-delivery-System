import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export default function OwnerPage() {

  const [menu, setMenu] = useState([]);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Biryani',
    imageUrl: '',
    available: true
  });

  // ✅ Restaurant ID
const [restaurantId, setRestaurantId] =
  useState(null);

  // ✅ Fallback image
  const fallbackImage =
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop';

  // ✅ Load menu
  const loadMenu = async () => {

    try {

      const data =
        await api.getMenu(restaurantId);

      setMenu(data);

    } catch (err) {

      console.error(
        'Error loading menu:',
        err
      );

    }
  };

  // ✅ Auto refresh
  useEffect(() => {

    loadMenu();

    const interval = setInterval(() => {
      loadMenu();
    }, 3000);

    return () => clearInterval(interval);

  }, []);

  // ✅ Form change
  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked
    } = e.target;

    setForm({
      ...form,
      [name]:
        type === 'checkbox'
          ? checked
          : value
    });
  };

  // ✅ ADD ITEM
  const addItem = async () => {

    try {

      const payload = {

        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        imageUrl: form.imageUrl,
        available: form.available,

        // ✅ IMPORTANT
        restaurant: {
          id: restaurantId
        }
      };

      console.log(
        'SENDING:',
        payload
      );

      const response = await fetch(
        'http://localhost:8080/api/menu',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {

        throw new Error(
          'Failed to add item'
        );

      }

      // ✅ reload menu
      loadMenu();

      // ✅ clear form
      setForm({
        name: '',
        description: '',
        price: '',
        category: 'Biryani',
        imageUrl: '',
        available: true
      });

    } catch (err) {

      console.error(
        'Error adding item:',
        err
      );

    }
  };

  // ✅ Toggle availability
  const toggleAvailability = async (id) => {

    try {

      await api.updateAvailability(id);

      loadMenu();

    } catch (err) {

      console.error(
        'Error updating availability:',
        err
      );

    }
  };

  return (

    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>

        <h2>
          🍽 Owner Dashboard
        </h2>

        <p>
          Manage your restaurant menu
        </p>

      </div>

      {/* ADD ITEM */}
      <div style={styles.card}>

        <h3>
          ➕ Add New Item
        </h3>

        <div style={styles.grid}>

          <input
            name="name"
            placeholder="Item name"
            value={form.name}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            style={styles.input}
          />

        </div>

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          style={styles.input}
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          style={styles.input}
        >
          <option>Biryani</option>
          <option>Pizza</option>
          <option>Burger</option>
          <option>Drinks</option>
          <option>Desserts</option>
        </select>

        <input
          name="imageUrl"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={handleChange}
          style={styles.input}
        />

        {/* PREVIEW */}
        <img
          src={
            form.imageUrl ||
            fallbackImage
          }
          alt="preview"
          style={styles.preview}
        />

        <label style={styles.checkbox}>

          <input
            type="checkbox"
            name="available"
            checked={form.available}
            onChange={handleChange}
          />

          Available

        </label>

        <button
          onClick={addItem}
          style={styles.button}
        >
          Add Item
        </button>

      </div>

      {/* MENU */}
      <div style={styles.card}>

        <h3>
          📋 Your Menu
        </h3>

        {menu.length === 0 ? (

          <p>No items found</p>

        ) : (

          <div style={styles.menuGrid}>

            {menu.map(item => (

              <div
                key={item.id}
                style={styles.menuCard}
              >

                <img
                  src={
                    item.imageUrl ||
                    fallbackImage
                  }
                  alt={item.name}
                  style={styles.menuImage}
                />

                <h4>
                  {item.name}
                </h4>

                <p>
                  ₹{item.price}
                </p>

                <small>
                  {item.category}
                </small>

                <button
                  onClick={() =>
                    toggleAvailability(item.id)
                  }
                  style={{
                    ...styles.toggle,
                    background:
                      item.available
                        ? '#4CAF50'
                        : '#888'
                  }}
                >
                  {item.available
                    ? 'Available'
                    : 'Disabled'}
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );
}

const styles = {

  container: {
    padding: '20px',
    background: '#f4f6f8',
    minHeight: '100vh'
  },

  header: {
    marginBottom: '20px'
  },

  card: {
    background: '#fff',
    padding: '20px',
    marginBottom: '20px',
    borderRadius: '12px',
    boxShadow:
      '0 2px 8px rgba(0,0,0,0.1)'
  },

  grid: {
    display: 'flex',
    gap: '10px'
  },

  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc'
  },

  button: {
    padding: '10px',
    background: '#D85A30',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },

  checkbox: {
    display: 'block',
    marginBottom: '10px'
  },

  preview: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    marginBottom: '10px',
    borderRadius: '8px'
  },

  menuGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '15px'
  },

  menuCard: {
    background: '#fafafa',
    padding: '10px',
    borderRadius: '10px',
    textAlign: 'center'
  },

  menuImage: {
    width: '100%',
    height: '120px',
    objectFit: 'cover',
    borderRadius: '8px'
  },

  toggle: {
    marginTop: '10px',
    padding: '6px',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }

};