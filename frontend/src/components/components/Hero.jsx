import { useSelector } from "react-redux";
import GridScreen from "./../screens/GridScreen.jsx";
import "./style.css";

const Hero = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div>
      <div className="p-5 d-flex flex-column align-items-center hero-card bg-light w-75">
        {userInfo ? <>{/* <CSVReader /> <GridScreen /> */}</> : <>{/* */}</>}
        {/* <CSVReader /> */}
        <GridScreen />
      </div>
    </div>
  );
};

export default Hero;
