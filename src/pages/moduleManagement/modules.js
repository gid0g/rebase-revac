    import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../axios/custom";
import { AppSettings } from "../../config/app-settings";
import { Spinner } from "react-activity";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";

//override for page spinner
const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "black",
};

const Modules = () => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem("myToken");
    const organisationId = sessionStorage.getItem("organisationId");
    let [color, setColor] = useState("#ffffff");
    const [isOn, setIsOn] = useState(false);
    const [loading, setLoading] = useState(false);
    const appSettings = useContext(AppSettings);
    const userData = appSettings.userData;
    const [moduleData, setModuleData] = useState([]);
    const [editRow, setEditRow] = useState(null);
    const [itemId, setItemId] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedModule, setSelectedModule] = useState(null);

    useEffect(() => {
        if (selectedModule) {
            navigate('menus', { state: { selectedItem: selectedModule } });
        }
    }, [selectedModule, navigate]);

    const handleMenus = (item) => {
        setSelectedModule(item);
    };
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
        setItemId(item.moduleId);
    };

    //api to get all modules
    useEffect(() => {
        setLoading(true);
        api
            .get(`module`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    setLoading(false);
                    setModuleData(response.data);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const editModule = async (e) => {
        setLoading(true);
        e.preventDefault();
        await api
            .post(
                `module/${itemId}`,
                {
                    moduleName: editRow.moduleName,
                    moduleCode: editRow.moduleCode,
                    active: true,
                    dateModified: new Date().toISOString(),
                    modifiedBy: userData.email,
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
                    console.log(response)
                    toast.success(response.data, {
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

    return (
        <>
            <ol className="breadcrumb float-xl-end">
                <li className="breadcrumb-item">
                    <Link to="/home/homepage">Home</Link>
                </li>
                <li className="breadcrumb-item">
                    <Link to="/home/modulemanagement">Module Management</Link>
                </li>
                <li className="breadcrumb-item active">Home</li>
            </ol>

            <h1 className="page-header mb-3">Module Management</h1>
            <hr />

            <div className="d-flex flex-row-reverse">
                <Link
                    to="organisations"
                    className="btn bg-blue-900 shadow-md text-white px-4"
                >
                    Organisation Modules
                </Link>
            </div>

            <div className="table-responsive">
                <table className="">
                    <thead>
                        <tr>
                            <th className="font-bold">S/N</th>
                            <th className="font-bold">Module Name</th>
                            {/* <th className="font-bold">Status</th> */}
                            <th className="font-bold">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {moduleData.map((item, idx) => (
                            <tr key={idx}>
                                <td className="font-medium">{idx + 1}</td>
                                <td className="font-medium">{item.moduleName}</td>
                                {/* <td className="font-medium">{item.active ? 'Active' : 'Inactive'}</td> */}
                                <td className="font-medium">
                                    <button
                                        data-bs-toggle="modal"
                                        data-bs-target="#editModule"
                                        className="btn shadow-md bg-blue-900 text-white"
                                        type="button"
                                        onClick={() => handleEdit(item)}
                                    >
                                        Edit Module
                                    </button>
                                    <button
                                        className="btn bg-blue-900 shadow-md text-white px-4 ml-3"
                                        onClick={() => handleMenus(item)}
                                    >
                                        View Menus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="modal fade" id="editModule">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Edit Module</h4>
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
                                    <form onSubmit={editModule}>
                                        <div className="row gx-3">
                                            <div className="col-12">
                                                <div className="mb-3 ">
                                                    <label
                                                        className="form-label"
                                                        htmlFor="exampleInputEmail1"
                                                    >
                                                        Module Name
                                                    </label>

                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="moduleName"
                                                        value={editRow ? editRow.moduleName : ""}
                                                        onChange={handleEditChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="row gx-3">
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
                                            </div>
                                        </div> */}
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
        className="btn shadow-md bg-blue-900 text-white"
        type="button"
        onClick={() => window.history.back()}
      >
        Back
      </button>
        </>
    );
};

export default Modules;