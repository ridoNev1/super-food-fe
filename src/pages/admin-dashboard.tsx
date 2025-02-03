import Footer from "@/components/footer";
import Layout from "@/components/layout";
import Navbar from "@/components/navbar";
import { formatIDR } from "@/lib/helper";
import useMenuStore from "@/store/menu-store";
import { useEffect } from "react";
// import useAuthStore from "@/store/auth-store";
const AdminDashboard = () => {
  const { listMenu, fetchListMenu } = useMenuStore();
  useEffect(() => {
    fetchListMenu(10, 1);
  }, [fetchListMenu]);
  // const { user } = useAuthStore();

  return (
    <div>
      <Navbar />
      <Layout>
        <div className="min-h-screen">
          <p className="text-center font-bold text-xl my-10">List Menu</p>
          <div className="card w-full overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Images</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listMenu?.isLoading ? (
                  <>
                    <span className="loading loading-bars loading-lg"></span>
                  </>
                ) : listMenu?.data?.length > 0 ? (
                  listMenu?.data?.map((el) => {
                    return (
                      <tr>
                        <td className="text-nowrap">
                          <img
                            src={el?.images?.[0]?.url || ""}
                            alt="images-menu"
                            className="w-10 h-10 rounded-md"
                          />
                        </td>
                        <td className="text-nowrap">{el?.name}</td>
                        <td className="text-nowrap max-w-lg text-ellipsis line-clamp-1">
                          {el?.description}
                        </td>
                        <td>
                          <span className="text-nowrap">
                            {formatIDR(el?.price ?? 0)}
                          </span>
                        </td>
                        <td className="text-nowrap">{el?.quantity}</td>
                        <td>
                          <button
                            className="btn btn-circle btn-text btn-sm"
                            aria-label="Action button"
                          >
                            <span className="icon-[tabler--pencil] size-5"></span>
                          </button>
                          <button
                            className="btn btn-circle btn-text btn-sm"
                            aria-label="Action button"
                          >
                            <span className="icon-[tabler--trash] size-5"></span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <div className="flex items-center justify-center min-h-[40vh] w-full">
                    <div className="card-body w-full items-center justify-center">
                      <span className="icon-[tabler--error-404] mb-2 size-8"></span>
                      <p className="text-center">Data not found.</p>
                    </div>
                  </div>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
