import { create } from 'zustand';
import { persist } from 'zustand/middleware';

function getMaxStock(productOrItem) {
  const stock = Number(productOrItem?.stock);
  return Number.isFinite(stock) && stock > 0 ? stock : 0;
}

function clampQuantity(quantity, maxStock) {
  return Math.max(1, Math.min(quantity, maxStock));
}

export const useCartStore = create(
  persist(
    (set) => ({
      cart: [],
      addToCart: (product) => set((state) => {
        const maxStock = getMaxStock(product);

        if (maxStock <= 0) {
          return state;
        }

        const existingItem = state.cart.find((item) => item.id === product.id);
        if (existingItem) {
          const nextQuantity = clampQuantity(existingItem.quantity + 1, maxStock);

          if (nextQuantity === existingItem.quantity) {
            return state;
          }

          return {
            cart: state.cart.map((item) => 
              item.id === product.id 
                ? { ...item, quantity: nextQuantity } 
                : item
            )
          };
        }
        return { cart: [...state.cart, { ...product, quantity: 1 }] };
      }),
      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter((item) => item.id !== productId)
      })),
      updateQuantity: (productId, quantity) => set((state) => ({
        cart: state.cart.map((item) => {
          if (item.id !== productId) {
            return item;
          }

          const maxStock = getMaxStock(item);
          const nextQuantity =
            maxStock > 0 ? clampQuantity(quantity, maxStock) : Math.max(1, quantity);

          return { ...item, quantity: nextQuantity };
        })
      })),
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        let total = 0;
        // Zustand state getters require getting the state first inside the function
        return total;
      }
    }),
    {
      name: 'kareh-cart-storage',
    }
  )
);
