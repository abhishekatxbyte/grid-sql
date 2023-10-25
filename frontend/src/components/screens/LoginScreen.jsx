// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Form, Button, Row, Col } from "react-bootstrap";
// import { toast } from "react-toastify";

// import { useSelector, useDispatch } from "react-redux";
// import { useLoginMutation } from "../../store/slices/userApiSlice";
// import { setCredentials } from "../../store/slices/authSlice";

// import FormContainer from "../components/FormContainer";
// import Loader from "../components/Loader";

// const LoginScreen = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [login, { isLoading }] = useLoginMutation();
//   const { userInfo } = useSelector((state) => state.auth);

//   const loginUser = async () => {
//     try {
//       const res = await login({ email, password }).unwrap();
//       dispatch(setCredentials({ ...res }));
//       navigate("/dashboard");
//     } catch (error) {
//       toast.error(error?.data?.message || "Invalid login");
//     }
//   };

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     loginUser();
//   };

//   useEffect(() => {
//     if (userInfo) {
//       navigate("/dashboard");
//     }
//   }, [navigate, userInfo]);

//   return (
//     <FormContainer>
//       <h1>Sign In</h1>

//       <Form onSubmit={submitHandler}>
//         <Form.Group className='my-2' controlId='email'>
//           <Form.Label>Email Address</Form.Label>
//           <Form.Control
//             type='email'
//             placeholder='Enter Email'
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           ></Form.Control>
//         </Form.Group>

//         <Form.Group className='my-2' controlId='password'>
//           <Form.Label>Password</Form.Label>
//           <Form.Control
//             type='password'
//             placeholder='Enter Password'
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           ></Form.Control>
//         </Form.Group>

//         <Button type='submit' variant='primary' className='mt-3'>
//           {isLoading ? <Loader /> : "Sign In"}
//         </Button>

//         <Row className='py-3'>
//           <Col>
//             New Customer? <Link to='/register'> Register</Link>
//           </Col>
//         </Row>
//       </Form>
//     </FormContainer>
//   );
// };

// export default LoginScreen;

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";

import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../../store/slices/userApiSlice";
import { setCredentials } from "../../store/slices/authSlice";
import style from "./style.module.css";
import authImage from "./../../assets/signup.png";
import componeyLogo from "./../../assets/favicon.png";

import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const loginUser = async () => {
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.data?.message || "Invalid login");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    loginUser();
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
              <Form.Group className="flex flex-col gap-2" controlId="email">
                <Form.Label Label className="text-[20px]">
                  Email Address
                </Form.Label>
                <Form.Control
                  type="email"
                  className="p-4 text-[18px]"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group className="flex flex-col gap-2" controlId="password">
                <Form.Label Label className="text-[20px]">
                  Password
                </Form.Label>
                <Form.Control
                  type="password"
                  className="p-4 text-[18px]"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                className="bg-[#4292dc] self-end	text-[20px] font-semibold	 px-6 py-3 rounded-md text-white"
              >
                {isLoading ? <Loader /> : "Sign In"}
              </Button>

              <Row className="py-3">
                <Col>
                  New Customer? <Link to="/register"> Register</Link>
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

export default LoginScreen;
