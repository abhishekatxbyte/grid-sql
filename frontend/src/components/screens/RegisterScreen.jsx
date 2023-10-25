// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Form, Button, Row, Col } from "react-bootstrap";
// import { toast } from "react-toastify";

// import { useSelector, useDispatch } from "react-redux";
// import { useRegisterMutation } from "../../store/slices/userApiSlice";
// import { setCredentials } from "../../store/slices/authSlice";

// import FormContainer from "../components/FormContainer";
// import Loader from "../components/Loader";

// const RegisterScreen = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [register, { isLoading }] = useRegisterMutation();
//   const { userInfo } = useSelector((state) => state.auth);

//   const registerUser = async () => {
//     try {
//       const res = await register({ name, email, password }).unwrap();
//       dispatch(setCredentials({ ...res }));
//       navigate("/dashboard");
//     } catch (error) {
//       toast.error(error?.data?.message || "Invalid login");
//     }
//   };

//   const submitHandler = async (e) => {
//     console.log("res");

//     e.preventDefault();

//     if (password !== confirmPassword) {
//       toast.error("Password is not matching!");
//     } else {
//       registerUser();
//     }
//   };

//   useEffect(() => {
//     if (userInfo) {
//       navigate("/dashboard");
//     }
//   }, [navigate, userInfo]);

//   return (
//     <div className="bg-[#444]">
//       <FormContainer>
//         <h1>Sign Up</h1>

//         <Form onSubmit={submitHandler}>
//           <Form.Group className="my-2" controlId="name">
//             <Form.Label>Name</Form.Label>
//             <Form.Control
//               type="name"
//               placeholder="Enter Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             ></Form.Control>
//           </Form.Group>

//           <Form.Group className="my-2" controlId="email">
//             <Form.Label>Email Address</Form.Label>
//             <Form.Control
//               type="email"
//               placeholder="Enter Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             ></Form.Control>
//           </Form.Group>

//           <Form.Group className="my-2" controlId="password">
//             <Form.Label>Password</Form.Label>
//             <Form.Control
//               type="password"
//               placeholder="Enter Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             ></Form.Control>
//           </Form.Group>

//           <Form.Group className="my-2" controlId="confirmPassword">
//             <Form.Label>Confirm Password</Form.Label>
//             <Form.Control
//               type="password"
//               placeholder="Confirm Password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//             ></Form.Control>
//           </Form.Group>

//           <Button type="submit" variant="primary" className="mt-3">
//             {isLoading ? <Loader /> : "Sign Up"}
//           </Button>

//           <Row className="py-3">
//             <Col>
//               Already have an account? <Link to="/login"> Login</Link>
//             </Col>
//           </Row>
//         </Form>
//       </FormContainer>
//     </div>
//   );
// };

// export default RegisterScreen;
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import authImage from "./../../assets/signup.png";
import componeyLogo from "./../../assets/favicon.png";
import { useSelector, useDispatch } from "react-redux";
import { useRegisterMutation } from "../../store/slices/userApiSlice";
import { setCredentials } from "../../store/slices/authSlice";
import style from "./style.module.css";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const registerUser = async () => {
    try {
      const res = await register({ name, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.data?.message || "Invalid login");
    }
  };

  const submitHandler = async (e) => {
    console.log("res");

    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Password is not matching!");
    } else {
      registerUser();
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate("/dashboard");
    }
  }, [navigate, userInfo]);

  return (
    <div className={`${style.container}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 items-center justify-center p-[20px] rounded-md	">
        <div className="grid justify-items-center	">
          <img className="w-[80%] hidden sm:block" alt="auth" src={authImage} />
        </div>
        <div className="grid grid-cols-1 justify-center bg-[#f1f8ff] p-[20px]	 rounded-md">
          {" "}
          <div className="flex items-center justify-center gap-[1em] p-[20px]">
            Powered by
            <img src={componeyLogo} className="w-[50px]" alt="componey logo" />
          </div>{" "}
          <FormContainer>
            <Form
              onSubmit={submitHandler}
              className="flex flex-col gap-5  w-full"
            >
              <Form.Group className="flex flex-col gap-2" controlId="name">
                <Form.Label className="text-[20px]">Name</Form.Label>
                <Form.Control
                  type="name"
                  className="p-4 text-[18px]"
                  placeholder="Enter Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group className="flex flex-col gap-2" controlId="email">
                <Form.Label className="text-[20px]">Email Address</Form.Label>
                <Form.Control
                  type="email"
                  className="p-4 text-[18px]"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group className="flex flex-col gap-2" controlId="password">
                <Form.Label className="text-[20px]">Password</Form.Label>
                <Form.Control
                  type="password"
                  className="p-4 text-[18px]"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group
                className="flex flex-col gap-2"
                controlId="confirmPassword"
              >
                <Form.Label className="text-[20px]">
                  Confirm Password
                </Form.Label>
                <Form.Control
                  type="password"
                  className="p-4 text-[18px]"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                className="bg-[#4292dc] self-end	text-[20px] font-semibold	 px-6 py-3 rounded-md text-white"
              >
                {isLoading ? <Loader /> : "Sign Up"}
              </Button>

              <Row className="py-3">
                <Col>
                  Already have an account? <Link to="/login"> Login</Link>
                </Col>
              </Row>
            </Form>
          </FormContainer>
        </div>
      </div>
      <div className={style.footer_container}>
        Powered by
        <img src={componeyLogo} alt="componey logo" />
      </div>
    </div>
  );
};

export default RegisterScreen;
