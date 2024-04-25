import React, { useState, useEffect, useMemo, useContext } from "react";
import { Link } from "react-router-dom";
import api, { apis } from "../../axios/custom";
import { MyLoader } from "../../ui/contentLoader";
import { AppSettings } from "../../config/app-settings";
import DataTable from "react-data-table-component";
// import { Button } from "bootstrap";
import { Button } from "../../ui/button";
import FilterComponent from "../../components/filtercomponent/filtercomponent";

const AutoGenerateBill = () => {
  const token = sessionStorage.getItem("myToken");
  const [data, setData] = useState([]);
  const appSettings = useContext(AppSettings);
  const [pending, setPending] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [selectedBillToBePaid, setSelectedBillToBePaid] = useState("");
  const organisationId = sessionStorage.getItem("organisationId");
  const userData = appSettings.userData;
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = React.useState(false);
  const customRowsPerPageOptions = [5, 10, 20];
  const [totalRows, setTotalRows] = useState(null);
  const [perPage, setPerPage] = useState(10);

  console.log("selectedRows", selectedRows);

  const columns = [
    {
      name: "Property",
      selector: (row) => row.property.buildingName,
      sortable: true,
    },
    {
      name: "Customer ",
      selector: (row) => row.customers.fullName,
      sortable: true,
    },
    {
      name: "Agency",
      selector: (row) => row.agencies.agencyName,
      sortable: true,
    },
    {
      name: "Revenue",
      selector: (row) => row.revenues.revenueName,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => row.billAmount,
      sortable: true,
    },
    // Add more columns based on your data
  ];

  const contextActions = React.useMemo(() => {
    const handleAutoGeneration = async () => {
      console.log(createAutoBillDto);
      await api
        .post(
          `billing/${organisationId}/auto-billing`,
          {
            createAutoBillDto: createAutoBillDto,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
        })
        .catch((error)=>{
          console.log("error", error)
        })
    };

    return (
      <Button
        key="delete"
        onClick={handleAutoGeneration}
        // style={{ backgroundColor: "darkblue" }}
      >
        Auto Generate Bills
      </Button>
    );
  }, [data, selectedRows, toggleCleared]);

  const subHeaderComponentMemo = useMemo(() => {
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
        placeholder="Search By Property Name"
      />
    );
  }, [filterText, resetPaginationToggle]);
  const handleRowSelection = (state) => {
    setSelectedRows(state.selectedRows);
  };
  const createAutoBillDto = selectedRows.map((item) => ({
    billId: item.billId,
    appliedDate: item.appliedDate,
    dateCreated: new Date().toISOString(),
    createdBy: userData[0].email,
  }));

  const handleView = (item) => {
    setSelectedBillToBePaid(item.billReferenceNo);
  };
  //api to get table data
  const fetchData=(page)=>{
     api
      .get(`billing/${organisationId}?pagenumber=${page}&PageSize=${perPage}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data);
        setPending(false);
        var paginationData = response.headers["x-pagination"];
        const parsedPaginationData = JSON.parse(paginationData);
        setTotalRows(parsedPaginationData.TotalCount);
      })
      .catch((error) => {
        console.log(error);
      });
    }
  useEffect(() => {
    // Fetch data from API and update state
   fetchData(1)
   
  }, []);

   const handlePageChange = (page) => {
    fetchData(page);
  };
  const handlePerRowsChange = async (newPerPage, page) => {
    setPending(true);

    const response = await api.get(
      `billing/${organisationId}?pagenumber=${page}&PageSize=${newPerPage}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setData(response.data);
    setPerPage(newPerPage);
    setPending(false);
  };
  const filteredItems = data.filter(
    (item) =>
      item.property?.buildingName &&
      item.property?.buildingName
        .toLowerCase()
        .includes(filterText.toLowerCase())
  );

  return (
    <>
      <ol className="breadcrumb float-xl-end">
        <li className="breadcrumb-item">
          <Link to="/dashboard">Home</Link>
        </li>
        <li className="breadcrumb-item">Billing</li>
        <li className="breadcrumb-item active">Auto Generate Bills </li>
      </ol>
      <h1 className="page-header mb-3">Auto Generate Bills</h1>
      <hr />

      <DataTable
        title="Auto Generate Bills"
        columns={columns}
        data={filteredItems}
        selectableRows
        contextActions={contextActions}
        progressPending={pending}
        onSelectedRowsChange={handleRowSelection}
        pagination
        paginationRowsPerPageOptions={customRowsPerPageOptions}
        paginationResetDefaultPage={resetPaginationToggle}
        paginationServer
        paginationTotalRows={totalRows}
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        onChangePage={handlePageChange}
          onChangeRowsPerPage={handlePerRowsChange}
      />
    </>
  );
};

export default AutoGenerateBill;
