import { create } from "zustand";
import axiosInstance from "@/lib/axiosInstance";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { RegisterForm } from "@/components/auth-modal";

const notyf = new Notyf();

interface User {
  id: number;
  nama: string;
  email: string;
  phone_number: string;
  username: string;
  user_level: number;
  image_profile?: string | null;
  alamat?: string | null;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (val: RegisterForm) => Promise<void>;
  logout: () => void;
  updateProfile: (
    userId: number,
    alamat: string,
    image?: File
  ) => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  token: sessionStorage.getItem("token") || null,
  user: sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user")!)
    : null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.post("/users/login", {
        email,
        password,
      });

      if (response.data.success) {
        const { token, user } = response.data.data;

        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));

        set({ token, user, isLoading: false });

        axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;

        if (user?.user_level === 1) {
          window.location.href = "/admin-dashboard";
        } else {
          window.location.reload();
        }
      } else {
        set({ error: "Login failed", isLoading: false });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      notyf.error({
        position: { x: "center", y: "top" },
        message: error.response?.data?.message || "An error occurred",
      });
      set({
        error: error.response?.data?.message || "An error occurred",
        isLoading: false,
      });
    }
  },

  register: async ({
    email,
    fullName,
    password,
    phoneNumber,
    userName,
    user_level,
  }) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.post("/users/register", {
        email,
        password,
        nama: fullName,
        phone_number: phoneNumber,
        username: userName,
        user_level: user_level,
      });

      if (response.data.success) {
        notyf.success({
          position: { x: "center", y: "top" },
          message: response?.data?.message,
        });
        set({ isLoading: false });
        return response;
      } else {
        set({ error: "Register failed", isLoading: false });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      notyf.error({
        position: { x: "center", y: "top" },
        message: error.response?.data?.message || "An error occurred",
      });
      set({
        error: error.response?.data?.message || "An error occurred",
        isLoading: false,
      });
      return error;
    }
  },

  logout: () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    set({ token: null, user: null });
  },

  updateProfile: async (userId, alamat, image) => {
    set({ isLoading: true, error: null });

    try {
      const formData = new FormData();
      formData.append("alamat", alamat);
      if (image) {
        formData.append("image_profile", image);
      }

      const response = await axiosInstance.patch(
        `/users/update-profile/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        const updatedUser = response.data.data;

        sessionStorage.setItem("user", JSON.stringify(updatedUser));

        set({ user: updatedUser, isLoading: false });
      } else {
        set({ error: "Profile update failed", isLoading: false });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "An error occurred",
        isLoading: false,
      });
    }
  },
}));

export default useAuthStore;
