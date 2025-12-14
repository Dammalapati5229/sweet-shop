import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useEffect, useState } from "react";

type Sweet = {
  id: number;
  name: string;
  category: string;
  price: number;   // price per kg
  stockKg: number;
};

export default function Dashboard() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [kg, setKg] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    loadSweets();
  }, []);

  const loadSweets = async () => {
    const res = await api.get("/sweets");
    setSweets(res.data);
  };

  const goToPayment = (sweet: Sweet) => {
    navigate("/payment", {
      state: {
        sweetId: sweet.id,
        name: sweet.name,
        price: sweet.price,
        kg: kg,
      },
    });
  };

  return (
    <>
      <Navbar />

      <div style={{ padding: 20 }}>
        <h2>Sweets</h2>

        {sweets.map((s) => (
          <div
            key={s.id}
            style={{
              border: "1px solid #ccc",
              padding: 15,
              marginBottom: 10,
              borderRadius: 6,
            }}
          >
            <h4>{s.name}</h4>
            <p>Price: ₹{s.price} / kg</p>
            <p>Stock: {s.stockKg} kg</p>

            <input
              type="number"
              min="0.5"
              step="0.5"
              value={kg}
              onChange={(e) => setKg(Number(e.target.value))}
            />

            <br /><br />

            <button
              disabled={s.stockKg === 0}
              onClick={() => goToPayment(s)}
            >
              {s.stockKg === 0 ? "Out of Stock" : "Purchase"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
