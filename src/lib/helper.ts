import { IMenu } from "@/store/menu-store";

export const formatIDR = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const checkExistMenu = (cart: IMenu[], menu: IMenu) => {
  const existMenu = cart?.find((el) => el.id === menu.id);

  if (existMenu) {
    return existMenu;
  } else {
    return menu;
  }
};
