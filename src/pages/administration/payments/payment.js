import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { attachment } from "../../../axios/custom";
import { Spinner } from "react-activity";
import { AppSettings } from "../../../config/app-settings";
import "react-activity/dist/library.css";
import { ToastContainer, toast } from "react-toastify";

const Payment = () => {
  const token = sessionStorage.getItem("myToken");
  const imageWidth = 150; // Desired width in pixels
  const imageHeight = 50; // Desired height in pixels
  const organisationId = sessionStorage.getItem("organisationId");
  const appSettings = useContext(AppSettings);
  const userData = appSettings.userData;
  const [pending, setPending] = useState(true);
  const [isOn, setIsOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [paymentGateways, setPaymentGateways] = useState([]);
  const [data, setData] = useState([]);
  console.log("data------", data);
  const [selectedBankIds, setSelectedBankIds] = useState([]);

  const handleToggle = () => {
    setIsOn(!isOn);
  };

  const handleCheckboxChange = (event, bankId) => {
    if (event.target.checked) {
      setSelectedBankIds((prevSelectedBankIds) => [
        ...prevSelectedBankIds,
        {
          bankId,
          dateCreated: new Date().toISOString(),
          createdBy: userData[0].email,
        },
      ]);
    } else {
      setSelectedBankIds((prevSelectedBankIds) =>
        prevSelectedBankIds.filter((item) => item.bankId !== bankId)
      );
    }
  };

  const handleEdit = (item) => {
    const selectedOrganisationBankId = item.organisationBankId;
    const selectBankStatus = item.bankStatus;

    setEditRow(selectedOrganisationBankId);
    setIsOn(selectBankStatus);
  };

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setPending(false);
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);

  //get all payment methods
  useEffect(() => {
    api
      .get(`payment/gateway`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPaymentGateways(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //get all payment methods for an organisation
  useEffect(() => {
    api
      .get(`payment/${organisationId}/gateway`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data);
        setIsOn(response.data.bankStatus || false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //function to add payment gateway to an organisation
  const addPaymentGateway = async (e) => {
    setLoading(true);
    e.preventDefault();

    await api
      .post(`payment/${organisationId}/add-gateway`, selectedBankIds, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          if (response.data.status === 400) {
            setLoading(false);
            toast.error(response.data.statusMessage, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          } else {
            setLoading(false);
            toast.success(response.data.statusMessage, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          }
        }
        setLoading(false);
        return true;
      })
      .catch((error) => {
        setLoading(false);
        console.log("error", error);
        toast.error(error.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
  };

  //function to edit payment gateway to an organisation
  const editPaymentGateway = async (e) => {
    setLoading(true);
    e.preventDefault();

    await api
      .post(
        `payment/${organisationId}/update-gateway/${editRow}`,
        {
          bankStatus: isOn,
          dateModified: new Date().toISOString(),
          modifiedBy: userData[0].email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setLoading(false);
          toast.success(response.data.statusMessage, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
        setLoading(false);
        return true;
      })
      .catch((error) => {
        setLoading(false);
        console.log("error", error);
        toast.error(error.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
  };

  return (
    <>
      <div>
        <ol className="breadcrumb float-xl-end">
          <li className="breadcrumb-item">
            <Link to="/dashboard">Home</Link>
          </li>
          <li className="breadcrumb-item">Administration</li>
          <li className="breadcrumb-item active">Payments </li>
        </ol>
        <h1 className="page-header mb-3">Payments</h1>
        <hr />

        <div className="flex justify-center">
          <div className="w-full p-3">
            <div className="flex justify-end mb-3">
              <button
                data-bs-toggle="modal"
                data-bs-target="#addPaymentGateway"
                className="btn shadow-md bg-blue-900 text-white"
                type="button"
              >
                Add New Payment Method
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-bordered mb-0">
                <thead>
                  <tr>
                    <th className="font-bold">S/N</th>
                    <th className="font-bold">Bank Logo</th>
                    <th className="font-bold">Bank Name</th>
                    <th className="font-bold">Bank Url</th>
                    <th className="font-bold">Bank Description</th>
                    <th className="font-bold">Bank Status</th>
                    <th className="font-bold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item, idx) => {
                    if (item.banks.bankStatus) {
                      return (
                        <tr key={idx}>
                          <td className="font-medium">{idx + 1}</td>
                          <td className="font-medium">
                            <img
                              src={`data:image/png;base64,${item.banks.bankLogoData}`}
                              alt="Bank Logo"
                              style={{ width: imageWidth, height: imageHeight }}
                            />
                          </td>
                          <td className="font-medium">{item.banks.bankName}</td>
                          <td className="font-medium">{item.banks.bankUrl}</td>
                          <td className="font-medium">
                            {item.banks.bankDescription}
                          </td>
                          <td className="font-medium">
                            {item.bankStatus ? "Active" : "Inactive"}
                          </td>
                          <td className="font-medium">
                            <button
                              data-bs-toggle="modal"
                              data-bs-target="#editPaymentGateway"
                              className="btn bg-blue-900 text-white"
                              onClick={() => handleEdit(item)}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      );
                    } else {
                      return null; // Don't render the row if bankStatus is false
                    }
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="addPaymentGateway">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add New Payment Method</h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-hidden="true"
              ></button>
            </div>
            <div className="modal-body">
              <ToastContainer />
              <div className="">
                <div className="p-2">
                  <form onSubmit={addPaymentGateway}>
                    <div className="">
                      <div className="table-responsive">
                        <table className="table table-bordered mb-0">
                          <thead>
                            <tr>
                              <th className="font-bold"></th>
                              <th className="font-bold">S/N</th>
                              <th className="font-bold">Bank Logo</th>
                              <th className="font-bold">Bank Name</th>
                              <th className="font-bold">Bank Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paymentGateways.map((item, idx) => {
                              if (item.bankStatus) {
                                return (
                                  <tr key={item.bankId}>
                                    <td className="font-medium">
                                      <input
                                        type="checkbox"
                                        checked={selectedBankIds.some(
                                          (selectedItem) =>
                                            selectedItem.bankId === item.bankId
                                        )}
                                        onChange={(event) =>
                                          handleCheckboxChange(
                                            event,
                                            item.bankId
                                          )
                                        }
                                      />
                                    </td>
                                    <td className="font-medium">{idx + 1}</td>
                                    <td className="font-medium">
                                      <img
                                        src={`data:image/png;base64,${item.bankLogoData}`}
                                        alt="Bank Logo"
                                        style={{
                                          width: imageWidth,
                                          height: imageHeight,
                                        }}
                                      />
                                    </td>
                                    <td className="font-medium">
                                      {item.bankName}
                                    </td>
                                    <td className="font-medium">
                                      {item.bankDescription}
                                    </td>
                                  </tr>
                                );
                              } else {
                                return null; // Don't render the row if bankStatus is false
                              }
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="d-flex justify-content-end mt-4">
                      <button
                        type="submit"
                        className="btn shadow-md bg-blue-900 text-white"
                      >
                        {loading ? <Spinner /> : "Add"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="editPaymentGateway">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Payment Gateway</h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-hidden="true"
              ></button>
            </div>
            <div className="modal-body">
              <ToastContainer />
              <div className="  ">
                <div className=" p-2 ">
                  <form onSubmit={editPaymentGateway}>
                    <div className=" row">
                      <fieldset className="col-6">
                        <legend className="text-sm font-semibold leading-6 text-gray-900">
                          Status
                        </legend>

                        <div className="mt-6 d-flex">
                          <div className="inline relative w-10 mr-2 align-middle select-none">
                            <input
                              type="checkbox"
                              name="toggle"
                              id="toggle"
                              role="switch"
                              className={`mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] ${
                                isOn ? "bg-primary" : "bg-red-500"
                              }`}
                              checked={isOn}
                              onChange={handleToggle}
                            />
                            <span htmlFor="toggle" className="">
                              {isOn ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                      </fieldset>
                    </div>

                    <div className="d-flex justify-content-end">
                      <button
                        type="submit"
                        className="btn shadow-md bg-blue-900 text-white"
                      >
                        {loading ? <Spinner /> : "Update"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        style={{ marginTop: "20px" }}
        className="btn shadow-md bg-blue-900 text-white"
        type="button"
        onClick={() => window.history.back()}
      >
        Back
      </button>
    </>
  );
};

export default Payment;
