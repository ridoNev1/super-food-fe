import useAuthStore from "@/store/auth-store";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  userName: string;
  user_level: number;
}

interface IAuthModal {
  button?: {
    className?: string;
    children?: React.ReactNode;
  };
}

const AuthModal: FC<IAuthModal> = ({ button }) => {
  const { login, isLoading, register } = useAuthStore();
  const [searchParams] = useSearchParams();

  const user_level = searchParams.get("user_level") || 2;

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginForm>();

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
    reset: RegisterFormResetFields,
  } = useForm<RegisterForm>();

  const [showPassword, setShowPassword] = useState(false);

  const onLoginSubmit = (data: LoginForm) => {
    login(data.email, data.password);
  };

  const onRegisterSubmit = (data: RegisterForm) => {
    register({ ...data, user_level: +user_level }).then(() => {
      RegisterFormResetFields();
    });
  };

  return (
    <>
      <button
        type="button"
        className={button?.className}
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-controls="auth-login-modal"
        data-overlay="#auth-login-modal"
      >
        {button?.children || (
          <div className="avatar placeholder">
            <div className="w-10 rounded-full bg-neutral text-neutral-content">
              <span className="icon-[tabler--user] size-6"></span>
            </div>
          </div>
        )}
      </button>

      {/* LOGIN MODAL */}
      <div
        id="auth-login-modal"
        className="overlay modal overlay-open:opacity-100 hidden"
        role="dialog"
        tabIndex={-1}
      >
        <div className="modal-dialog overlay-open:mt-12 overlay-open:opacity-100 overlay-open:duration-500 transition-all ease-out">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn btn-text btn-circle btn-sm absolute end-3 top-3"
                aria-label="Close"
                data-overlay="#auth-login-modal"
              >
                <span className="icon-[tabler--x] size-4"></span>
              </button>
            </div>
            <div className="modal-body">
              <p className="font-bold text-lg text-center">Log in or sign up</p>
              <div className="divider mb-4 mt-2"></div>
              <p className="text-2xl font-bold">Welcome To Super Food</p>
              <div className="my-4">
                <form
                  onSubmit={handleLoginSubmit(onLoginSubmit)}
                  className="grid gap-y-4 w-full max-w-md"
                >
                  <div>
                    <label className="label label-text">Email</label>
                    <input
                      {...loginRegister("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Invalid email format",
                        },
                      })}
                      type="email"
                      className={`input w-full ${
                        loginErrors.email ? "border-red-500" : ""
                      }`}
                      placeholder="eg: yose@example.com"
                    />
                    {loginErrors.email && (
                      <span className="text-red-500 text-sm mt-1 block font-medium">
                        {loginErrors.email.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="label label-text">Password</label>
                    <div
                      className={`input-group ${
                        loginErrors.password
                          ? "border border-red-500 rounded-lg"
                          : ""
                      }`}
                    >
                      <input
                        {...loginRegister("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                        type={showPassword ? "text" : "password"}
                        className={`input w-full ${
                          loginErrors.password ? "border-red-500" : ""
                        }`}
                        placeholder="Enter password"
                      />
                      <span
                        className="input-group-text cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <span className="icon-[tabler--eye] text-base-content/80 size-4"></span>
                        ) : (
                          <span className="icon-[tabler--eye-off] text-base-content/80 size-4"></span>
                        )}
                      </span>
                    </div>
                    {loginErrors.password && (
                      <span className="text-red-500 text-sm mt-1 block font-medium">
                        {loginErrors.password.message}
                      </span>
                    )}
                  </div>

                  <div className="mt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-warning w-full"
                    >
                      {isLoading && (
                        <span className="loading loading-spinner"></span>
                      )}
                      Login
                    </button>
                  </div>
                </form>
              </div>
              <p className="text-center mb-4">
                Don't have an account?{" "}
                <span
                  className="text-yellow-500 cursor-pointer"
                  aria-haspopup="dialog"
                  aria-expanded="false"
                  aria-controls="auth-register-modal"
                  data-overlay="#auth-register-modal"
                >
                  Register
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* REGISTER MODAL */}
      <div
        id="auth-register-modal"
        className="overlay modal overlay-open:opacity-100 hidden"
        role="dialog"
        tabIndex={-1}
      >
        <div className="modal-dialog overlay-open:mt-12 overlay-open:opacity-100 overlay-open:duration-500 transition-all ease-out">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn btn-text btn-circle btn-sm absolute end-3 top-3"
                aria-label="Close"
                data-overlay="#auth-register-modal"
              >
                <span className="icon-[tabler--x] size-4"></span>
              </button>
            </div>
            <div className="modal-body">
              <p className="font-bold text-lg text-center">Register</p>
              <div className="divider mb-4 mt-2"></div>
              <p className="text-2xl font-bold">Create a Super Food Account</p>
              <div className="my-4">
                <form
                  onSubmit={handleRegisterSubmit(onRegisterSubmit)}
                  className="grid gap-y-4 w-full max-w-md"
                >
                  <div>
                    <label className="label label-text !font-medium">
                      Full Name
                    </label>
                    <input
                      {...registerRegister("fullName", {
                        required: "Full Name is required",
                      })}
                      type="text"
                      className={`input w-full ${
                        registerErrors.fullName ? "border-red-500" : ""
                      }`}
                      placeholder="eg: Yosephine Stella"
                    />
                    {registerErrors.fullName && (
                      <span className="text-red-500 text-sm mt-1 block font-medium">
                        {registerErrors.fullName.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="label label-text !font-medium">
                      Username
                    </label>
                    <input
                      {...registerRegister("userName", {
                        required: "Full Name is required",
                      })}
                      type="text"
                      className={`input w-full ${
                        registerErrors.userName ? "border-red-500" : ""
                      }`}
                      placeholder="eg: Yosephinest"
                    />
                    {registerErrors.userName && (
                      <span className="text-red-500 text-sm mt-1 block font-medium">
                        {registerErrors.userName.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="label label-text !font-medium">
                      Phone Number
                    </label>
                    <input
                      {...registerRegister("phoneNumber", {
                        required: "Full Name is required",
                      })}
                      type="number"
                      className={`input w-full appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-moz-appearance:textfield] ${
                        registerErrors.phoneNumber ? "border-red-500" : ""
                      }`}
                      placeholder="eg: 08244434xx"
                    />
                    {registerErrors.phoneNumber && (
                      <span className="text-red-500 text-sm mt-1 block font-medium">
                        {registerErrors.phoneNumber.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="label label-text">Email</label>
                    <input
                      {...registerRegister("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Invalid email format",
                        },
                      })}
                      type="email"
                      className={`input w-full ${
                        registerErrors.email ? "border-red-500" : ""
                      }`}
                      placeholder="yose@example.com"
                    />
                    {registerErrors.email && (
                      <span className="text-red-500 text-sm mt-1 block font-medium">
                        {registerErrors.email.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="label label-text">Password</label>
                    <div
                      className={`input-group ${
                        registerErrors.password
                          ? "border border-red-500 rounded-lg"
                          : ""
                      }`}
                    >
                      <input
                        {...registerRegister("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                        type={showPassword ? "text" : "password"}
                        className={`input w-full ${
                          registerErrors.password ? "border-red-500" : ""
                        }`}
                        placeholder="Enter password"
                      />
                      <span
                        className="input-group-text cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <span className="icon-[tabler--eye] text-base-content/80 size-4"></span>
                        ) : (
                          <span className="icon-[tabler--eye-off] text-base-content/80 size-4"></span>
                        )}
                      </span>
                    </div>
                    {registerErrors.password && (
                      <span className="text-red-500 text-sm mt-1 block font-medium">
                        {registerErrors.password.message}
                      </span>
                    )}
                  </div>

                  <div className="mt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-warning w-full"
                    >
                      {isLoading && (
                        <span className="loading loading-spinner"></span>
                      )}
                      Register
                    </button>
                  </div>
                </form>
              </div>
              <p className="text-center mb-4">
                Already have an account?{" "}
                <span
                  className="text-yellow-500 cursor-pointer"
                  aria-haspopup="dialog"
                  aria-expanded="false"
                  aria-controls="auth-login-modal"
                  data-overlay="#auth-login-modal"
                >
                  Login
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthModal;
