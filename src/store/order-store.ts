import { create } from "zustand";
import axiosInstance from "@/lib/axiosInstance";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf();

export interface IOrderItem {
  image: string;
  price: number;
  menu_id: number;
  quantity: number;
  menu_name: string;
}

export interface IOrderCreatePayload {
  menu_id: number;
  quantity: number;
}

export interface IOrder {
  id: number;
  order_number: string;
  user_id: number;
  created_at: string;
  order_items: IOrderItem[];
}

interface IOrderStore {
  orders: IOrder[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: (user_id: number) => Promise<void>;
  createOrder: (
    user_id: number,
    menu_items: IOrderCreatePayload[]
  ) => Promise<void>;
}

const useOrderStore = create<IOrderStore>((set) => ({
  orders: [],
  isLoading: false,
  error: null,

  fetchOrders: async (user_id: number) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.get("/order", {
        params: { user_id },
      });

      set({ orders: response.data.data, isLoading: false });
    } catch (error) {
      console.error("🚨 Fetch Orders Error:", error);
      set({ error: "Failed to fetch orders.", isLoading: false });
    }
  },

  createOrder: async (user_id: number, menu_items: IOrderCreatePayload[]) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.post("/order", {
        user_id,
        menu_items,
      });

      console.log("✅ Order Placed:", response.data);
      set((state) => ({
        orders: [...state.orders, response.data.data],
        isLoading: false,
      }));
      notyf.success({
        position: { x: "center", y: "top" },
        message: "Order Placed Success!",
      });
    } catch (error) {
      console.error("🚨 Create Order Error:", error);
      set({ error: "Failed to create order.", isLoading: false });
    }
  },
}));

export default useOrderStore;
