import Footer from "@/components/footer";
import Layout from "@/components/layout";
import Navbar from "@/components/navbar";
import { formatIDR } from "@/lib/helper";
import useAuthStore from "@/store/auth-store";
import useOrderStore from "@/store/order-store";
import { format } from "date-fns";
import { useEffect } from "react";

const HistoryOrder = () => {
  const { isLoading, fetchOrders, orders } = useOrderStore();
  const { user } = useAuthStore();
  useEffect(() => {
    if (user?.id) fetchOrders(user?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Navbar />
      <Layout>
        <div className="min-h-screen">
          <p className="text-center font-bold text-xl mt-10">List Order</p>
          {!isLoading ? (
            <div className="my-10 flex justify-center flex-wrap gap-6">
              {orders?.length > 0 ? (
                orders?.map((el, indx) => (
                  <div className="card sm:max-w-sm">
                    <div className="card-header">
                      <h5 className="font-bold text-lg">
                        Order Number : {el?.order_number}
                      </h5>
                      <p>
                        {el?.created_at &&
                          format(
                            new Date(el?.created_at),
                            "dd MMMM yyyy HH:mm"
                          )}
                      </p>
                    </div>
                    <div className="card-body">
                      <div key={indx}>
                        <ul>
                          {el?.order_items?.map((val) => (
                            <li
                              className="dropdown-header grid grid-cols-[60px,1fr] gap-4"
                              key={val.menu_id}
                            >
                              <img
                                className="w-15 h-15 rounded-lg object-cover"
                                src={val.image}
                                alt="menu-on-images"
                              />
                              <div>
                                <p className="font-bold text-lg mb-2 max-w-xs text-ellipsis line-clamp-2">
                                  {val?.menu_name || "no data"}
                                </p>

                                <div className="my-4 items-center grid grid-cols-2">
                                  <p className="font-bold text-orange-600">
                                    {formatIDR(val?.quantity * val.price || 0)}
                                  </p>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center min-h-screen w-full">
                  <div className="card-body w-full items-center justify-center">
                    <span className="icon-[tabler--error-404] mb-2 size-8"></span>
                    <p className="text-center">order not found</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="my-10 flex flex-wrap gap-6">
              <div className="skeleton skeleton-animated h-72 w-72"></div>
              <div className="skeleton skeleton-animated h-72 w-72"></div>
              <div className="skeleton skeleton-animated h-72 w-72"></div>
              <div className="skeleton skeleton-animated h-72 w-72"></div>
              <div className="skeleton skeleton-animated h-72 w-72"></div>
              <div className="skeleton skeleton-animated h-72 w-72"></div>
              <div className="skeleton skeleton-animated h-72 w-72"></div>
              <div className="skeleton skeleton-animated h-72 w-72"></div>
            </div>
          )}
        </div>
      </Layout>
      <Footer />
    </div>
  );
};

export default HistoryOrder;
