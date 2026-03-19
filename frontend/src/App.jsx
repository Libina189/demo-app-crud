import { useState, useEffect } from "react";

const API = "http://localhost:8000";

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const res = await fetch(`${API}/items`);
      if (!res.ok) throw new Error("Failed to fetch items");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = editingId ? `${API}/items/${editingId}` : `${API}/items`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Something went wrong");
      }

      setForm({ name: "", description: "" });
      setEditingId(null);
      await fetchItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this item?")) return;
    try {
      const res = await fetch(`${API}/items/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchItems();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(item) {
    setEditingId(item.id);
    setForm({ name: item.name, description: item.description || "" });
  }

  function handleCancel() {
    setEditingId(null);
    setForm({ name: "", description: "" });
    setError("");
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Items Manager</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.subtitle}>{editingId ? "Edit Item" : "Add Item"}</h2>

        <input
          style={styles.input}
          placeholder="Name *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          style={styles.input}
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.buttonRow}>
          <button style={styles.primaryBtn} type="submit" disabled={loading}>
            {loading ? "Saving..." : editingId ? "Update" : "Create"}
          </button>
          {editingId && (
            <button
              style={styles.secondaryBtn}
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Items List */}
      <div style={styles.list}>
        <h2 style={styles.subtitle}>All Items ({items.length})</h2>
        {items.length === 0 && (
          <p style={styles.empty}>No items yet. Create one above!</p>
        )}
        {items.map((item) => (
          <div key={item.id} style={styles.card}>
            <div>
              <strong>{item.name}</strong>
              {item.description && <p style={styles.desc}>{item.description}</p>}
              <small style={styles.meta}>
                Created: {new Date(item.created_at).toLocaleString()}
              </small>
            </div>
            <div style={styles.actions}>
              <button
                style={styles.editBtn}
                onClick={() => handleEdit(item)}
              >
                Edit
              </button>
              <button
                style={styles.deleteBtn}
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 640, margin: "40px auto", padding: "0 20px", fontFamily: "sans-serif" },
  title: { fontSize: 28, fontWeight: 700, marginBottom: 24 },
  subtitle: { fontSize: 18, fontWeight: 600, marginBottom: 12 },
  form: { background: "#f9f9f9", padding: 20, borderRadius: 8, marginBottom: 32 },
  input: { display: "block", width: "100%", padding: "10px 12px", marginBottom: 12, borderRadius: 6, border: "1px solid #ddd", fontSize: 15, boxSizing: "border-box" },
  error: { color: "#c0392b", fontSize: 14, marginBottom: 10 },
  buttonRow: { display: "flex", gap: 10 },
  primaryBtn: { padding: "10px 22px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 15 },
  secondaryBtn: { padding: "10px 22px", background: "#e5e7eb", color: "#333", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 15 },
  list: {},
  card: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "14px 16px", marginBottom: 10 },
  desc: { margin: "4px 0", color: "#555", fontSize: 14 },
  meta: { color: "#999", fontSize: 12 },
  actions: { display: "flex", gap: 8, flexShrink: 0, marginLeft: 12 },
  editBtn: { padding: "6px 14px", background: "#f59e0b", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer" },
  deleteBtn: { padding: "6px 14px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer" },
  empty: { color: "#999", fontStyle: "italic" },
};

export default App;
