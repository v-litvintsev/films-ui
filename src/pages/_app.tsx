import "../styles/globals.css";
import { AppProps } from "next/app";
import { useFetchUser, UserProvider } from "../lib/authContext";

function MyApp({ Component, pageProps }: AppProps) {
  const userData = useFetchUser();

  return (
    <UserProvider value={userData}>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
