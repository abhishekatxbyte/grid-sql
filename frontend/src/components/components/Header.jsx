import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "./../../assets/favicon.png";
import { useSelector } from "react-redux";
import { useSendLogoutMutation } from "../../store/slices/userApiSlice";

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [sendLogout] = useSendLogoutMutation();

  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      sendLogout();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const renderNavigation = () => {
    if (userInfo) {
      return (
        <div>
          <LinkContainer to="/dashboard">
            <Nav.Link>Dashboard</Nav.Link>
          </LinkContainer>
          <NavDropdown title={userInfo.name} id="username">
            <LinkContainer to="/profile">
              <NavDropdown.Item>Profile</NavDropdown.Item>
            </LinkContainer>
            <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
          </NavDropdown>
        </div>
      );
    } else {
      return (
        <div className="flex gap-2">
          <Link to="/login">
            <div className="flex gap-2 px-4 py-2 bg-[#4292dc] items-center rounded-md rounded-md font-[700] text-white">
              <FaSignInAlt /> Sign In
            </div>
          </Link>
          <Link to="/register">
            <div className="flex gap-2 px-4 py-2 bg-[#4292dc] items-center rounded-md rounded-md font-[700] text-white">
              <FaSignInAlt /> Sign Up
            </div>
          </Link>
        </div>
      );
    }
  };

  return (
    <header>
      <div
        className="bg-[#fff] navbar rounded-lg  flex justify-between m-8 p-4 top-0  items-center"
        variant="dark"
        expand="lg"
      >
        <LinkContainer to="/">
          <div className="flex items-center gap-2">
            <img src={logo} className="h-[34px]" />
            <p className="font-[900] text-[24px] leading-0">Grid</p>
          </div>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <nav id="basic-navbar-nav">
          <Nav>{renderNavigation()}</Nav>
        </nav>
      </div>
    </header>
  );
};

export default Header;
