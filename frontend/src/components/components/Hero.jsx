import { useSelector } from "react-redux";
import GridScreen from "./../screens/GridScreen.jsx";
import { Container, Card, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./style.css";
import CSVReader from "./../Demo";

const Hero = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div>
      <div className="p-5 d-flex flex-column align-items-center hero-card bg-light w-75">
        {userInfo ? (
          <>{/* <CSVReader /> <GridScreen /> */}</>
        ) : (
          <>{/* <CSVReader /> <GridScreen /> */}</>
        )}
        <CSVReader />
      </div>
    </div>
  );
};

export default Hero;
