import { FoodBanner1, FoodBanner2, FoodBanner3 } from "@/assets";
import Footer from "@/components/footer";
import Layout from "@/components/layout";
import Navbar from "@/components/navbar";
import { checkExistMenu, formatIDR } from "@/lib/helper";
import useAuthStore from "@/store/auth-store";
import useMenuStore from "@/store/menu-store";
import { FC, useEffect, useState } from "react";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import useDebounce from "@/hooks/useDebounce";

const notyf = new Notyf();

const Homepage: FC = () => {
  const { listMenu, fetchListMenu, cart, addCart, minCart } = useMenuStore();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchListMenu(10, 1);
  }, [fetchListMenu]);

  useEffect(() => {
    fetchListMenu(10, 1, debouncedSearch);
  }, [debouncedSearch, fetchListMenu]);

  const categories = [
    "Ricebox",
    "Bakso",
    "Pizza",
    "Drinks",
    "Healthy Food",
    "Pizza",
    "Hot Spicy",
  ];

  return (
    <div className="relative">
      <div className="h-80 w-full bg-contain rounded-b-[100px] shadow-lg">
        <div className="w-full h-80 xl:rounded-b-[100px] overflow-hidden bg-black/5">
          <div
            id="auto-play"
            data-carousel='{ "loadingClasses": "opacity-0", "isAutoPlay": true, "speed": 3000 }'
            className="relative w-full"
          >
            <div className="carousel rounded-none">
              <div className="carousel-body h-80 opacity-0">
                <div className="carousel-slide">
                  <img
                    src={FoodBanner1}
                    className="size-full object-cover"
                    alt="game"
                  />
                </div>

                <div className="carousel-slide">
                  <img
                    src={FoodBanner2}
                    className="size-full object-cover"
                    alt="vrbox"
                  />
                </div>

                <div className="carousel-slide">
                  <img
                    src={FoodBanner3}
                    className="size-full object-cover"
                    alt="laptop"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Navbar isFloating />
      <Layout>
        <>
          <div className="grid lg:grid-cols-1 xl:grid-cols-[1fr,.5fr] gap-8 items-center mt-8">
            <div className="flex flex-wrap items-center justify-center xl:justify-between gap-4">
              {categories.map((category, index) => (
                <span
                  key={index}
                  className="text-lg cursor-pointer hover:badge-warning transition hover:badge-outline px-4 py-2 rounded-full badge-outline badge-secondary"
                >
                  {category}
                </span>
              ))}
            </div>
            <div className="input-group py-1 w-full shadow rounded-full flex items-center">
              <label className="sr-only" htmlFor="searchInput">
                Search
              </label>
              <input
                value={search}
                onChange={(e) => setSearch(e?.target?.value || "")}
                type="search"
                id="searchInput"
                className="input grow rounded-e-full pl-6"
                placeholder="Looking For Something ?"
              />
              <span className="input-group-text">
                <span className="icon-[tabler--search] text-base-content/80 size-5"></span>
              </span>
            </div>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,_288px)] justify-center items-center gap-6 mx-auto my-10">
            {listMenu?.isLoading ? (
              <>
                <div className="skeleton skeleton-animated h-72 w-72"></div>
                <div className="skeleton skeleton-animated h-72 w-72"></div>
                <div className="skeleton skeleton-animated h-72 w-72"></div>
                <div className="skeleton skeleton-animated h-72 w-72"></div>
                <div className="skeleton skeleton-animated h-72 w-72"></div>
                <div className="skeleton skeleton-animated h-72 w-72"></div>
                <div className="skeleton skeleton-animated h-72 w-72"></div>
                <div className="skeleton skeleton-animated h-72 w-72"></div>
              </>
            ) : listMenu?.data?.length > 0 ? (
              listMenu?.data?.map((el) => {
                const checkExist = checkExistMenu(cart, el);
                return (
                  <div className="w-72 h-[470px]" key={checkExist.id}>
                    <img
                      className="w-72 h-72 rounded-lg object-cover"
                      src={checkExist.images[0].url}
                      alt="menu-on-images"
                    />
                    <p className="font-bold text-xl my-2">
                      {checkExist?.name || "no data"}
                    </p>
                    <p className="text-gray-500 text-ellipsis line-clamp-2">
                      {checkExist?.description || "no data"}
                    </p>
                    <div className="my-4 items-center grid grid-cols-2">
                      <p className="font-bold text-lg text-orange-600">
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
                                  checkExist?.buyQuantity === el?.quantity
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
                            {(checkExist?.buyQuantity || 0) >= el?.quantity && (
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
                              if (user?.id) {
                                addCart(el);
                              } else {
                                notyf.error({
                                  position: { x: "center", y: "top" },
                                  message: "Please login first",
                                });
                              }
                            }}
                          >
                            <span className="icon-[tabler--shopping-cart-heart]"></span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex items-center justify-center min-h-[40vh] w-full">
                <div className="card-body w-full items-center justify-center">
                  <span className="icon-[tabler--error-404] mb-2 size-8"></span>
                  <p className="text-center">
                    Data not found, please contact the student.
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      </Layout>
      <Footer />
    </div>
  );
};

export default Homepage;
