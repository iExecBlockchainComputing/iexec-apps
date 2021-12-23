import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./assets/bootstrap.min.css";
import App from "./App";

import { ThemeSwitcherProvider } from "react-css-theme-switcher";

const themes = {
  dark: `${process.env.PUBLIC_URL}/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/light-theme.css`,
};

const prevTheme = window.localStorage.getItem("theme");


ReactDOM.render(
  
    <ThemeSwitcherProvider themeMap={themes} defaultTheme={prevTheme ? prevTheme : "light"}>
      <App/>
    </ThemeSwitcherProvider>
  ,
  document.getElementById("root"),
);
