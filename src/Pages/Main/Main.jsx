import React from "react";
import { useSelector } from "react-redux";
import ResponsiveDrawer from "../../components/ResponsiveDrawer/ResponsiveDrawer";

function Main() {
  const token = useSelector((state) => state.auth.token);
  console.log(token);
  return <ResponsiveDrawer />;
}

export default Main;
