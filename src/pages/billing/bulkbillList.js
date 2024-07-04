import React, { useState, useEffect, useMemo } from "react";
import DataTable from "react-data-table-component";
import FilterComponent from "../../components/filtercomponent/filtercomponent";

const BulkBillList = ({data}) => {
  console.log("Passed Data:", data);

  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const customRowsPerPageOptions = [5, 10, 20];
  const [totalRows, setTotalRows] = useState(null);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);

  const columns = [
    {
      name: "S/N",
      selector: (row, index) =>index + 1,
      sortable: true,
      grow: 0,
      style: {
        textAlign: "center",
      },
    },
    {
      name: "Item",
      selector: (row) => row.itemId,
      sortable: true,
      grow: 2,
      style: {
        textAlign: "center",
      },
    },
    {
      name: "Status",
      selector: (row) => row.status  == 0 ? "Failed" : "Success",
      sortable: true,
      grow: 2,
      style: {
        textAlign: "center",
      },
    },
    {
      name: "Reason",
      selector: (row) => row.statusMessage,
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
      grow: 2,

      cell: (row) => (
        <div>
          <button
            data-bs-toggle="modal"
            data-bs-target="#viewBill"
            className="btn bg-primary text-white"
            type="button"
            onClick={() => handleView(row)}
          >
            View <i className="fas fa-eye fa-fw"></i> 
          </button>
        </div>
      ),
    },
  ];


  const filteredItems = data.filter(
    (item) =>
      item?.statusMessage &&
      item?.statusMessage.toLowerCase().includes(filterText.toLowerCase())
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
        placeholder="Search..."
      />
    );
  }, [filterText, resetPaginationToggle]);

  const handleView = (item) => {
    console.log("Item:", item?.bill);
    setSelectedRow(item?.bill);
  };

  const handlePageChange = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    setTotalRows(reversedFilteredItems.length);
  };
  

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setTotalRows(reversedFilteredItems.length);
  };
  


  return (
    <>
      <div className="w-full table-responsive mt-12 lg:mt-16">
        <DataTable
          columns={columns}
          data={reversedFilteredItems}
          pagination
          paginationRowsPerPageOptions={customRowsPerPageOptions}
          paginationResetDefaultPage={resetPaginationToggle}
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
          paginationServer
          paginationTotalRows={totalRows}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handlePerRowsChange}
        />
      </div>

      <div className="modal fade" id="viewBill">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">View Bill</h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-hidden="true"
                ></button>
              </div>
              <div className="modal-body">
                <div className="  ">
                  <div className=" p-2 ">
                      <div className="grid sm:grid-cols-4 gap-8 h-96 overflow-auto">
                        <div className="flex flex-col justify-start items-start gap-0.5">
                            <h4 className="text-lg font-semibold">Fullname</h4>
                            <p>{selectedRow?.fullName ? selectedRow?.fullName : "None"}</p>
                        </div>

                        <div className="flex flex-col justify-start items-start gap-0.5">
                            <h4 className="text-lg font-semibold">Firstname</h4>
                            <p>{selectedRow?.firstName ? selectedRow?.firstName : "None"}</p>
                        </div>

                        <div className="flex flex-col justify-start items-start gap-0.5">
                            <h4 className="text-lg font-semibold">LastName</h4>
                            <p>{selectedRow?.lastName ? selectedRow?.lastName : "None"}</p>
                        </div>

                        <div className="flex flex-col justify-start items-start gap-0.5">
                            <h4 className="text-lg font-semibold">MiddleName</h4>
                            <p>{selectedRow?.middleName ? selectedRow?.middleName : "None"}</p>
                        </div>

                        
                        <div className="flex flex-col justify-start items-start gap-0.5">
                            <h4 className="text-lg font-semibold">Email</h4>
                            <p>{selectedRow?.email ? selectedRow?.email : "None"}</p>
                        </div>

                        <div className="flex flex-col justify-start items-start gap-0.5">
                            <h4 className="text-lg font-semibold">Gender</h4>
                            <p>{selectedRow?.gender ? selectedRow?.gender : "None"}</p>
                        </div>

                        
                        <div className="flex flex-col justify-start items-start gap-0.5">
                            <h4 className="text-lg font-semibold">Phone Number</h4>
                            <p>{selectedRow?.phoneNumber ? selectedRow?.phoneNumber : "None"}</p>
                        </div>

                        <div className="flex flex-col justify-start items-start gap-0.5">
                            <h4 className="text-lg font-semibold">PayerId</h4>
                            <p>{selectedRow?.payerID ? selectedRow?.payerID : "None"}</p>
                        </div>

                        <div className="flex flex-col justify-start items-start gap-0.5">
                            <h4 className="text-lg font-semibold">PayerType</h4>
                            <p>{selectedRow?.payerType ? selectedRow?.payerType : "None"}</p>
                        </div>

                        <div className="flex flex-col justify-start items-start gap-0.5">
                            <h4 className="text-lg font-semibold">Building Name</h4>
                            <p>{selectedRow?.buildingName ? selectedRow?.buildingName : "None"}</p>
                        </div>

                        <div className="flex flex-col justify-start items-start gap-0.5">
                            <h4 className="text-lg font-semibold">Building Number</h4>
                            <p>{selectedRow?.buildingNumber ? selectedRow?.buildingNumber : "None"}</p>
                        </div>

                        <div className="flex flex-col justify-start items-start gap-0.5">
                            <h4 className="text-lg font-semibold">Business Size</h4>
                            <p>{selectedRow?.businessSize ? selectedRow?.businessSize : "None"}</p>
                        </div>

                        <div className="flex flex-col justify-start items-start gap-0.5">
                            <h4 className="text-lg font-semibold">Business Type</h4>
                            <p>{selectedRow?.businessType ? selectedRow?.businessType : "None"}</p>
                        </div>

                        
                        <div className="flex flex-col justify-start items-start gap-0.5">
                            <h4 className="text-lg font-semibold">Revenue</h4>
                            <p>{selectedRow?.revenue ? selectedRow?.revenue : "None"}</p>
                        </div>

                        <div className="flex flex-col justify-start items-start gap-0.5">
                            <h4 className="text-lg font-semibold">Revenue Code</h4>
                            <p>{selectedRow?.revenueCode ? selectedRow?.revenueCode : "None"}</p>
                        </div>

                        <div className="flex flex-col justify-start items-start gap-0.5">
                            <h4 className="text-lg font-semibold">Space Identifier</h4>
                            <p>{selectedRow?.spaceIdentifier ? selectedRow?.spaceIdentifier : "None"}</p>
                        </div>

                        <div className="flex flex-col justify-start items-start gap-0.5">
                            <h4 className="text-lg font-semibold">Street Name</h4>
                            <p>{selectedRow?.streetName ? selectedRow?.streetName : "None"}</p>
                        </div>

                        <div className="flex flex-col justify-start items-start gap-0.5">
                            <h4 className="text-lg font-semibold">Category</h4>
                            <p>{selectedRow?.category ? selectedRow?.category : "None"}</p>
                        </div>

                        <div className="flex flex-col justify-start items-start gap-0.5">
                            <h4 className="text-lg font-semibold">Agency</h4>
                            <p>{selectedRow?.agency ? selectedRow?.agency : "None"}</p>
                        </div>


                        <div className="flex flex-col justify-start items-start gap-0.5">
                            <h4 className="text-lg font-semibold">Title</h4>
                            <p>{selectedRow?.title ? selectedRow?.title : "None"}</p>
                        </div>

                        {/* <div className="flex flex-col justify-start items-start gap-0.5">
                            <h4 className="text-lg font-semibold">Ward</h4>
                            <p>{selectedRow?.ward ? selectedRow?.ward : "None"}</p>
                        </div> */}

                        <div className="flex flex-col justify-start items-start gap-0.5">
                            <h4 className="text-lg font-semibold">Interest</h4>
                            <p>{selectedRow?.interest ? selectedRow?.interest : "None"}</p>
                        </div>

                        <div className="flex flex-col justify-start items-start gap-0.5">
                            <h4 className="text-lg font-semibold">Penalty</h4>
                            <p>{selectedRow?.penalty ? selectedRow?.penalty : "None"}</p>
                        </div>

                        <div className="flex flex-col justify-start items-start gap-0.5">
                            <h4 className="text-lg font-semibold">Applied Date</h4>
                            <p>{selectedRow?.appliedDate ? selectedRow?.appliedDate : "None"}</p>
                        </div>


                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    
    </>
  )
}

export default BulkBillList
