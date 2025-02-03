import { create } from "zustand";
import axiosInstance from "@/lib/axiosInstance";
import { IPagination } from "@/lib/basic-type.type";
import Cookies from "universal-cookie";
import "notyf/notyf.min.css";
import { Notyf } from "notyf";

const notyf = new Notyf();

const cookies = new Cookies(null, { path: "/" });

export interface IMenu {
  id: number;
  name: string;
  price: number;
  description: string;
  quantity: number;
  buyQuantity?: number;
  images: {
    id: number;
    url: string;
  }[];
}

interface IMenuStore {
  listMenu: {
    data: IMenu[];
    pagination?: IPagination;
    isLoading: boolean;
  };
  cart: IMenu[];
  fetchListMenu: (
    limit?: number,
    page?: number,
    search?: string
  ) => Promise<void>;
  addCart: (menu: IMenu) => void;
  minCart: (menu: IMenu) => void;
  clearCart: () => void;
  loadCartFromCookies: () => void;
  createMenu: (menuData: FormData) => Promise<unknown>;
  editMenu: (menuId: number, menuData: FormData) => Promise<unknown>;
  isCreating: boolean;
  isEditing: boolean;
  isDeleting: boolean;
  deleteMenu: (menuId: number) => Promise<unknown>;
}

const getCartFromCookies = (): IMenu[] => {
  try {
    const storedCart = cookies.get("cart");
    if (!storedCart) return [];

    return typeof storedCart === "string" ? JSON.parse(storedCart) : storedCart;
  } catch (error) {
    console.error("🚨 Error parsing cart from cookies:", error);
    return [];
  }
};

const saveCartToCookies = (cart: IMenu[]) => {
  try {
    cookies.set("cart", JSON.stringify(cart), { path: "/" });
  } catch (error) {
    console.error("🚨 Error saving cart to cookies:", error);
  }
};

const useMenuStore = create<IMenuStore>((set) => ({
  listMenu: {
    data: [],
    pagination: undefined,
    isLoading: false,
  },

  cart: getCartFromCookies(),
  isCreating: false,
  isEditing: false,
  isDeleting: false,

  addCart: (menu) => {
    set((state) => {
      const existingItem = state.cart.find((el) => el.id === menu.id);
      let updatedCart;

      if (existingItem) {
        updatedCart = state.cart.map((item) =>
          item.id === menu.id
            ? {
                ...item,
                buyQuantity: Math.min(
                  (item.buyQuantity || 0) + 1,
                  item.quantity
                ),
              }
            : item
        );
      } else {
        updatedCart = [...state.cart, { ...menu, buyQuantity: 1 }];
      }

      saveCartToCookies(updatedCart);

      return { cart: updatedCart };
    });
  },

  minCart: (menu) => {
    set((state) => {
      const existingItem = state.cart.find((el) => el.id === menu.id);
      if (!existingItem) return { cart: state.cart };

      let updatedCart;
      if (existingItem.buyQuantity && existingItem.buyQuantity > 1) {
        updatedCart = state.cart.map((item) =>
          item.id === menu.id
            ? { ...item, buyQuantity: (item.buyQuantity || 1) - 1 }
            : item
        );
      } else {
        updatedCart = state.cart.filter((item) => item.id !== menu.id);
      }

      saveCartToCookies(updatedCart);

      return { cart: updatedCart };
    });
  },

  clearCart: () => {
    cookies.remove("cart", { path: "/" });
    set({ cart: [] });
  },

  loadCartFromCookies: () => {
    set({ cart: getCartFromCookies() });
  },

  fetchListMenu: async (limit = 10, page = 1, search = "") => {
    set((state) => ({ listMenu: { ...state.listMenu, isLoading: true } }));

    try {
      const response = await axiosInstance.get("/master-menu/menu", {
        params: { limit, page, search },
      });

      set(() => ({
        listMenu: {
          data: response.data.data,
          pagination: response.data.pagination,
          isLoading: false,
        },
      }));
    } catch (error) {
      console.error("🚨 Fetch Menu Error:", error);
      set((state) => ({ listMenu: { ...state.listMenu, isLoading: false } }));
    }
  },

  createMenu: async (menuData: FormData) => {
    set({ isCreating: true });
    try {
      const response = await axiosInstance.post("/master-menu/menu", menuData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      notyf.success({
        position: { x: "center", y: "top" },
        message: response?.data?.message,
      });

      return response;
    } catch (error) {
      console.error("🚨 Create Menu Error:", error);
      return error;
    } finally {
      set({ isCreating: false });
    }
  },
  editMenu: async (menuId: number, menuData: FormData) => {
    set({ isEditing: true });

    try {
      const response = await axiosInstance.put(
        `/master-menu/menu/${menuId}`,
        menuData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      notyf.success({
        position: { x: "center", y: "top" },
        message: response?.data?.message,
      });

      return response;
    } catch (error) {
      console.error("🚨 Edit Menu Error:", error);
      return error;
    } finally {
      set({ isEditing: false });
    }
  },
  deleteMenu: async (menuId: number) => {
    set({ isDeleting: true });
    try {
      const response = await axiosInstance.delete(
        `/master-menu/menu/${menuId}`
      );

      notyf.success({
        position: { x: "center", y: "top" },
        message: response?.data?.message,
      });

      return response;
    } catch (error) {
      console.error("🚨 Delete Menu Error:", error);
      return error;
    } finally {
      set({ isDeleting: false });
    }
  },
}));

export default useMenuStore;
