import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import SignIn from "./Pages/SignIn/SignIn";
import Main from "./Pages/Main/Main";
import { loginUser } from "./Store/authSlice/authSlice";
import store from "./Store/store";
import "./index.css";
import { ToastContainer } from "react-toastify";

const Navigator = () => {
  const dispatch = useDispatch();
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkLoginAndNavigate = async () => {
      try {
        const username = localStorage.getItem("username");
        const password = localStorage.getItem("password");
        const userData = { username, password };
        console.log(userData);
        if (userData.username && userData.password) {
          dispatch(loginUser(userData))
            .unwrap()
            .then(() => {
              setInitialRoute("/main");
            })
            .catch((error) => {
              console.error("Ошибка при входе:", error);
              setInitialRoute("/signin");
            });
        } else {
          setInitialRoute("/signin");
        }
      } catch (error) {
        console.error("Ошибка при чтении из localStorage", error);
        setInitialRoute("/signin");
      }
    };

    checkLoginAndNavigate();
  }, [dispatch]);

  if (initialRoute === null) {
    return null;
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to={initialRoute} replace />,
    },
    {
      path: "/main",
      element: <Main />,
    },
    {
      path: "/signin",
      element: <SignIn />,
    },
  ]);

  return <RouterProvider router={router} />;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Navigator />
      <ToastContainer />
    </Provider>
  </React.StrictMode>
);
