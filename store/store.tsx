import create from "zustand";

const store = create((set) => ({
  products: [],
  setProducts: (product) => set((state) => ({ products: [...product] })),
}));

export default store;
