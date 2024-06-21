import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../axios/custom";
import { AppSettings } from "../../config/app-settings";
import { Spinner } from "react-activity";
import { ToastContainer, toast } from "react-toastify";
import FilterComponent from "../../components/filtercomponent/filtercomponent";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";
import DataTable from "react-data-table-component";

//override for page spinner
const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "black",
};

const Organisations = () => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem("myToken");
    const organisationId = sessionStorage.getItem("organisationId");
    let [color, setColor] = useState("#ffffff");
    const [isOn, setIsOn] = useState(false);
    const [loading, setLoading] = useState(false);
    const appSettings = useContext(AppSettings);
    const userData = appSettings.userData;
    const [moduleData, setModuleData] = useState([]);
    const [organisationData, setOrganisationData] = useState([]);
    const [editRow, setEditRow] = useState(null);
    const [itemId, setItemId] = useState("");
    const [selectedOrganisation, setSelectedOrganisation] = useState(null);
    const [filterText, setFilterText] = React.useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [pending, setPending] = React.useState(true);

    useEffect(() => {
        if (selectedOrganisation) {
            console.log(selectedOrganisation)
            navigate('../modules', { state: { selectedItem: selectedOrganisation } });
        }
    }, [selectedOrganisation, navigate])

    const handleOrganisation = (item) => {
        setSelectedOrganisation(item);
    };

    //api to get all organisations
    useEffect(() => {
        setLoading(true);
        api
            .get(`organisation`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setPending(false)
                if (response.status === 200) {
                    setLoading(false);
                    setOrganisationData(response.data);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    // Filter the organisationData to include only items with organisationApprovalStatus === 2
    const filteredData = organisationData.filter(
        (item) => item.organisationApprovalStatus === 2
    );

    const columns = [
        {
            name: "S/N",
            selector: (row, index) => index + 1,
            sortable: true,
            grow: 0,
            style: {
                textAlign: "center",
            },
        },
        {
            name: "Organisation Name",
            selector: (row) => row.organisationName,
            sortable: true,
            grow: 2,
            style: {
                textAlign: "center",
            },
        },
        {
            name: "Action",
            sortable: false,
            center: true,
            grow: 0,
            cell: (row) => (
                <button
                    className="btn shadow-md bg-blue-900 text-white"
                    onClick={() => handleOrganisation(row)}
                >
                    View Modules
                </button>
            ),
        },
    ];

    const filteredItems = filteredData.filter(
        (item) =>
            item.organisationName &&
            item.organisationName.toLowerCase().includes(filterText.toLowerCase())
    );

    const subHeaderComponentMemo = React.useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText("");
            }
        };

        return (
            <FilterComponent
                onFilter={(e) => setFilterText(e.target.value)}
                onClear={handleClear}
                filterText={filterText}
                placeholder="Search By Organisation"
            />
        );
    }, [filterText, resetPaginationToggle]);



    return (
        <>
            <ol className="breadcrumb float-xl-end">
                <li className="breadcrumb-item">
                    <Link to="/home/homepage">Home</Link>
                </li>
                <li className="breadcrumb-item">
                    <Link to="/home/modulemanagement">Module Management</Link>
                </li>
                <li className="breadcrumb-item active">Organisations</li>
            </ol>

            <h1 className="page-header mb-3">Module Management</h1>
            <hr />

            <div className="table-responsive">
                {/* <table className="">
                    <thead>
                        <tr>
                            <th className="font-bold">S/N</th>
                            <th className="font-bold">Name</th>
                            <th className="font-bold">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, idx) => (
                            <tr key={idx}>
                                <td className="font-medium">{idx + 1}</td>
                                <td className="font-medium">{item.organisationName}</td>
                                <td className="font-medium">
                                    <button
                                        className="btn shadow-md bg-blue-900 text-white"
                                        onClick={() => handleOrganisation(item)}
                                    >
                                        View Modules
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table> */}

                <DataTable
                    columns={columns}
                    data={filteredItems}
                    onClick={(item) => console.log(item)}
                    pagination
                    loading
                    progressPending={pending}
                    paginationResetDefaultPage={resetPaginationToggle} x
                    subHeader
                    subHeaderComponent={subHeaderComponentMemo}
                />
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

export default Organisations;