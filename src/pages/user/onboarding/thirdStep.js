import React from "react";
import { Link } from "react-router-dom";

const ThirdStep = (props) => {
  return (
    <div className="register-items">
      <div className="card">
        <div className="card-body">
          <div className="register-content">
            <form className="fs-16px">
              <div className="mb-3">
                <label className="mb-2 form-label">Upload Logo</label>
                <div className="row gx-3">
                  <div className=" mb-2 mb-md-0">
                    <input
                      type="file"
                      id="file"
                      accept="image/*"
                      onChange={props.handleLogoUpload}
                    />
                  </div>
                </div>
              </div>
              <br />

              {/* {props.fileUrl && <img src={props.fileUrl} alt="Preview" />} */}

              <div className="mb-3">
                <label className="mb-2 form-label">
                  Upload Background Image
                </label>
                <div className="row gx-3">
                  <div className=" mb-2 mb-md-0">
                    <input
                      type="file"
                      id="file"
                      accept="image/*"
                      onChange={props.handleBackgroundUpload}
                    />
                  </div>
                </div>
              </div>
              <br />

              <div className="form-check mb-30px">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="1"
                  id="rememberMe"
                  required
                  onChange={props.handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="rememberMe">
                  <p className=" mb-4">
                    By Continuing, you agree to RevAc{" "}
                    <Link to="/user/register-v3" className="text-primary">
                      Terms of Use
                    </Link>{" "}
                    and{" "}
                    <Link to="/user/register-v3" className="text-primary">
                      Privacy Policy
                    </Link>
                  </p>
                </label>

                {props.errors.agreed &&
                  <div>
                    <p className="text-red-500 text-sm">
                      {props.errors.agreed}
                    </p>
                  </div>
                }
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ThirdStep;
