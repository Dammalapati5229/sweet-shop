import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Payment() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const { sweetId, name, price, kg } = state;

  const payNow = async () => {
    await api.post(`/sweets/${sweetId}/purchase`, { kg });
    alert("Payment Successful!");
    navigate("/");
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "60px auto",
        padding: 20,
        borderRadius: 10,
        background: "#e8f8ff",
      }}
    >
      <h2>Paytm Payment</h2>

      <p><b>Sweet:</b> {name}</p>
      <p><b>Quantity:</b> {kg} kg</p>
      <p><b>Total:</b> ₹{price * kg}</p>

      <button
        style={{
          width: "100%",
          padding: 10,
          background: "#00baf2",
          color: "white",
          border: "none",
          borderRadius: 5,
          fontSize: 16,
        }}
        onClick={payNow}
      >
        Pay Now
      </button>
    </div>
  );
}
