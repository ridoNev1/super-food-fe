import { SuperFoodLogo } from "@/assets";
import { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="footer bg-yellow-500 px-6 py-4">
      <div className="flex w-full flex-wrap items-center justify-between">
        <div className="flex items-center gap-2 text-xl font-bold">
          <img src={SuperFoodLogo} className="w-25" alt="super-food-logo" />
        </div>
        <aside className="grid-flow-col items-center">
          <p>
            {" "}
            ©2025{" "}
            <a className="link link-hover font-medium" href="#">
              SuperFood by : student esaunggul
            </a>{" "}
          </p>
        </aside>
        <div className="flex h-5 gap-4">
          <a href="#" className="link" aria-label="Insta Link">
            <span className="icon-[tabler--brand-instagram] size-5"></span>
          </a>
          <a href="#" className="link" aria-label="Tiktok Link">
            <span className="icon-[tabler--brand-tiktok] size-5"></span>
          </a>
          <a href="#" className="link" aria-label="X Link">
            <span className="icon-[tabler--brand-x] size-5"></span>
          </a>
          <a href="#" className="link" aria-label="Google Link">
            <span className="icon-[tabler--brand-google] size-5"></span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
