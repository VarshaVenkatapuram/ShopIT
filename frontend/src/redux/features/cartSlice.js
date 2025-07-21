import { createSlice } from "@reduxjs/toolkit";

const storedCartItems = localStorage.getItem("cartItems");
const storedShippingInfo=localStorage.getItem("shippingInfo");

const initialState = {
  cartItems: storedCartItems && storedCartItems !== "undefined"
    ? JSON.parse(storedCartItems)
    : [],
    shippingInfo:storedShippingInfo && storedShippingInfo !== "undefined"
    ? JSON.parse(storedShippingInfo)
    : [],
};

export const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    setCartItem: (state, action) => {
      const item = action.payload;

      const isItemExist = state.cartItems.find(
        (i) => i.product === item.product
      );

      if (isItemExist) {
        state.cartItems = state.cartItems.map((i) =>
          i.product === item.product ? item : i
        );
      } else {
        state.cartItems.push(item);
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    removeCartItem: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (i) => i.product !== action.payload
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      localStorage.removeItem("cartItems");
      state.cartItems=[];
    },
    saveShippingInfo: (state, action) => {
        state.shippingInfo=action.payload;

        localStorage.setItem("shippingInfo", JSON.stringify(state.shippingInfo));
    }
  },
});

export default cartSlice.reducer;
export const { setCartItem, removeCartItem ,saveShippingInfo,clearCart} = cartSlice.actions;
