import React from "react";
import { Link } from "react-router-dom";
import DropdownProfile from "./dropdown/profile.jsx";
import DropdownMegaMenu from "./dropdown/mega.jsx";
import logo from "../../assets/images/Logo.png";

import { AppSettings } from "./../../config/app-settings.js";

const Header = () => {
  return (
    <AppSettings.Consumer>
      {({
        userData,
        toggleAppSidebarMobile,
        toggleAppSidebarEnd,
        toggleAppSidebarEndMobile,
        toggleAppTopMenuMobile,
        appHeaderLanguageBar,
        appHeaderMegaMenu,
        appTopMenu,
        appSidebarNone,
      }) => (
        <div id="header" className="app-header">
          <div className="navbar-header">
            <Link to="/home/Homepage" className="navbar-brand">
              <img className="logo" src={logo} alt="revbill"/>
            </Link>

            {appHeaderMegaMenu && (
              <button
                type="button"
                className="navbar-mobile-toggler"
                data-bs-toggle="collapse"
                data-bs-target="#top-navbar"
              >
                <span className="fa-stack fa-lg text-inverse">
                  <i className="far fa-square fa-stack-2x"></i>
                  <i className="fa fa-cog fa-stack-1x"></i>
                </span>
              </button>
            )}
            {appSidebarNone && appTopMenu && (
              <button
                type="button"
                className="navbar-mobile-toggler"
                onClick={toggleAppTopMenuMobile}
              >
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
            )}
            {!appSidebarNone && (
              <button
                type="button"
                className="navbar-mobile-toggler"
                onClick={toggleAppSidebarMobile}
              >
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
            )}
          </div>
          {appHeaderMegaMenu && <DropdownMegaMenu />}
          <div className="navbar-nav">
            <DropdownProfile userData={userData} />
          </div>
        </div>
      )}
    </AppSettings.Consumer>
  );
};

export default Header;
