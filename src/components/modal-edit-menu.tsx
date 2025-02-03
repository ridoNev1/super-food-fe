import useMenuStore, { IMenu } from "@/store/menu-store";
import { FC, useState, useCallback, useEffect } from "react";
import Dropzone from "react-dropzone";
import { useForm } from "react-hook-form";

interface IFormInput {
  name: string;
  description: string;
  price: number;
  quantity: number;
}

const MAX_FILES = 3;
const MAX_SIZE = 2 * 1024 * 1024;

interface IModalEditMenu {
  selectedMenu: IMenu;
}

const ModalEditMenu: FC<IModalEditMenu> = ({ selectedMenu }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInput>();

  const { fetchListMenu, editMenu, isEditing } = useMenuStore();

  const [files, setFiles] = useState<(File | string)[]>([]);
  const [imageError, setImageError] = useState<string | null>(
    "At least one image is required."
  );

  const [deletedImageId, setDeletedImageId] = useState<string[]>([]);

  const setDefaultValues = (menuData: IMenu | null) => {
    if (!menuData) return;

    reset({
      name: menuData.name,
      description: menuData.description,
      price: menuData.price,
      quantity: menuData.quantity,
    });

    setFiles(menuData.images.map((image) => image.url));
  };

  useEffect(() => {
    setDefaultValues(selectedMenu);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMenu]);

  const validateImages = () => {
    if (files.length === 0) {
      setImageError("At least one image is required.");
      return false;
    }
    setImageError(null);
    return true;
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length + files.length > MAX_FILES) {
        setImageError("You can only upload up to 3 files.");
        return;
      }

      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
      setImageError(null);
    },
    [files]
  );

  const removeFile = (fileToRemove: File | string) => {
    const updatedFiles = files.filter((file) => file !== fileToRemove);
    setFiles(updatedFiles);
    if (updatedFiles.length === 0) {
      setImageError("At least one image is required.");
    }
  };

  const onSubmit = async (data: IFormInput) => {
    if (!validateImages()) return;

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("quantity", data.quantity.toString());

    files.forEach((file) => {
      if (typeof file !== "string") {
        formData.append("images", file);
      }
    });

    if (deletedImageId.length === 1) {
      formData.append("deleteImages", deletedImageId[0]);
    } else {
      deletedImageId.forEach((el) => {
        formData.append("deleteImages[]", el);
      });
    }

    editMenu(selectedMenu.id, formData).then(() => {
      fetchListMenu(100, 1, "");
      setFiles([]);
      reset();
      const closeButton = document.querySelector(
        "#buttonedit_close_modal"
      ) as HTMLElement;
      if (closeButton) closeButton.click();
    });
  };

  return (
    <>
      <button
        id="modal-edit-menu-open"
        type="button"
        className="btn btn-circle btn-text btn-sm"
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-controls="modal-edit-menu"
        data-overlay="#modal-edit-menu"
      ></button>

      <div
        id="modal-edit-menu"
        className="overlay modal overlay-open:opacity-100 hidden"
        role="dialog"
        tabIndex={-1}
      >
        <div className="modal-dialog overlay-open:opacity-100">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Edit Menu</h3>
              <button
                type="button"
                className="btn btn-text btn-circle btn-sm absolute end-3 top-3"
                aria-label="Close"
                id="buttonedit_close_modal"
                data-overlay="#modal-edit-menu"
              >
                <span className="icon-[tabler--x] size-4"></span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block font-medium">Name</label>
                  <input
                    {...register("name", { required: "Name is required" })}
                    className="input w-full"
                    placeholder="Enter menu name"
                  />
                  {errors.name && (
                    <p className="text-red-500">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block font-medium">Description</label>
                  <textarea
                    {...register("description", {
                      required: "Description is required",
                    })}
                    className="textarea w-full"
                    placeholder="Enter menu description"
                  ></textarea>
                  {errors.description && (
                    <p className="text-red-500">{errors.description.message}</p>
                  )}
                </div>
                <div>
                  <label className="block font-medium">Price</label>
                  <input
                    {...register("price", {
                      required: "Price is required",
                      valueAsNumber: true,
                    })}
                    type="number"
                    className="input w-full"
                    placeholder="Enter price"
                  />
                  {errors.price && (
                    <p className="text-red-500">{errors.price.message}</p>
                  )}
                </div>
                <div>
                  <label className="block font-medium">Quantity</label>
                  <input
                    {...register("quantity", {
                      required: "Quantity is required",
                      valueAsNumber: true,
                    })}
                    type="number"
                    className="input w-full"
                    placeholder="Enter quantity"
                  />
                  {errors.quantity && (
                    <p className="text-red-500">{errors.quantity.message}</p>
                  )}
                </div>
                <Dropzone
                  onDrop={onDrop}
                  maxSize={MAX_SIZE}
                  accept={{
                    "image/jpeg": [".jpg", ".jpeg"],
                    "image/png": [".png"],
                  }}
                  multiple
                >
                  {({ getRootProps, getInputProps }) => (
                    <div
                      {...getRootProps()}
                      className="border-base-content/20 bg-base-100 rounded-box flex cursor-pointer justify-center border border-dashed p-12"
                    >
                      <input {...getInputProps()} />
                      <div className="text-center">
                        <span className="bg-base-200/80 text-base-content inline-flex size-16 items-center justify-center rounded-full">
                          <span className="icon-[tabler--upload] size-6 shrink-0"></span>
                        </span>
                        <div className="mt-4 flex flex-wrap justify-center">
                          <span className="text-base-content pe-1 text-base font-medium">
                            Drop your file here or
                          </span>
                          <span className="link link-animated link-primary font-semibold">
                            browse
                          </span>
                        </div>
                        <p className="text-base-content/50 mt-1 text-xs">
                          Max {MAX_FILES} files, only JPG/PNG, up to{" "}
                          {MAX_SIZE / 1024 / 1024}MB each.
                        </p>
                      </div>
                    </div>
                  )}
                </Dropzone>
                {imageError && <p className="text-red-500">{imageError}</p>}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="relative mt-2 rounded-box shadow-md bg-base-100 p-2"
                    >
                      <img
                        src={
                          typeof file === "string"
                            ? file
                            : URL.createObjectURL(file)
                        }
                        alt="Preview"
                        className="mb-2 w-52 h-52 rounded-lg object-cover"
                      />
                      <div className="flex justify-between">
                        <div>
                          <span className="text-sm text-gray-600 max-w-36 text-ellipsis line-clamp-1">
                            {typeof file === "string"
                              ? "Existing Image"
                              : file.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-circle btn-text"
                          onClick={() => {
                            if (typeof file === "string") {
                              setDeletedImageId((old) => [...old, file]);
                            }
                            removeFile(file);
                          }}
                        >
                          <span className="icon-[tabler--trash] size-4 shrink-0"></span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isEditing}
                  className="btn btn-warning w-full"
                >
                  {isEditing && (
                    <span className="loading loading-spinner"></span>
                  )}
                  Edit Menu
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalEditMenu;
