import React, { useContext } from "react";
import { Context } from "./onboardingcontext";

const FirstStep = (props) => {
  const { payerIdData } = useContext(Context);
  return (
    <div className="register-items ">
      <div className="card">
        <div className="card-body">
          <div className="register-content ">
            <form className="fs-16px">
              <div className="mb-3">
                <label className="mb-2 form-label">
                  Organisation Name <span className="text-danger">*</span>
                </label>
                <div className="row gx-3">
                  <div className=" mb-2 mb-md-0">
                    <input
                      autoFocus
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Enter Organization Name"
                      value={
                        payerIdData.fullName ? payerIdData.fullName : ""
                      }
                      disabled
                    />
                  </div>
                  {props.errors?.organisationName && 
                    <p className="text-red-500 text-sm">
                      {props.errors?.organisationName}
                    </p>
                  }
                </div>
              </div>
              <div className="mb-3">
                <label className="mb-2 form-label">
                  Corporate Address <span className="text-danger">*</span>
                </label>

                <input
                  autoFocus
                  type="text"
                  className="form-control  form-control-lg"
                  placeholder="Enter Corporate Address"
                  value={payerIdData?.address}
                  disabled
                />

                {props.errors?.corporateAddress && 
                  <p className="text-red-500 text-sm">
                   {props.errors?.corporateAddress}
                  </p>
                }
              </div>
              <div className="mb-3">
                <label className="mb-2 form-label">
                  Email Address <span className="text-danger">*</span>
                </label>
                <div className="row gx-3">
                  <div className=" mb-2 mb-md-0">
                    <input
                      autoFocus
                      type="text"
                      className="form-control  form-control-lg"
                      placeholder="Enter Email Address"
                      value={payerIdData?.email}
                      disabled
                    />
                  </div>
                  {props.errors?.email && 
                    <p className="text-red-500 text-sm">
                      {props.errors?.email}
                    </p>
                  }
                </div>
              </div>
              <div className="mb-3">
                <label className="mb-2 form-label">
                  Phone Number <span className="text-danger">*</span>
                </label>
                <div className="row gx-3">
                  <div className=" mb-2 mb-md-0">
                    <input
                      autoFocus
                      type="tel"
                      className="form-control  form-control-lg"
                      placeholder="Enter Phone Number"
                      value={payerIdData?.gsm}
                      disabled
                    />
                  </div>
                  {props.errors?.phone_no && 
                    <p className="text-red-500 text-sm">
                      {props.errors?.phone_no}
                    </p>
                  }
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FirstStep;
