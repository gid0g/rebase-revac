import React, { useContext } from "react";
import Select from "react-select";
import { Context } from "./onboardingcontext";

const SecondStep = (props) => {
  const { formData } = useContext(Context);
  
  const {
    errors,
    transformedStateData,
    handleStateChange,
    handleLgaChange,
    handleLcdaChange,
    transformedLcdaData,
    transformedLgaData,
  } = props;

  return (
    <div className="register-items">
      <div className="card">
        <div className="card-body">
          <div className="register-content">
            <form className="fs-16px">
              <div className="mb-3">
                <label className="mb-2 form-label">
                  State <span className="text-danger">*</span>
                </label>
                <div className="row gx-3">
                  <div className=" mb-2 mb-md-0">
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      defaultValue="Select State"
                      isSearchable={true}
                      name="state"
                      options={transformedStateData}
                      onChange={handleStateChange}
                    />
                  </div>
                  {errors.state && 
                  <p className="text-red-500 text-sm">
                    {errors.state}
                  </p>
                  }
                </div>
              </div>

              <div className="mb-3">
                <label className="mb-2 form-label">
                  Local Government Area <span className="text-danger">*</span>
                </label>
                <div className="mb-2 mb-md-0">
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue="Select State"
                    isSearchable={true}
                    name="state"
                    options={transformedLgaData}
                    onChange={handleLgaChange}
                  />
                </div>
                {errors.lga && 
                  <p className="text-red-500 text-sm">
                    {errors.lga}
                  </p>
                  }
              </div>
{/* 
              <div className="mb-4">
                <label className="mb-2 form-label">LCDA</label>
                <div className="mb-2 mb-md-0">
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue="Select State"
                    isSearchable={true}
                    name="state"
                    options={transformedLcdaData}
                    onChange={handleLcdaChange}
                  />
                   {errors.lcda && 
                  <p className="text-red-500 text-sm">
                    {errors.lcda}
                  </p>
                  }
                </div>
              </div> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SecondStep;
