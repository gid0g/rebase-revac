import React from "react";
import { Link, Outlet } from "react-router-dom";
import logo from "../../../assets/images/Logo.png";
import man from "../../../assets/images/african-american-man.png";
import UserForm from "./userForm.js";

function SelfService() {
  return (
      <div className="register register-with-news-feed">
        <div className="news-feed">
          <div
            className="news-image"
            style={{ backgroundImage: `url(${man})` }}
          ></div>
          <div
            className="news-image"
            style={{
              background:
                "linear-gradient(180deg, rgba(255, 0, 0, 0.33) 0%, rgba(0, 0, 0, 0.33) 155.28%)",
            }}
          ></div>
          <div className="news-caption">
            <h4 className="caption-title fs-38px">
              <b>RevAc</b>
            </h4>
            <p className="fs-32px">
              Enumeration, Billing Payment & Report Management Application
            </p>
          </div>
        </div>
        <div className="  register-container">
          <div className="mt-5 mb-5 login-header">
            <div className="brand">
              <div className="d-flex justify-content-between">
                <span className="l">
                  <img className="revbill-logo" src={logo} alt="revbill" />
                </span>
                <Link to="/">
                  <div className="icon">
                    <i className="fa fa-home"></i>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          {/* <hr className="no-margin" /> */}
          <div className="register-items">
            <Outlet />
          </div>
        </div>
      </div>

  );
}

export default SelfService;
