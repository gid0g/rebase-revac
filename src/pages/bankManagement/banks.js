import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { attachment } from "../../axios/custom";
import { Spinner } from "react-activity";
import { AppSettings } from "../../config/app-settings";
import "react-activity/dist/library.css";
import { ToastContainer, toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

//override for page spinner
const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "black",
};

const Banks = () => {
    const token = sessionStorage.getItem("myToken");
    const imageWidth = 150; // Desired width in pixels
    const imageHeight = 50; // Desired height in pixels
    let [color, setColor] = useState("#ffffff");
    const gatewayData = {
        bankName: "",
        bankUrl: "",
        bankDescription: "",
    };
    const [paymentGatewayData, setPaymentGatewayData] = useState(gatewayData);
    const appSettings = useContext(AppSettings);
    const userData = appSettings.userData;
    const [filterText, setFilterText] = React.useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [data, setData] = useState([]);
    const [pending, setPending] = useState(true);
    const [isOn, setIsOn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [logo, setLogo] = useState(null);
    const [editRow, setEditRow] = useState(null);
    const [itemId, setItemId] = useState("");
    const [bankImageData, setBankImageData] = useState([]);

    const handleLogoUpload = (event) => {
        const file = event.target.files[0];
        setLogo(file);
    };

    let navigate = useNavigate();
    const handleToggle = () => {
        setIsOn(!isOn);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditRow((prevEditData) => ({
            ...prevEditData,
            [name]: value,
        }));
    };
    const handleEdit = (item) => {
        setEditRow(item);
        console.log("item", item)
        setItemId(item.bankId);
    };

    const columns = [
        {
            name: "S/N",
            selector: (row, index) => index + 1,
            sortable: true,
            grow: 0,
            style: {
                // maxWidth: "10%",
                textAlign: "center",
            },
        },
        {
            name: "Bank Logo",
            selector: (row, index) => (
                <img
                    src={bankImageData[index]}
                    alt="Bank Logo"
                    style={{ width: imageWidth, height: imageHeight }}
                />
            ),
            sortable: true,
            grow: 2,
            style: {
                // maxWidth: "50%",
                textAlign: "center",
            },
        },
        {
            name: "Bank Name",
            selector: (row) => row.bankName,
            sortable: true,
            grow: 2,
            style: {
                // maxWidth: "50%",
                textAlign: "center",
            },
        },
        {
            name: "Bank Description",
            selector: (row) => row.bankDescription,
            sortable: true,
            grow: 2,
            style: {
                // maxWidth: "50%",
                textAlign: "center",
            },
        },
        {
            name: "Bank URL",
            selector: (row) => row.bankUrl,
            sortable: true,
            grow: 2,
            style: {
                // maxWidth: "50%",
                textAlign: "center",
            },
        },
        {
            name: "Bank Status",
            selector: (row) => row.bankStatus ? "Active" : "Inactive",
            sortable: true,
            grow: 0,
            style: {
                // maxWidth: "50%",
                textAlign: "center",
            },
        },
        {
            name: "Action",
            // width: "63px",
            sortable: false,
            center: true,
            grow: 0,
            // maxWidth: "100px",

            cell: (row) => (
                <button
                    data-bs-toggle="modal"
                    data-bs-target="#editbank"
                    className="btn shadow-md bg-blue-900 text-white"
                    type="button"
                    onClick={() => handleEdit(row)}
                >
                    Edit
                </button>
            ),
        },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaymentGatewayData({ ...paymentGatewayData, [name]: value });
    };

    const addPaymentGateway = async (e) => {
        setLoading(true);
        e.preventDefault();
        const formData = new FormData();
        formData.append("BankName", paymentGatewayData.bankName);
        formData.append("BankUrl", paymentGatewayData.bankUrl);
        formData.append("BankDescription", paymentGatewayData.bankDescription);
        formData.append("BankLogo", logo);
        formData.append("BankStatus", isOn);
        formData.append("dateCreated", new Date().toISOString());
        formData.append("createdBy", userData[0]?.email);
        await attachment
            .post(`payment/add-gateway`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            })
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
                toast.error(error.response.data, {
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

    const editPaymentGateway = async (e) => {
        setLoading(true);
        e.preventDefault();
        const formData = new FormData();
        formData.append("BankName", paymentGatewayData.bankName);
        formData.append("BankUrl", paymentGatewayData.bankUrl);
        formData.append("BankDescription", paymentGatewayData.bankDescription);
        formData.append("BankLogo", logo);
        formData.append("BankStatus", isOn);
        formData.append("dateModified", new Date().toISOString());
        formData.append("modifiedBy", userData[0]?.email);

        await attachment
            .post(`payment/update-gateway/${itemId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                console.log("gateway response", response);
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

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            setPending(false);
        }, 1500);
        return () => clearTimeout(timeout);
    }, []);

    //call api to display payment gateways
    useEffect(() => {
        setLoading(true);
        api
            .get(`payment/gateway`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    setLoading(false);
                    setData(response.data);
                    const logoUrls = response.data.map(item => `data:image/png;base64,${item.bankLogoData}`);
                    setBankImageData(logoUrls);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <>
            <div>
                <ol className="breadcrumb float-xl-end">
                    <li className="breadcrumb-item">
                        <Link to="/dashboard">Home</Link>
                    </li>
                    <li className="breadcrumb-item active">Payment Management</li>
                </ol>
                <h1 className="page-header mb-3">Payment Management</h1>
                <hr />

                <div className="flex justify-center">
                    <div className="w-full p-3">
                        <div className="flex justify-end mb-3">
                            <button
                                data-bs-toggle="modal"
                                data-bs-target="#addbank"
                                className="btn shadow-md bg-blue-900 text-white"
                                type="button"
                            >
                                Add New Payment Method
                            </button>
                        </div>

                        <div className="table-responsive">
                            <table className="">
                                <thead>
                                    <tr>
                                        <th className="font-bold">S/N</th>
                                        <th className="font-bold">Bank Logo</th>
                                        <th className="font-bold">Bank Name</th>
                                        <th className="font-bold">Bank Description</th>
                                        <th className="font-bold">Bank URL</th>
                                        <th className="font-bold">Status</th>
                                        <th className="font-bold">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="font-medium">{idx + 1}</td>
                                            <td className="font-medium text-center">
                                                <img
                                                    src={`data:image/png;base64,${item.bankLogoData}`}
                                                    alt="Bank Logo"
                                                    style={{ width: imageWidth, height: imageHeight }}
                                                />
                                            </td>
                                            <td className="font-medium">{item.bankName}</td>
                                            <td className="font-medium">{item.bankDescription}</td>
                                            <td className="font-medium">{item.bankUrl}</td>
                                            <td className="font-medium">{item.bankStatus ? 'Active' : 'Inactive'}</td>
                                            <td className="font-medium">
                                                <button
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#editBank"
                                                    className="btn shadow-md bg-blue-900 text-white"
                                                    type="button"
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="addBank">
                <div className="modal-dialog">
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
                            <div className="  ">
                                <div className=" p-2 ">
                                    <form onSubmit={addPaymentGateway}>
                                        <div className="row gx-3">
                                            <div className="col-12">
                                                <div className="mb-3 ">
                                                    <label
                                                        className="form-label"
                                                        htmlFor="exampleInputEmail1"
                                                    >
                                                        Bank Name
                                                    </label>

                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="bankName"
                                                        value={paymentGatewayData.bankName}
                                                        placeholder="Enter Bank Name"
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="mb-3 ">
                                                    <label
                                                        className="form-label"
                                                        htmlFor="exampleInputEmail1"
                                                    >
                                                        Bank URL
                                                    </label>

                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="bankUrl"
                                                        value={paymentGatewayData.bankUrl}
                                                        placeholder="Enter Bank URL"
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row gx-3">
                                            <div className="col-12">
                                                <div className="mb-3 ">
                                                    <label
                                                        className="form-label"
                                                        htmlFor="exampleInputEmail1"
                                                    >
                                                        Bank Description
                                                    </label>

                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="bankDescription"
                                                        value={paymentGatewayData.bankDescription}
                                                        placeholder="Enter Bank Description"
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className=" row">
                                                <fieldset className="col-6">
                                                    <legend className="text-sm font-semibold leading-6 text-gray-900">
                                                        Status
                                                    </legend>

                                                    <div className="mt-6 d-flex ">
                                                        <div className="inline relative w-10 mr-2 align-middle select-none">
                                                            <input
                                                                type="checkbox"
                                                                name="toggle"
                                                                id="toggle"
                                                                role="switch"
                                                                className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                                                                checked={isOn}
                                                                onChange={handleToggle}
                                                            />
                                                            <span htmlFor="toggle" className="">
                                                                {isOn ? "Active" : "Inactive"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </fieldset>
                                                <div className="col-6">
                                                    <label
                                                        className="form-label"
                                                        htmlFor="exampleInputEmail1"
                                                    >
                                                        Add Bank Logo
                                                    </label>
                                                    <div className="">
                                                        <input
                                                            type="file"
                                                            id="file"
                                                            accept="image/*"
                                                            onChange={handleLogoUpload}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-end">
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

            <div className="modal fade" id="editBank">
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
                                        <div className="row gx-3">
                                            <div className="col-12">
                                                <div className="mb-3 ">
                                                    <label
                                                        className="form-label"
                                                        htmlFor="exampleInputEmail1"
                                                    >
                                                        Bank Name
                                                    </label>

                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="bankName"
                                                        value={editRow ? editRow.bankName : ""}
                                                        onChange={handleEditChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="mb-3 ">
                                                    <label
                                                        className="form-label"
                                                        htmlFor="exampleInputEmail1"
                                                    >
                                                        Bank URL
                                                    </label>

                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="bankUrl"
                                                        value={editRow ? editRow.bankUrl : ""}
                                                        onChange={handleEditChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row gx-3">
                                            <div className="col-12">
                                                <div className="mb-3 ">
                                                    <label
                                                        className="form-label"
                                                        htmlFor="exampleInputEmail1"
                                                    >
                                                        Bank Description
                                                    </label>

                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="bankDescription"
                                                        value={editRow ? editRow.bankDescription : ""}
                                                        onChange={handleEditChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className=" row">
                                                <fieldset className="col-6">
                                                    <legend className="text-sm font-semibold leading-6 text-gray-900">
                                                        Status
                                                    </legend>

                                                    <div className="mt-6 d-flex ">
                                                        <div className="inline relative w-10 mr-2 align-middle select-none">
                                                            <input
                                                                type="checkbox"
                                                                name="toggle"
                                                                id="toggle"
                                                                role="switch"
                                                                className={`mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] ${isOn ? "bg-primary" : "bg-red-500"
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
                                                <div className="col-6">
                                                    <label
                                                        className="form-label"
                                                        htmlFor="exampleInputEmail1"
                                                        value={editRow ? editRow.bankLogoName : ""}
                                                    >
                                                        Update Bank Logo
                                                    </label>
                                                    <div className="">
                                                        <input
                                                            type="file"
                                                            id="file"
                                                            accept="image/*"
                                                            onChange={handleLogoUpload}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
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

            {loading && <ClipLoader
                color={color}
                loading={loading}
                cssOverride={override}
                size={100}
                aria-label="Loading Spinner"
                data-testid="loader"
            />}
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

export default Banks;