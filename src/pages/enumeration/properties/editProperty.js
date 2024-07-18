import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { AppSettings } from "../../../config/app-settings.js";
import api from "../../../axios/custom.js";
import { useSelector } from "react-redux";
import CryptoJS from "crypto-js";

import React from "react";

const EditProperty = () => {
  const { id } = useParams();
  const token = sessionStorage.getItem("myToken");
  const [data, setData] = useState([]);
  const [spaceName, setSpaceName] = useState("");
  const [buildingNumber, setBuildingNumber] = useState("");
  const [spaceFloor, setSpaceFloor] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  // const [ward, setWard] = useState([]);
  // const [wardOption, setWardOption] = useState("");
  const [spaceIdentifier, setSpaceIdentifier] = useState([]);
  const [spaceIdentifierOption, setspaceIdentifierOption] = useState("");

  const organisationId = sessionStorage.getItem("organisationId");

  const value = {
    spaceName: spaceName,
    buildingNumber: buildingNumber,
    spaceFloor: spaceFloor,
    locationAddress: locationAddress,
    // wardOption: wardOption,
    spaceIdentifierOption: spaceIdentifierOption,
  };
  let navigate = useNavigate();
  const editSingleProperty = (e) => {
    e.preventDefault();
    api
      .put(
        `enumeration/${organisationId}/${id}/property`,
        {
          agencyId: data.agencyId,
          spaceIdentifierId: spaceIdentifierOption,
          // wardId: wardOption,
          locationAddress: locationAddress,
          spaceFloor: spaceFloor,
          buildingNo: buildingNumber,
          buildingName: spaceName,
          dateModified: new Date(),
          modifiedBy: "string",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        setData(response.data);
        setSpaceName(response.data.buildingName);
        setLocationAddress(response.data.locationAddress);
        // setWardOption(response.data.wardId);
        setspaceIdentifierOption(response.data.spaceIdentifierId);
        setSpaceFloor(response.data.spaceFloorId);

        navigate("propertyprofile");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSpaceName = (event) => {
    setSpaceName(event.target.value);
  };
  const handleBuildingNo = (event) => {
    setBuildingNumber(event.target.value);
  };
  const handleSpaceFloor = (event) => {
    setSpaceFloor(event.target.value);
  };
  const handleLocation = (event) => {
    setLocationAddress(event.target.value);
  };

  const handleSelectChange = (event) => {
    // setWardOption(event.target.value);
  };
  const handleSpaceChange = (event) => {
    setspaceIdentifierOption(event.target.value);
  };
  // useEffect(() => {
  //   api
  //     .get(`enumeration/wards`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((response) => {
  //       setWard(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);
  useEffect(() => {
    api
      .get(`enumeration/spaceIdentifiers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setSpaceIdentifier(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    api
      .get(`enumeration/${organisationId}/property/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);
        setData(response.data);
        setSpaceName(response.data.buildingName);
        setLocationAddress(response.data.locationAddress);
        // setWardOption(response.data.wardId);
        setspaceIdentifierOption(response.data.spaceIdentifierId);
        setSpaceFloor(response.data.spaceFloorId);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <AppSettings.Consumer>
      {({ cartIsShown, showModalHandler, hideModalHandler }) => (
        <div>
          <ol className="breadcrumb float-xl-end">
            <li className="breadcrumb-item">
              <Link to="/dashboard">Home</Link>
            </li>
            <li className="breadcrumb-item">Enumeration</li>

            <li className="breadcrumb-item active">Edit Property</li>
          </ol>
          <h1 className="page-header mb-3">Edit Property</h1>
          <hr />
          <div className="mt-5">
            <form>
              <fieldset>
                <div>
                  <div className="row gx-5">
                    <div className="col">
                      <div className="mb-3 ">
                        <label
                          className="form-label"
                          htmlFor="exampleInputEmail1"
                        >
                          Space Name
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="exampleInputEmail1"
                          placeholder="Space Name"
                          value={spaceName}
                          onChange={handleSpaceName}
                        />
                      </div>
                    </div>
                    <div className="col">
                      <div className="mb-3">
                        <label
                          className="form-label"
                          htmlFor="exampleInputEmail1"
                        >
                          Space Identifier
                        </label>
                        <select
                          className="form-select"
                          value={spaceIdentifierOption}
                          onChange={handleSpaceChange}
                        >
                          {spaceIdentifier.map((space) => (
                            <option
                              key={space.id}
                              value={space.spaceIdentifierName}
                              className="option-select"
                            >
                              {space.spaceIdentifierName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="row gx-5">
                    {/* <div className="col">
                      <div className="mb-3">
                        <label
                          className="form-label"
                          htmlFor="exampleInputEmail1"
                        >
                          Ward
                        </label>
                        <select
                          className="form-select"
                          value={wardOption}
                          onChange={handleSelectChange}
                        >
                          {" "}
                          {ward.map((wards) => (
                            <option key={wards.id} value={wards.wardName}>
                              {wards.wardName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div> */}
                    <div className="col">
                      <div className="mb-3">
                        <label
                          className="form-label"
                          htmlFor="exampleInputEmail1"
                        >
                          Building Number
                        </label>
                        <input
                          className="form-control"
                          type="number"
                          id="exampleInputEmail1"
                          placeholder="Building Number"
                          onChange={handleBuildingNo}
                          value={buildingNumber}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row gx-5">
                    <div className="col">
                      {" "}
                      <div className="mb-3">
                        <label
                          className="form-label"
                          htmlFor="exampleInputEmail1"
                        >
                          Space floor
                        </label>
                        <input
                          className="form-control"
                          type="number"
                          placeholder="Space Floor"
                          onChange={handleSpaceFloor}
                          value={spaceFloor}
                        />
                      </div>
                    </div>
                    <div className="col">
                      {" "}
                      <div className="mb-3 ">
                        <label
                          className="form-label"
                          htmlFor="exampleInputEmail1"
                        >
                          Area Office or Zone
                        </label>
                        <select className="form-select">
                          <option value="">Select Area Office</option>
                          <option>Small</option>
                          <option>Medium</option>
                          <option>Large</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col">
                      <div className="mb-3">
                        <label
                          className="form-label"
                          htmlFor="exampleInputEmail1"
                        >
                          Location Address
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="exampleInputEmail1"
                          placeholder="Location Address"
                          value={locationAddress}
                          onChange={handleLocation}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-5">
                  <button
                    onClick={editSingleProperty}
                    className="btn btn-primary  me-5px"
                  >
                    Edit
                  </button>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      )}
    </AppSettings.Consumer>
  );
};

export default EditProperty;
