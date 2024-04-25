import React from "react";
import { AppSettings } from "../../config/app-settings.js";
import { slideToggle } from "../../composables/slideToggle.js";
import { useState, useEffect } from "react";
import Header from "../header/header.jsx";
import Sidebar from "../sidebar/sidebar.jsx";
import Content from "../content/content.jsx";
import { ContextProvider } from "../../pages/enumeration/enumerationContext.js";
import api from "../../axios/custom.js";
import CryptoJS from "crypto-js";

function DefaultLayout() {
  // Get and decrypt Organisation ID from local storage
  const organisationId = sessionStorage.getItem("organisationId");

  const userId = sessionStorage.getItem("userId");
  
  const token = sessionStorage.getItem("myToken");

  const [appTheme, setAppTheme] = useState("");
  const [userData, setUserData] = useState({});
  const [appHeaderNone, setAppHeaderNone] = useState(false);
  const [appHeaderMegaMenu, setAppHeaderMegaMenu] = useState(false);
  const [appSidebarNone, setAppSidebarNone] = useState(false);
  const [appSidebarWide, setAppSidebarWide] = useState(false);
  const [appSidebarLight, setAppSidebarLight] = useState(false);
  const [appSidebarMinify, setAppSidebarMinify] = useState(false);
  const [appSidebarMobileToggled, setAppSidebarMobileToggled] = useState(false);
  const [appSidebarTransparent, setAppSidebarTransparent] = useState(false);
  const [appSidebarSearch, setAppSidebarSearch] = useState(false);
  // const [appSidebarFixed, setAppSidebarFixed] = useState(true);
  const [appSidebarGrid, setAppSidebarGrid] = useState(true);
  const [appContentNone, setAppContentNone] = useState(false);
  const [appContentClass, setAppContentClass] = useState("");
  const [appContentFullHeight, setAppContentFullHeight] = useState(false);
  const [cartIsShown, setCartIsShown] = useState(false);
  const [appTopMenu, setAppTopMenu] = useState(false);
  // const [appTopMenuMobileToggled, setAppTopMenuMobileToggled] = useState(false);
  const [appSidebarEnd, setAppSidebarEnd] = useState(false);
  const [appSidebarEndToggled, setAppSidebarEndToggled] = useState(false);
  const [appSidebarEndMobileToggled, setAppSidebarEndMobileToggled] =
    useState(false);
  const [font, setFont] = useState({
    family: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-body-font-family")
      .trim(),
    size: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-body-font-size")
      .trim(),
    weight: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-body-font-family")
      .trim(),
  });
  const [color, setColor] = useState({
    componentColor: window
      .getComputedStyle(document.body)
      .getPropertyValue("--app-component-color")
      .trim(),
    componentBg: window
      .getComputedStyle(document.body)
      .getPropertyValue("--app-component-bg")
      .trim(),
    dark: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-dark")
      .trim(),
    light: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-light")
      .trim(),
    blue: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-blue")
      .trim(),
    indigo: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-indigo")
      .trim(),
    purple: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-purple")
      .trim(),
    pink: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-pink")
      .trim(),
    red: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-red")
      .trim(),
    orange: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-orange")
      .trim(),
    yellow: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-yellow")
      .trim(),
    green: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-green")
      .trim(),
    success: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-success")
      .trim(),
    teal: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-teal")
      .trim(),
    cyan: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-cyan")
      .trim(),
    white: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-white")
      .trim(),
    gray: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-gray")
      .trim(),
    lime: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-lime")
      .trim(),
    gray100: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-gray-100")
      .trim(),
    gray200: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-gray-200")
      .trim(),
    gray300: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-gray-300")
      .trim(),
    gray400: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-gray-400")
      .trim(),
    gray500: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-gray-500")
      .trim(),
    gray600: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-gray-600")
      .trim(),
    gray700: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-gray-700")
      .trim(),
    gray800: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-gray-800")
      .trim(),
    gray900: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-gray-900")
      .trim(),
    black: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-black")
      .trim(),
    componentColorRgb: window
      .getComputedStyle(document.body)
      .getPropertyValue("--app-component-color-rgb")
      .trim(),
    componentBgRgb: window
      .getComputedStyle(document.body)
      .getPropertyValue("--app-component-bg-rgb")
      .trim(),
    darkRgb: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-dark-rgb")
      .trim(),
    lightRgb: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-light-rgb")
      .trim(),
    blueRgb: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-blue-rgb")
      .trim(),
    indigoRgb: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-indigo-rgb")
      .trim(),
    purpleRgb: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-purple-rgb")
      .trim(),
    pinkRgb: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-pink-rgb")
      .trim(),
    redRgb: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-red-rgb")
      .trim(),
    orangeRgb: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-orange-rgb")
      .trim(),
    yellowRgb: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-yellow-rgb")
      .trim(),
    greenRgb: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-green-rgb")
      .trim(),
    successRgb: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-success-rgb")
      .trim(),
    tealRgb: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-teal-rgb")
      .trim(),
    cyanRgb: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-cyan-rgb")
      .trim(),
    whiteRgb: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-white-rgb")
      .trim(),
    grayRgb: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-gray-rgb")
      .trim(),
    limeRgb: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-lime-rgb")
      .trim(),
    gray100Rgb: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-gray-100-rgb")
      .trim(),
    gray200Rgb: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-gray-200-rgb")
      .trim(),
    gray300Rgb: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-gray-300-rgb")
      .trim(),
    gray400Rgb: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-gray-400-rgb")
      .trim(),
    gray500Rgb: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-gray-500-rgb")
      .trim(),
    gray600Rgb: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-gray-600-rgb")
      .trim(),
    gray700Rgb: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-gray-700-rgb")
      .trim(),
    gray800Rgb: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-gray-800-rgb")
      .trim(),
    gray900Rgb: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-gray-900-rgb")
      .trim(),
    blackRgb: window
      .getComputedStyle(document.body)
      .getPropertyValue("--bs-black-rgb")
      .trim(),
  });

  useEffect(() => {
    api
      .get(`users/${organisationId}/user-profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUserData(response.data);
      });
  }, [organisationId, userId]);
  const toggleAppSidebarMinify = (e) => {
    e.preventDefault();
    setAppSidebarMinify(!appSidebarMinify);
    if (localStorage) {
      localStorage.setItem("appSidebarMinify", !appSidebarMinify);
    }
  };
  const toggleMinifyItself = (e) => {
    if (appSidebarMinify) {
      setAppSidebarMinify(false);
    } else return;
  };
  const toggleMinifyLeave = (e) => {
    if (!appSidebarMinify) {
      setAppSidebarMinify(true);
    } else return;
  };
  const toggleAppSidebarMobile = (e) => {
    e.preventDefault();
    setAppSidebarMobileToggled(!appSidebarMobileToggled);
  };

  const handleSetAppSidebarNone = (value) => {
    setAppSidebarNone(value);
  };
  const handleSetAppSidebarMinified = (value) => {
    setAppSidebarMinify(value);
  };
  const handleSetAppSidebarWide = (value) => {
    setAppSidebarWide(value);
  };
  const handleSetAppSidebarLight = (value) => {
    setAppSidebarLight(value);
  };
  const handleSetAppSidebarTransparent = (value) => {
    setAppSidebarTransparent(value);
  };

  const handleSetAppSidebarSearch = (value) => {
    setAppSidebarSearch(value);
  };

  const handleSetAppSidebarGrid = (value) => {
    setAppSidebarGrid(value);
    if (localStorage) {
      localStorage.appSidebarGrid = value;
    }
  };
  const toggleAppSidebarEnd = (e) => {
    e.preventDefault();
    setAppSidebarEndToggled(!appSidebarEndToggled);
    if (localStorage) {
      localStorage.appSidebarEndToggled = !appSidebarEndToggled;
    }
  };

  const toggleAppSidebarEndMobile = (e) => {
    e.preventDefault();
    setAppSidebarEndMobileToggled(!appSidebarEndMobileToggled);
    if (localStorage) {
      localStorage.appSidebarEndMobileToggled = !appSidebarEndMobileToggled;
    }
  };
  const handleSetAppSidebarEnd = (value) => {
    setAppSidebarEnd(value);
  };
  const handleSetAppContentNone = (value) => {
    setAppContentNone(value);
  };
  const handleSetAppContentClass = (value) => {
    setAppContentClass(value);
  };
  const handleSetAppContentFullHeight = (value) => {
    setAppContentFullHeight(value);
  };
  const handleSetAppHeaderNone = (value) => {
    setAppHeaderNone(value);
  };

  const handleSetAppHeaderMegaMenu = (value) => {
    setAppHeaderMegaMenu(value);
  };

  const handleSetAppTopMenu = (value) => {
    setAppTopMenu(value);
  };
  const toggleAppTopMenuMobile = (e) => {
    e.preventDefault();
    slideToggle(document.querySelector(".app-top-menu"));
  };

  const handleSetAppBoxedLayout = (value) => {
    if (value === true) {
      document.body.classList.add("boxed-layout");
    } else {
      document.body.classList.remove("boxed-layout");
    }
  };

  const handleSetAppTheme = (value) => {
    var newTheme = "theme-" + value;
    for (var x = 0; x < document.body.classList.length; x++) {
      if (
        document.body.classList[x].indexOf("theme-") > -1 &&
        document.body.classList[x] !== newTheme
      ) {
        document.body.classList.remove(document.body.classList[x]);
      }
    }
    document.body.classList.add(newTheme);

    if (localStorage && value) {
      localStorage.appTheme = value;
    }
    setAppTheme(value);
  };

  const handleSetFont = () => {
    setFont((prevState) => ({
      ...prevState,
      family: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-body-font-family")
        .trim(),
      size: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-body-font-size")
        .trim(),
      weight: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-body-font-weight")
        .trim(),
    }));
  };

  const handleSetColor = () => {
    setColor((prevState) => ({
      ...prevState,
      componentColor: window
        .getComputedStyle(document.body)
        .getPropertyValue("--app-component-color")
        .trim(),
      componentBg: window
        .getComputedStyle(document.body)
        .getPropertyValue("--app-component-bg")
        .trim(),
      dark: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-dark")
        .trim(),
      light: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-light")
        .trim(),
      blue: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-blue")
        .trim(),
      blackRgb: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-black-rgb")
        .trim(),
    }));
  };

  const showModalHandler = (e, value) => {
    e.preventDefault();
    setCartIsShown(true);
  };

  const hideModalHandler = (e, value) => {
    // e.preventDefault();
    setCartIsShown(false);
  };
  const state = {
    userData,
    appTheme: appTheme,
    appHeaderNone: appHeaderNone,
    appHeaderMegaMenu: appHeaderMegaMenu,
    appSidebarNone: appSidebarNone,
    appSidebarWide: appSidebarWide,
    appSidebarLight: appSidebarLight,
    appSidebarMinify: appSidebarMinify,
    appSidebarMobileToggled: appSidebarMobileToggled,
    appSidebarTransparent: appSidebarTransparent,
    appSidebarSearch: appSidebarSearch,
    // appSidebarFixed: appSidebarFixed,
    appSidebarGrid: appSidebarGrid,
    appContentNone: appContentNone,
    appContentClass: appContentClass,
    appContentFullHeight: appContentFullHeight,
    cartIsShown: cartIsShown,
    appTopMenu: appTopMenu,
    // appTopMenuMobileToggled: appTopMenuMobileToggled,
    appSidebarEnd: appSidebarEnd,
    appSidebarEndToggled: appSidebarEndToggled,
    appSidebarEndMobileToggled: appSidebarEndMobileToggled,
    font: font,
    color: color,
    toggleMinifyItself: toggleMinifyItself,
    toggleMinifyLeave: toggleMinifyLeave,
    toggleAppSidebarMinify: toggleAppSidebarMinify,
    toggleAppSidebarMobile: toggleAppSidebarMobile,
    handleSetAppSidebarNone: handleSetAppSidebarNone,
    handleSetAppSidebarMinified: handleSetAppSidebarMinified,
    handleSetAppSidebarWide: handleSetAppSidebarWide,
    handleSetAppSidebarLight: handleSetAppSidebarLight,
    handleSetAppSidebarTransparent: handleSetAppSidebarTransparent,
    handleSetAppSidebarSearch: handleSetAppSidebarSearch,
    handleSetAppSidebarGrid: handleSetAppSidebarGrid,
    toggleAppSidebarEnd: toggleAppSidebarEnd,
    toggleAppSidebarEndMobile: toggleAppSidebarEndMobile,
    handleSetAppSidebarEnd: handleSetAppSidebarEnd,
    handleSetAppContentNone: handleSetAppContentNone,
    handleSetAppContentClass: handleSetAppContentClass,
    handleSetAppContentFullHeight: handleSetAppContentFullHeight,
    handleSetAppHeaderNone: handleSetAppHeaderNone,
    handleSetAppHeaderMegaMenu: handleSetAppHeaderMegaMenu,
    handleSetAppTopMenu: handleSetAppTopMenu,
    toggleAppTopMenuMobile: toggleAppTopMenuMobile,
    handleSetAppBoxedLayout: handleSetAppBoxedLayout,
    handleSetAppTheme: handleSetAppTheme,
    handleSetFont: handleSetFont,
    handleSetColor: handleSetColor,
    showModalHandler: showModalHandler,
    hideModalHandler: hideModalHandler,
  };

  useEffect(() => {
    setFont((prevFont) => ({
      ...prevFont,
      family: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-body-font-family")
        .trim(),
      size: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-body-font-size")
        .trim(),
      weight: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-body-font-weight")
        .trim(),
    }));

    setColor((prevColor) => ({
      ...prevColor,
      componentColor: window
        .getComputedStyle(document.body)
        .getPropertyValue("--app-component-color")
        .trim(),
      componentBg: window
        .getComputedStyle(document.body)
        .getPropertyValue("--app-component-bg")
        .trim(),
      dark: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-dark")
        .trim(),
      light: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-light")
        .trim(),
      blue: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-blue")
        .trim(),
      indigo: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-indigo")
        .trim(),
      purple: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-purple")
        .trim(),
      pink: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-pink")
        .trim(),
      red: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-red")
        .trim(),
      orange: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-orange")
        .trim(),
      yellow: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-yellow")
        .trim(),
      green: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-green")
        .trim(),
      success: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-success")
        .trim(),
      teal: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-teal")
        .trim(),
      cyan: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-cyan")
        .trim(),
      white: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-white")
        .trim(),
      gray: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-gray")
        .trim(),
      lime: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-lime")
        .trim(),
      gray100: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-gray-100")
        .trim(),
      gray200: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-gray-200")
        .trim(),
      gray300: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-gray-300")
        .trim(),
      gray400: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-gray-400")
        .trim(),
      gray500: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-gray-500")
        .trim(),
      gray600: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-gray-600")
        .trim(),
      gray700: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-gray-700")
        .trim(),
      gray800: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-gray-800")
        .trim(),
      gray900: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-gray-900")
        .trim(),
      black: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-black")
        .trim(),
      componentColorRgb: window
        .getComputedStyle(document.body)
        .getPropertyValue("--app-component-color-rgb")
        .trim(),
      componentBgRgb: window
        .getComputedStyle(document.body)
        .getPropertyValue("--app-component-bg-rgb")
        .trim(),
      darkRgb: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-dark-rgb")
        .trim(),
      lightRgb: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-light-rgb")
        .trim(),
      blueRgb: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-blue-rgb")
        .trim(),
      indigoRgb: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-indigo-rgb")
        .trim(),
      purpleRgb: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-purple-rgb")
        .trim(),
      pinkRgb: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-pink-rgb")
        .trim(),
      redRgb: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-red-rgb")
        .trim(),
      orangeRgb: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-orange-rgb")
        .trim(),
      yellowRgb: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-yellow-rgb")
        .trim(),
      greenRgb: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-green-rgb")
        .trim(),
      successRgb: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-success-rgb")
        .trim(),
      tealRgb: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-teal-rgb")
        .trim(),
      cyanRgb: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-cyan-rgb")
        .trim(),
      whiteRgb: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-white-rgb")
        .trim(),
      grayRgb: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-gray-rgb")
        .trim(),
      limeRgb: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-lime-rgb")
        .trim(),
      gray100Rgb: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-gray-100-rgb")
        .trim(),
      gray200Rgb: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-gray-200-rgb")
        .trim(),
      gray300Rgb: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-gray-300-rgb")
        .trim(),
      gray400Rgb: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-gray-400-rgb")
        .trim(),
      gray500Rgb: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-gray-500-rgb")
        .trim(),
      gray600Rgb: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-gray-600-rgb")
        .trim(),
      gray700Rgb: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-gray-700-rgb")
        .trim(),
      gray800Rgb: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-gray-800-rgb")
        .trim(),
      gray900Rgb: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-gray-900-rgb")
        .trim(),
      blackRgb: window
        .getComputedStyle(document.body)
        .getPropertyValue("--bs-black-rgb")
        .trim(),
    }));
  }, []);

  useEffect(() => {
    handleSetColor();
    handleSetFont();
    handleSetAppTheme(appTheme);
    if (localStorage) {
      if (typeof localStorage.appTheme !== "undefined") {
        document.body.classList.add("theme-" + localStorage.appTheme);
      }

      if (typeof localStorage.appSidebarGrid !== "undefined") {
        handleSetAppSidebarGrid(
          localStorage.appSidebarGrid === "true" ? true : false
        );
      }
      if (typeof localStorage.appSidebarMinify !== "undefined") {
        handleSetAppSidebarMinified(
          localStorage.appSidebarMinify === "true" ? true : false
        );
      }
    }
    return () => {};
  }, [appTheme]);

  return (
    <React.Fragment>
      <AppSettings.Provider value={{ ...state }}>
        <ContextProvider>
          <div
            className={
              "app " +
              "app-header-fixed " +
              (appHeaderNone ? "app-without-header " : "") +
              // (appSidebarFixed ? "app-sidebar-fixed " : "") +
              (appSidebarNone ? "app-without-sidebar " : "") +
              (appSidebarEnd ? "app-with-end-sidebar " : "") +
              (appSidebarWide ? "app-with-wide-sidebar " : "") +
              (appSidebarLight ? "app-with-light-sidebar " : "") +
              (appSidebarMinify ? "app-sidebar-minified " : "") +
              (appSidebarMobileToggled ? "app-sidebar-mobile-toggled " : "") +
              (appTopMenu ? "app-with-top-menu " : "") +
              (appContentFullHeight ? "app-content-full-height " : "") +
              (appSidebarEndToggled ? "app-sidebar-end-toggled " : "") +
              (appSidebarEndMobileToggled
                ? "app-sidebar-end-mobile-toggled "
                : "")
            }
          >
            {!appHeaderNone && <Header />}
            {!appSidebarNone && <Sidebar />}
            {!appContentNone && <Content />}
          </div>
        </ContextProvider>
      </AppSettings.Provider>
    </React.Fragment>
  );
}

export default DefaultLayout;
