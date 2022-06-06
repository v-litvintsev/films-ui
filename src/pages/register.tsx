import { NextPage } from "next";
import Layout from "../components/Layout";
import RegisterComponent from "../components/RegisterComponent";

const RegisterPage: NextPage = () => {
  return (
    <Layout>
      <RegisterComponent />
    </Layout>
  );
};

export default RegisterPage;
