import api from "./axios";

export const getSweets = () => api.get("/sweets");

export const purchaseSweet = (id: number) =>
  api.post(`/sweets/${id}/purchase`);
