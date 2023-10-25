import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store.js";

import HomeScreen from "./components/screens/HomeScreen.jsx";
import AboutScreen from "./components/screens/AboutScreen.jsx";
import LoginScreen from "./components/screens/LoginScreen.jsx";
import RegisterScreen from "./components/screens/RegisterScreen.jsx";
import ProfileScreen from "./components/screens/ProfileScreen";
// import DashboardScreen from "./components/screens/DashboardScreen";
import PrivateRoute from "./components/components/PrivateRoute";
import UserGrid from "./components/auth/userGrid/UserGrid.jsx";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/*" element={<App />}>
      <Route index element={<HomeScreen />} />
      <Route path="about" element={<AboutScreen />} />

      <Route path="login" element={<LoginScreen />} />
      <Route path="register" element={<RegisterScreen />} />

      <Route element={<PrivateRoute />}>
        <Route path="profile" element={<ProfileScreen />} />
        <Route path="dashboard" element={<UserGrid />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
  // </React.StrictMode>,
);
