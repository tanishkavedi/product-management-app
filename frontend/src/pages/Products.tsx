import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  stock_quantity: number;
}

const emptyForm = {
  name: "",
  description: "",
  category: "",
  price: 0,
  currency: "INR",
  stock_quantity: 0,
};

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      setError("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, form);
      } else {
        await api.post("/products", form);
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      setError("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      currency: product.currency,
      stock_quantity: product.stock_quantity,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      setError("Failed to delete product");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h2 style={styles.navTitle}>Product Management</h2>
        <div style={styles.navRight}>
          <span style={styles.welcome}>Hi, {user.name}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>
        {error && <p style={styles.error}>{error}</p>}

        {/* Add Product Button */}
        <div style={styles.topBar}>
          <h3 style={styles.heading}>Products</h3>
          <button
            style={styles.addBtn}
            onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
          >
            + Add Product
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div style={styles.modal}>
            <div style={styles.modalCard}>
              <h3 style={styles.modalTitle}>{editingId ? "Edit Product" : "Add Product"}</h3>
              <input style={styles.input} placeholder="Name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input style={styles.input} placeholder="Description" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <input style={styles.input} placeholder="Category" value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })} />
              <input style={styles.input} placeholder="Price" type="number" value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              <input style={styles.input} placeholder="Currency" value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })} />
              <input style={styles.input} placeholder="Stock Quantity" type="number" value={form.stock_quantity}
                onChange={(e) => setForm({ ...form, stock_quantity: Number(e.target.value) })} />
              <div style={styles.modalButtons}>
                <button style={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
                <button style={styles.saveBtn} onClick={handleSubmit} disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Table */}
        {products.length === 0 ? (
          <p style={styles.empty}>No products yet. Add your first one!</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {["Name", "Category", "Price", "Stock", "Actions"].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} style={styles.tr}>
                    <td style={styles.td}>
                      <p style={styles.productName}>{p.name}</p>
                      <p style={styles.productDesc}>{p.description}</p>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.badge}>{p.category}</span>
                    </td>
                    <td style={styles.td}>{p.currency} {p.price}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.stockBadge,
                        background: p.stock_quantity > 10 ? "#dcfce7" : "#fee2e2",
                        color: p.stock_quantity > 10 ? "#166534" : "#991b1b",
                      }}>
                        {p.stock_quantity} units
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button style={styles.editBtn} onClick={() => handleEdit(p)}>Edit</button>
                      <button style={styles.deleteBtn} onClick={() => handleDelete(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: "100vh", background: "#0f0f0f" },
  navbar: {
    background: "#1a1a1a",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #2a2a2a",
  },
  navTitle: { color: "#ffffff", margin: 0, fontSize: "18px", fontWeight: 600 },
  navRight: { display: "flex", alignItems: "center", gap: "1rem" },
  welcome: { color: "#9ca3af", fontSize: "14px" },
  logoutBtn: {
    padding: "0.4rem 1rem", borderRadius: "8px",
    background: "transparent", color: "#9ca3af",
    border: "1px solid #2e2e2e", cursor: "pointer", fontSize: "13px",
  },
  content: { padding: "2rem" },
  topBar: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "1.5rem",
  },
  heading: { margin: 0, fontSize: "20px", color: "#ffffff" },
  addBtn: {
    padding: "0.6rem 1.2rem", borderRadius: "8px",
    background: "#4F46E5", color: "#fff",
    border: "none", cursor: "pointer", fontSize: "14px", fontWeight: 500,
  },
  error: { color: "#f87171", marginBottom: "1rem" },
  empty: { textAlign: "center", color: "#6b7280", marginTop: "3rem" },
  tableWrapper: {
    background: "#1a1a1a",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #2a2a2a",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "0.75rem 1rem", textAlign: "left",
    background: "#141414", fontSize: "12px",
    color: "#6b7280", borderBottom: "1px solid #2a2a2a",
    textTransform: "uppercase", letterSpacing: "0.05em",
  },
  tr: { borderBottom: "1px solid #222" },
  td: { padding: "0.85rem 1rem", fontSize: "14px", verticalAlign: "middle", color: "#e5e5e5" },
  productName: { margin: 0, fontWeight: 500, color: "#ffffff" },
  productDesc: { margin: 0, fontSize: "12px", color: "#6b7280" },
  badge: {
    padding: "0.2rem 0.6rem", borderRadius: "20px",
    background: "#2e2748", color: "#a5b4fc", fontSize: "12px",
  },
  stockBadge: { padding: "0.2rem 0.6rem", borderRadius: "20px", fontSize: "12px" },
  editBtn: {
    padding: "0.3rem 0.8rem", borderRadius: "6px", marginRight: "0.5rem",
    background: "#1e1b4b", color: "#818cf8",
    border: "1px solid #312e81", cursor: "pointer", fontSize: "13px",
  },
  deleteBtn: {
    padding: "0.3rem 0.8rem", borderRadius: "6px",
    background: "#2d1515", color: "#f87171",
    border: "1px solid #7f1d1d", cursor: "pointer", fontSize: "13px",
  },
  modal: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.7)", display: "flex",
    alignItems: "center", justifyContent: "center", zIndex: 1000,
  },
  modalCard: {
    background: "#1a1a1a", borderRadius: "16px",
    border: "1px solid #2a2a2a",
    padding: "2rem", width: "100%", maxWidth: "480px",
    display: "flex", flexDirection: "column", gap: "0.75rem",
  },
  modalTitle: { margin: 0, fontSize: "18px", color: "#ffffff", fontWeight: 600 },
  input: {
    padding: "0.65rem 1rem", borderRadius: "8px",
    border: "1px solid #2e2e2e",
    background: "#121212", color: "#e5e5e5", fontSize: "14px",
  },
  modalButtons: {
    display: "flex", gap: "0.75rem",
    justifyContent: "flex-end", marginTop: "0.5rem",
  },
  cancelBtn: {
    padding: "0.6rem 1.2rem", borderRadius: "8px",
    background: "#2a2a2a", color: "#9ca3af",
    border: "1px solid #333", cursor: "pointer",
  },
  saveBtn: {
    padding: "0.6rem 1.2rem", borderRadius: "8px",
    background: "#4F46E5", color: "#fff",
    border: "none", cursor: "pointer",
  },
};