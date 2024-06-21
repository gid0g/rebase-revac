import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../axios/custom";
import { AppSettings } from "../../config/app-settings";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "react-activity";
import ClipLoader from "react-spinners/ClipLoader";

//override for page spinner
const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "black",
};

const Menus = () => {
    const token = sessionStorage.getItem("myToken");
    const location = useLocation();
    let [color, setColor] = useState("#ffffff");
    const [isOn, setIsOn] = useState(false);
    const [loading, setLoading] = useState(false);
    const appSettings = useContext(AppSettings);
    const userData = appSettings.userData;
    const [menuData, setMenuData] = useState([]);
    const [editRow, setEditRow] = useState(null);
    const [itemId, setItemId] = useState("");
    const [moduleId, setModuleId] = useState("");
    const [moduleName, setModuleName] = useState("");
    const [menuName, setMenuName] = useState("");
    const selectedItem = location.state?.selectedItem;

    useEffect(() => {
        if (selectedItem) {
            setModuleId(selectedItem.moduleId);
            setModuleName(selectedItem.moduleName);
            getMenus(selectedItem.moduleId);
        }
    }, [selectedItem]);

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
        setItemId(item.menuId);
    };
    const handleChange = (event) => {
        setMenuName(event.target.value);
    };

    const addMenu = async (e) => {
        setLoading(true);
        e.preventDefault();
        await api
            .post(`module/${selectedItem.moduleId}/menus`,
                {
                    menuName: menuName,
                    moduleId: moduleId,
                    dateCreated: new Date().toISOString(),
                    createdBy: userData.email,
                    active: true
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
            .then((response) => {
                console.log("add", response);

                if (response.status === 200) {
                    setLoading(false);
                    console.log("add-menus", response);

                    toast.success('Menu created successfully', {
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
                getMenus(selectedItem.moduleId)

                setLoading(false);
                return true;
            })
            .catch((error) => {
                setLoading(false);
                if (error.message === "timeout exceeded") {
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
                }
                setLoading(false);
                console.log("error", error);
                toast.error(error.response, {
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
    }

    const editMenu = async (e) => {
        setLoading(true);
        e.preventDefault();
        await api
            .post(`module/${selectedItem.moduleId}/menus/${itemId}`,
                {
                    menuName: editRow.menuName,
                    active: isOn,
                    dateModified: new Date().toISOString(),
                    modifiedBy: userData.email,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
            .then((response) => {
                if (response.status === 204) {
                    setLoading(false);
                    console.log("menus", response);
                    getMenus(selectedItem.moduleId)

                    toast.success('Menu updated successfully', {
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
                if (error.message === "timeout exceeded") {
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
                }
                setLoading(false);
                console.log("error", error);
                toast.error(error.response, {
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
    }

    const getMenus = async (moduleId) => {
        setLoading(true);
        await api
            .get(`module/${moduleId}/menus`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    setLoading(false);
                    setMenuData(response.data);

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
                if (error.message === "timeout exceeded") {
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
                }
                setLoading(false);
                console.log("error", error);
                toast.error(error.response, {
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
    }

    return (
        <>
            <ol className="breadcrumb float-xl-end">
                <li className="breadcrumb-item">
                    <Link to="/home/Homepage">Home</Link>
                </li>
                <li className="breadcrumb-item">
                    <Link to="/home/modulemanagement">Module Management</Link>
                </li>
                <li className="breadcrumb-item active">Menus</li>
            </ol>

            <h1 className="page-header mb-3">{moduleName}</h1>
            <hr />

            <div className="d-flex flex-row-reverse">
                <button
                    data-bs-toggle="modal"
                    data-bs-target="#addMenu"
                    className="btn shadow-md bg-blue-900 text-white"
                    type="button"
                >
                    Add Menu
                </button>
            </div>

            {menuData.length > 0 ? (
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>S/N</th>
                                <th>Menu Name</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menuData.map((menuItem, idx) => (
                                <tr key={menuItem.menuId}>
                                    <td>{idx + 1}</td>
                                    <td>{menuItem.menuName}</td>
                                    <td className="font-medium">{menuItem.active ? 'Active' : 'Inactive'}</td>
                                    <td className="font-medium">
                                        <button
                                            data-bs-toggle="modal"
                                            data-bs-target="#editMenu"
                                            className="btn shadow-md bg-blue-900 text-white"
                                            type="button"
                                            onClick={() => handleEdit(menuItem)}
                                        >
                                            Edit Menu
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No menus available under this module</p>
            )}

            <div className="modal fade" id="addMenu">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Add New Menu</h4>
                            <button
                                type="button"
                                className="btn-close "
                                data-bs-dismiss="modal"
                                aria-hidden="true"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <ToastContainer
                                autoClose={1000} />
                            <div className="  ">
                                <div className=" p-2 ">
                                    <form onSubmit={addMenu}>
                                        <div className="row gx-5">
                                            <div className="col">
                                                <div className="mb-3 ">
                                                    <label
                                                        className="form-label"
                                                        htmlFor="exampleInputEmail1"
                                                    >
                                                        Meun Name
                                                    </label>

                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={menuName}
                                                        placeholder="Enter Ward Name"
                                                        onChange={handleChange}
                                                        required
                                                    />
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

            <div className="modal fade" id="editMenu">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Edit Menu</h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-hidden="true"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <ToastContainer autoClose={1000} />
                            <div className="  ">
                                <div className=" p-2 ">
                                    <form onSubmit={editMenu}>
                                        <div className="row gx-3">
                                            <div className="col-12">
                                                <div className="mb-3 ">
                                                    <label
                                                        className="form-label"
                                                        htmlFor="exampleInputEmail1"
                                                    >
                                                        Menu Name
                                                    </label>

                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="moduleName"
                                                        value={editRow ? editRow.menuName : ""}
                                                        onChange={handleEditChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row gx-3">
                                            <div className="row">
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
                                                                className={`mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] ${isOn ? "checked:focus:border-primary checked:checked:bg-primary checked:checked:before:ml-[1.0625rem] checked:checked:before:scale-100 checked:checked:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:checked:before:transition-[box-shadow_0.2s,transform_0.2s] dark:checked:checked:bg-primary dark:checked:checked:after:bg-primary dark:checked:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]" : "focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400"} ${isOn ? "bg-primary" : "bg-red-500"
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
        </>
    );
};

export default Menus;