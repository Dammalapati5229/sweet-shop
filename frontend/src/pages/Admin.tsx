import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { isLoggedIn } from "../utils/auth";

type Sweet = {
  id: number;
  name: string;
  category: string;
  price: number;
  stockKg: number;
};

export default function Admin() {
  const navigate = useNavigate();

  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stockKg: "",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    price: "",
    stockKg: "",
  });

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }
    loadSweets();
  }, []);

  const loadSweets = async () => {
    const res = await api.get("/sweets");
    setSweets(res.data);
  };

  
  const addSweet = async () => {
    try {
      await api.post("/sweets", {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        stockKg: Number(form.stockKg),
      });

      setForm({ name: "", category: "", price: "", stockKg: "" });
      loadSweets();
    } catch {
      alert("Add failed");
    }
  };

  const startEdit = (s: Sweet) => {
    setEditingId(s.id);
    setEditForm({
      name: s.name,
      category: s.category,
      price: String(s.price),
      stockKg: String(s.stockKg),
    });
  };

  const updateSweet = async (id: number) => {
    try {
      await api.put(`/sweets/${id}`, {
        name: editForm.name,
        category: editForm.category,
        price: Number(editForm.price),
        stockKg: Number(editForm.stockKg),
      });

      setEditingId(null);
      loadSweets();
    } catch {
      alert("Update failed");
    }
  };

  const deleteSweet = async (id: number) => {
    if (!window.confirm("Delete this sweet?")) return;
    await api.delete(`/sweets/${id}`);
    loadSweets();
  };

  return (
    <>
      <Navbar />

      <div style={{ padding: 20 }}>
        <h2>Admin Panel</h2>

        {/* ADD */}
        <h3>Add Sweet</h3>
        <input placeholder="Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Category" value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input placeholder="Price / kg" value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input placeholder="Stock (kg)" value={form.stockKg}
          onChange={(e) => setForm({ ...form, stockKg: e.target.value })} />
        <br />
        <button onClick={addSweet}>Add Sweet</button>

        <hr />

        {/* LIST */}
        <h3>Existing Sweets</h3>

        {sweets.map((s) => (
          <div key={s.id}>
            {editingId === s.id ? (
              <>
                <input value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                <input value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} />
                <input value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />
                <input value={editForm.stockKg}
                  onChange={(e) => setEditForm({ ...editForm, stockKg: e.target.value })} />

                <button onClick={() => updateSweet(s.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <b>{s.name}</b> ({s.category}) <br />
                ₹{s.price} / kg | Stock: {s.stockKg} kg <br />
                <button onClick={() => startEdit(s)}>Edit</button>
                <button onClick={() => deleteSweet(s.id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
