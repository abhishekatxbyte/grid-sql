import { Outlet } from "react-router-dom";
import Header from "./components/components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <Header />

      <ToastContainer />
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default App;
