import Footer from "@/components/footer";
import Layout from "@/components/layout";
import ModalAddMenu from "@/components/modal-add-menu";
import Navbar from "@/components/navbar";
import { formatIDR } from "@/lib/helper";
import useMenuStore, { IMenu } from "@/store/menu-store";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/auth-store";
import { useNavigate } from "react-router-dom";
import ModalEditMenu from "@/components/modal-edit-menu";
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { listMenu, fetchListMenu, deleteMenu, isDeleting } = useMenuStore();
  const { user } = useAuthStore();
  const [selectedMenu, setselectedMenu] = useState<IMenu>({
    id: 0,
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    images: [],
  });

  useEffect(() => {
    fetchListMenu(10, 1);
  }, [fetchListMenu]);

  useEffect(() => {
    if (user?.user_level === 2) navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Navbar />
      <Layout>
        <div className="min-h-screen">
          <p className="text-center font-bold text-xl my-10">List Menu</p>
          <div className="card p-6 w-full overflow-x-auto">
            <div className="flex items-center my-4 justify-between">
              <ModalEditMenu selectedMenu={selectedMenu} />
              <ModalAddMenu />
            </div>
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
                      <tr key={el?.id}>
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
                            onClick={() => {
                              setselectedMenu(el);
                              const button = document.querySelector(
                                "#modal-edit-menu-open"
                              ) as HTMLElement;
                              if (button) button.click();
                            }}
                          >
                            <span className="icon-[tabler--pencil] size-5"></span>
                          </button>
                          <button
                            className="btn btn-circle btn-text btn-sm"
                            aria-label="Action button"
                            disabled={isDeleting}
                            onClick={() => {
                              deleteMenu(el.id).then(() => fetchListMenu());
                            }}
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
