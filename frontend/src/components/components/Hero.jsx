import GridScreen from "./../screens/GridScreen.jsx";
import "./style.css";
import File from "../File.jsx";

const Hero = () => {
  return (
    <div>
      <File />
      <div className="p-5 d-flex flex-column align-items-center hero-card bg-light w-75">
        <GridScreen />
      </div>
    </div>
  );
};

export default Hero;
