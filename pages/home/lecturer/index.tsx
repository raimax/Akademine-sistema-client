import type { NextPage } from "next";
import { useEffect } from "react";
import Header from "../../../components/Header";
import RestrictAccess from "../../../Helpers/RestrictAccess";

const Home: NextPage = () => {
  useEffect(() => {
    RestrictAccess("Student");
  }, []);
  
  return (
    <div>
      <Header />
      lecturer home
      <br />
      Welcome,
    </div>
  );
};

export default Home;
