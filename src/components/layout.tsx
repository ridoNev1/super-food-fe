import { FC } from "react";

interface ILayout {
  children: React.ReactNode;
}

const Layout: FC<ILayout> = ({ children }) => {
  return (
    <div>
      <div className="mx-auto px-6 max-w-[1280px]">{children}</div>
    </div>
  );
};

export default Layout;
