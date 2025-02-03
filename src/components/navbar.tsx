import { SuperFoodLogo } from "@/assets";
import { FC } from "react";
import LoginModal from "./auth-modal";
import useAuthStore from "@/store/auth-store";
import useMenuStore from "@/store/menu-store";
import { checkExistMenu, formatIDR } from "@/lib/helper";
import useOrderStore from "@/store/order-store";
import { useNavigate } from "react-router-dom";

export interface INavbar {
  isFloating?: boolean;
}

const Navbar: FC<INavbar> = ({ isFloating }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { cart } = useMenuStore();
  const { clearCart, addCart, minCart } = useMenuStore();
  const { createOrder } = useOrderStore();
  return (
    <>
      <div
        className={`${isFloating ? "absolute p-10" : "static"} top-0 w-full`}
      >
        <nav
          className={`${
            isFloating ? "rounded-full" : ""
          } navbar bg-opacity-90  justify-between py-4 gap-4 shadow-lg`}
        >
          <div className="navbar-start">
            <a href="/">
              <img src={SuperFoodLogo} className="h-10" alt="super-food-logo" />
            </a>
          </div>
          <div className="navbar-end items-center gap-4">
            {user?.id && (
              <>
                <div className="dropdown relative inline-flex [--auto-close:inside] [--offset:8] [--placement:bottom-end]">
                  <button
                    id="dropdown-scrollable"
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded="false"
                    aria-label="Dropdown"
                    className="btn btn-sm btn-text btn-circle size-[2.125rem]"
                  >
                    <span className="icon-[tabler--shopping-cart-heart] size-[1.375rem]"></span>
                  </button>
                  <ul
                    className="dropdown-menu dropdown-open:opacity-100 hidden"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="dropdown-avatar"
                  >
                    {cart?.length > 0 ? (
                      cart?.map((el) => {
                        const checkExist = checkExistMenu(cart, el);
                        return (
                          <li
                            className="dropdown-header grid grid-cols-[60px,1fr] gap-4"
                            key={checkExist.id}
                          >
                            <img
                              className="w-15 h-15 rounded-lg object-cover"
                              src={checkExist.images[0].url}
                              alt="menu-on-images"
                            />
                            <div>
                              <p className="font-bold text-lg mb-2 max-w-xs text-ellipsis line-clamp-2">
                                {checkExist?.name || "no data"}
                              </p>
                              <p className="text-gray-500 max-w-xs text-sm text-ellipsis line-clamp-2">
                                {checkExist?.description || "no data"}
                              </p>
                              <div className="my-4 items-center grid grid-cols-2">
                                <p className="font-bold text-orange-600">
                                  {formatIDR(checkExist?.price || 0)}
                                </p>
                                <div className="flex items-center justify-end">
                                  {(checkExist?.buyQuantity || 0) > 0 ? (
                                    <div className="flex flex-col items-end">
                                      <div className="join">
                                        <button
                                          onClick={() => {
                                            minCart(el);
                                          }}
                                          className="btn-sm border border-gray-200 join-item hover:border-orange-500 hover:text-orange-500 transition-all"
                                        >
                                          <span className="icon-[tabler--minus] size-3"></span>
                                        </button>
                                        <button
                                          disabled
                                          className="btn-sm border-y border-gray-200 join-item"
                                        >
                                          {checkExist?.buyQuantity}
                                        </button>
                                        <button
                                          onClick={() => {
                                            addCart(el);
                                          }}
                                          disabled={
                                            checkExist?.buyQuantity ===
                                            el?.quantity
                                          }
                                          className={`${
                                            (checkExist?.buyQuantity || 0) <
                                              el?.quantity &&
                                            "hover:border-orange-500 hover:text-orange-500"
                                          } btn-sm border border-gray-200 join-item`}
                                        >
                                          <span className="icon-[tabler--plus] size-3"></span>
                                        </button>
                                      </div>
                                      {(checkExist?.buyQuantity || 0) >=
                                        el?.quantity && (
                                        <span className="text-red-500 text-sm mt-1 block font-medium">
                                          Max quatity reached
                                        </span>
                                      )}
                                    </div>
                                  ) : (
                                    <button
                                      className="btn btn-circle btn-warning"
                                      aria-label="Circle Gradient Icon Button"
                                      onClick={() => {
                                        addCart(el);
                                      }}
                                    >
                                      <span className="icon-[tabler--shopping-cart-heart]"></span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })
                    ) : (
                      <div className="flex items-center justify-center min-h-[20vh] min-w-[320px]">
                        <div className="card-body w-full items-center justify-center">
                          <span className="icon-[tabler--shopping-cart-x] mb-2 size-8"></span>
                          <p className="text-center">Cart empty</p>
                        </div>
                      </div>
                    )}
                    {cart?.length > 0 && (
                      <li className="dropdown-footer gap-2">
                        <button
                          className="btn btn-warning"
                          onClick={() => {
                            createOrder(
                              user.id,
                              cart?.map((el) => ({
                                menu_id: el.id,
                                quantity: el.buyQuantity || 0,
                              }))
                            );
                            clearCart();
                            navigate("/history-order");
                          }}
                        >
                          Checkout
                        </button>
                      </li>
                    )}
                  </ul>
                </div>

                <div className="dropdown relative inline-flex [--auto-close:inside] [--offset:8] [--placement:bottom-end]">
                  <button
                    className="dropdown-toggle flex items-center"
                    id="dropdown-scrollable"
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded="false"
                    aria-label="Dropdown"
                  >
                    <div
                      className={`avatar ${
                        user?.image_profile ? "" : "placeholder"
                      }`}
                    >
                      <div
                        className={`w-10 rounded-full ${
                          user?.image_profile
                            ? ""
                            : "bg-neutral text-neutral-content"
                        }`}
                      >
                        {user?.image_profile ? (
                          <img src={user.image_profile} alt="avatar" />
                        ) : (
                          <span className="icon-[tabler--user] size-6"></span>
                        )}
                      </div>
                    </div>
                  </button>
                  <ul
                    className="dropdown-menu dropdown-open:opacity-100 hidden min-w-60"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="dropdown-avatar"
                  >
                    <li className="dropdown-header gap-2">
                      <div
                        className={`avatar ${
                          user?.image_profile ? "" : "placeholder"
                        }`}
                      >
                        <div
                          className={`w-10 rounded-full ${
                            user?.image_profile
                              ? ""
                              : "bg-neutral text-neutral-content"
                          }`}
                        >
                          {user?.image_profile ? (
                            <img src={user.image_profile} alt="avatar" />
                          ) : (
                            <span className="icon-[tabler--user] size-6"></span>
                          )}
                        </div>
                      </div>
                      <div>
                        <h6 className="text-base-content text-base font-semibold">
                          {user?.username}
                        </h6>
                        <small className="text-base-content/50">
                          {user.nama}
                        </small>
                      </div>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        <span className="icon-[tabler--user]"></span>
                        My Profile
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="/history-order">
                        <span className="icon-[tabler--history-toggle]"></span>
                        History Order
                      </a>
                    </li>
                    <li className="dropdown-footer gap-2">
                      <button
                        className="btn btn-error btn-soft btn-block"
                        onClick={() => {
                          clearCart();
                          logout();
                          window.location.href = "/";
                        }}
                      >
                        <span className="icon-[tabler--logout]"></span>
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            )}
            {!user?.id && <LoginModal />}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
