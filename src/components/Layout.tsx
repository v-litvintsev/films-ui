import Head from "next/head";
import { FC, ReactElement } from "react";
import Nav from "./Nav";

interface IProps {
  children: ReactElement | ReactElement[];
}

const Layout: FC<IProps> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Film Database</title>
      </Head>
      <Nav />
      <main className="px-4">
        <div
          className="
          flex
          justify-center
          items-center
          bg-white
          mx-auto
          w-2/4
          rounded-lg
          my-16
          p-16
          "
        >
          <div className="text-2xl font-medium">{children}</div>
        </div>
      </main>
    </>
  );
};

export default Layout;
