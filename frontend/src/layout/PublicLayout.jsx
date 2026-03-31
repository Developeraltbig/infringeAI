import Header from "../component/Header";
import Footer from "../component/Footer";
import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
