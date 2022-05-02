import create from "zustand";

const cartStore = create((set) => ({
  cart: [],
  setCart: (products) => set((state) => ({ cart: products })),
}));

export default cartStore;
