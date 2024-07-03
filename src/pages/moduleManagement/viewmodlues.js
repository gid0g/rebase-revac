import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
const OrganisationModules = () => {
    const navigate= useNavigate()
    const token = sessionStorage.getItem("myToken");
    const location = useLocation();
    let [color, setColor] = useState("#ffffff");
    const [isOn, setIsOn] = useState(false);
    const [loading, setLoading] = useState(false);
    const appSettings = useContext(AppSettings);
    const userData = appSettings.userData;
    const [moduleData, setModuleData] = useState([]);
    const [organisationModuleData, setOrganisationModuleData] = useState([]);
    // const [organisationId, setOrganisationId] = useState("");
    // const [organisationName, setOrganisationName] = useState("");
    const [selectedModules, setSelectedModules] = useState([]);
    // const selectedItem = location.state?.selectedItem;
    // useEffect(() => {
    //     if (selectedItem) {
    //         setOrganisationId(selectedItem.organisationId);
    //         setOrganisationName(selectedItem.organisationName);
    //         getOrganisationModules(selectedItem.organisationId);
    //     }
    // }, [selectedItem]);
    const organisationName= sessionStorage.getItem('organisationdata');
const organisationId= sessionStorage.getItem("organisationId")

    const handleToggle = () => {
        setIsOn(!isOn);
    };

    //api to get all modules for organisation
    const getOrganisationModules = async (ID) => {
        setLoading(true);
        await api
            .get(`module/${ID}/organisation-modules`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    setLoading(false);
                    setOrganisationModuleData(response.data);
                    console.log("getorganisationmodule", response.data)

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

    useEffect(()=>{
        getOrganisationModules(organisationId)
    },[])
    //api to add module to organisation
    // const addOrganisationModules = async (e) => {
    //     setLoading(true);
    //     e.preventDefault();
    //     await api
    //         .post(`module/${selectedItem.organisationId}/organisation-modules`,
    //             selectedModules,
    //             console.log("request", selectedModules),

    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             })
    //         .then((response) => {
    //             console.log("addorganisationmodule-response", response.data)

    //             if (response.status === 200) {
    //                 setLoading(false);
    //                 console.log("addorganisationmodule", response.data)

    //                 toast.success(response.data, {
    //                     position: "top-right",
    //                     autoClose: 5000,
    //                     hideProgressBar: true,
    //                     closeOnClick: true,
    //                     pauseOnHover: true,
    //                     draggable: true,
    //                     progress: undefined,
    //                     theme: "colored",
    //                 });
    //             }
    //             setLoading(false);
    //             return true;
    //         })
    //         .catch((error) => {
    //             setLoading(false);
    //             if (error.message === "timeout exceeded") {
    //                 toast.error(error.message, {
    //                     position: "top-right",
    //                     autoClose: 5000,
    //                     hideProgressBar: true,
    //                     closeOnClick: true,
    //                     pauseOnHover: true,
    //                     draggable: true,
    //                     progress: undefined,
    //                     theme: "colored",
    //                 });
    //             }
    //             setLoading(false);
    //             console.log("error", error);
    //             toast.error(error.response, {
    //                 position: "top-right",
    //                 autoClose: 5000,
    //                 hideProgressBar: true,
    //                 closeOnClick: true,
    //                 pauseOnHover: true,
    //                 draggable: true,
    //                 progress: undefined,
    //                 theme: "colored",
    //             });
    //         });
    // }
const addMenuToRole = async (e) => {
    setLoading(true);
    e.preventDefault();
    
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

    const handleCheckboxChange = (event, moduleId) => {
        if (event.target.checked) {
            setSelectedModules((prevSelectedModules) => [
                ...prevSelectedModules,
                {
                    moduleId,
                    status: 1,
                    dateCreated: new Date().toISOString(),
                    createdBy: userData[0].email
                },
            ]);
        } else {
            setSelectedModules((prevSelectedModules) =>
                prevSelectedModules.filter((item) => item.moduleId !== moduleId)
            );
        }
    };
function roleManagement(e){
    e.preventDefault()
    navigate("../roleManagement")
}
    return (
        <>
            <ol className="breadcrumb float-xl-end">
                <li className="breadcrumb-item">
                    <Link to="/home/Homepage">Home</Link>
                </li>
                <li className="breadcrumb-item active">
                Module Management                </li>

            </ol>

            <h1 className="page-header mb-3">{organisationName}</h1>
            <hr />

            <div className="d-flex flex-row-reverse w-100">
                <button
                onClick={roleManagement}
                className="btn shadow-md bg-blue-900 text-white"
                    type="button"
                >
                   Role Management
                </button>
            </div>


            <div className="table-responsive">
                <table className="">
                    <thead>
                        <tr>
                            <th className="font-bold">S/N</th>
                            <th className="font-bold">Module Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {organisationModuleData.map((item, idx) => (
                            <tr key={idx}>
                                <td className="font-medium">{idx + 1}</td>
                                {/* <td className="font-medium">{item.organisationName}</td> */}
                                <td className="font-medium">{item.modules.moduleName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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

export default OrganisationModules;