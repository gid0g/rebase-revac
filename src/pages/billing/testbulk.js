import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import FilterComponent from "../../components/filtercomponent/filtercomponent";

const bulkBillList = ({data}) => {

  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const customRowsPerPageOptions = [5, 10, 20];
  const [pending, setPending] = useState(true);
  const [totalRows, setTotalRows] = useState(null);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);

  const columns = [
    {
      name: "S/N",
      selector: (row, index) => (currentPage - 1) * perPage + index + 1,
      sortable: true,
      grow: 0,
      style: {
        textAlign: "center",
      },
    },
    {
      name: "Item",
      selector: (row) => row?.itemId,
      sortable: true,
      grow: 2,
      style: {
        textAlign: "center",
      },
    },
    {
      name: "Status",
      selector: (row) => row?.status,
      sortable: true,
      grow: 2,
      style: {
        textAlign: "center",
      },
    },
    {
      name: "Reason",
      selector: (row) => row?.statusMessage,
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
        <div>
          <button
            data-bs-toggle="modal"
            data-bs-target="#viewUser"
            className=" text-dark"
            type="button"
            onClick={() => handleView(row)}
          >
            <i className="fas fa-floppy-disk fa-fw"></i> View
          </button>
        </div>
      ),
    },
  ];
  const filteredItems = data.filter(
    (item) =>
      item?.property?.buildingName &&
      item?.property?.buildingName.toLowerCase().includes(filterText.toLowerCase())
  );

  const reversedFilteredItems = [...filteredItems].reverse();
  
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

  const handleView = (item) => {
    console.log("Item:", item);
    setSelectedRow(item);
  };

  const handlePageChange = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage)
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
  }


  return (
    <div className="table-responsive">
    <DataTable
      columns={columns}
      data={reversedFilteredItems}
      pagination
      paginationRowsPerPageOptions={customRowsPerPageOptions}
      progressPending={pending}
      paginationResetDefaultPage={resetPaginationToggle}
      subHeader
      subHeaderComponent={subHeaderComponentMemo}
      paginationServer
      paginationTotalRows={totalRows}
      onChangePage={handlePageChange}
      onChangeRowsPerPage={handlePerRowsChange}
    />
  </div>
  )
}

export default bulkBillList
