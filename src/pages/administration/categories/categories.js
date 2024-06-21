import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import FilterComponent from "../../../components/filtercomponent/filtercomponent";
import DataTable from "react-data-table-component";
import api from "../../../axios/custom";
import { Spinner } from "react-activity";
import { AppSettings } from "../../../config/app-settings";
import Select from "react-select";
import "react-activity/dist/library.css";
import { ToastContainer, toast } from "react-toastify";
import BusinessSizeName from "./businessSizeName";

const Categories = () => {
  const token = sessionStorage.getItem("myToken");
  const appSettings = useContext(AppSettings);
  const userData = appSettings.userData;
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [data, setData] = useState([]);
  const [pending, setPending] = React.useState(true);
  const [loading, setLoading] = useState(false);
  const [editRow, setEditRow] = useState(null);

  const [itemId, setItemId] = useState("");
  const [businessSize, setBusinessSize] = useState(null);
  const [businessSizeId, setBusinessSizeId] = useState(null);
  const [payerTypeId, setPayerTypeId] = useState(null);
  const customRowsPerPageOptions = [5, 10, 20];

  const values = {
    newCategory: "",
    description: "",
  };
  const [input, setInput] = useState(values);
  const payerType = [
    { value: "", label: "-- Select a Payer Type --" },
    { value: "1", label: "Individual" },
    { value: "2", label: "Corporate" },
  ];

  const transformedBusinessData = businessSize
    ? businessSize.map((item) => ({
        label: item.businessSizeName,
        value: item.id,
      }))
    : "";
  const handleBusinessChange = (selectedBusinessSize) => {
    setBusinessSizeId(selectedBusinessSize.value);
  };

  const handlePayerType = (selectedPayerType) => {
    setPayerTypeId(selectedPayerType.value);
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
      name: "Category Name",
      selector: (row) => row.categoryName,
      sortable: true,
      grow: 1,
      style: {
        // maxWidth: "50%",
        textAlign: "center",
      },
    },
    {
      name: "Business Size",
      selector: (row) => <BusinessSizeName isActive={row.businessSizeId} />,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
      grow: 2,
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
          data-bs-target="#editCategory"
          className="btn text-dark"
          type="button"
          onClick={() => handleEdit(row)}
        >
          <i className="fa-solid fa-pen-to-square"></i> Edit
        </button>
      ),
    },
  ];

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditRow((prevEditData) => ({
      ...prevEditData,
      [name]: value,
    }));


  };
  const handleEdit = (item) => {
    setEditRow(item);
    setItemId(item.categoryId);
  };
  const organisationId = sessionStorage.getItem("organisationId");

  const handleChange = (e) => {
    const value = e.target.value;
    setInput({
      ...input,
      [e.target.name]: value,
    });
  };

  const addNewCategory = async (e) => {
    setLoading(true);
    e.preventDefault();
    await api
      .post(
        `revenue/create-category`,
        {
          organisationId: organisationId,
          businessSizeId: businessSizeId,
          payerTypeId: payerTypeId,
          categoryName: input.newCategory,
          description: input.description,
          active: true,
          dateCreated: new Date().toISOString(),
          createdBy: userData[0].email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setLoading(false);

        if (response.status === 200) {
          setLoading(false);
          toast.success("Category Sucessfully Created", {
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
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setLoading(false);
        return true;
      })
      .catch((error) => {
        setLoading(false);
      
        if (error.response) {
          if (error.response.status === 422) {
            let errorMessages = [];
            for (const response in error.response.data) {
              error.response.data[response].forEach((errorMessage) => {
                errorMessages.push(errorMessage);
              });
            }
            errorMessages.forEach((errorMessage) => {
              toast.error(errorMessage, {
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
        } else
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
  const editCategory = async (e) => {
    setLoading(true);
    e.preventDefault();
    await api
      .post(
        `revenue/${editRow?.categoryId}/categories`,
        {
          organisationId: organisationId,
          businessSizeId: editRow?.businessSizeId,
          payerTypeId: editRow?.payerTypeId,
          categoryName: editRow?.categoryName,
          description: editRow?.description,
          active: true,
          dateModified: new Date().toISOString(),
          modifiedBy: userData[0]?.email,
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
        // return true;
      })
      .catch((error) => {
        setLoading(false);
      
        if (error.response) {
          if (error.response.status === 422) {
            let errorMessages = [];
            for (const response in error.response.data) {
              error.response.data[response].forEach((errorMessage) => {
                errorMessages.push(errorMessage);
              });
            }
            errorMessages.forEach((errorMessage) => {
              toast.error(errorMessage, {
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
          toast.error(error.response.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        } else
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

  const filteredItems = data.filter(
    (item) =>
      item.categoryName &&
      item.categoryName.toLowerCase().includes(filterText.toLowerCase())
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
        placeholder="Search By Category Name"
      />
    );
  }, [filterText, resetPaginationToggle]);

  useEffect(() => {
    api
      .get(`revenue/${organisationId}/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPending(false);
        setData(response.data);
      })
      .catch((error) => {
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
  }, [token, data]);

  useEffect(() => {
    api
      .get(`enumeration/${organisationId}/business-sizes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setBusinessSize(response.data);
      })
      .catch((error) => {
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
  }, []);

  return (
    <>
      <div>
        <div className="mb-2 pl-3 flex justify-content-between">
          <div className=" ">
            <h3 className=" mb-0">Business Categories</h3>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/home/Dashboard">Home</Link>
              </li>
              <li className="breadcrumb-item">Administration</li>
              <li className="breadcrumb-item active">Business Categories </li>
            </ol>
          </div>

          <div className=" items-center	 gap-3 flex flex-row-reverse">
            <div className="flex justify-end mb-3">
              <button
                data-bs-toggle="modal"
                data-bs-target="#addCategory"
                className="btn shadow-md bg-primary text-white"
                type="button"
              >
                Add New Business Category
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-full p-3">
            <div className="">
              <div className="">
                <DataTable
                  columns={columns}
                  data={filteredItems}
                  onClick={(item) => console.log(item)}
                  pagination
                  loading
                  progressPending={pending}
                  paginationRowsPerPageOptions={customRowsPerPageOptions}
                  paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
                  subHeader
                  subHeaderComponent={subHeaderComponentMemo}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="addCategory">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add New Business Category</h4>
                <button
                  type="button"
                  className="btn-close "
                  data-bs-dismiss="modal"
                  aria-hidden="true"
                ></button>
              </div>
              <div className="modal-body">
                <ToastContainer />
                <div className="  ">
                  <div className=" p-2">
                    <form onSubmit={addNewCategory}>
                      <div className="row gx-5">
                        <div className="col">
                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor="exampleInputEmail1"
                            >
                              Category Name
                            </label>

                            <input
                              name="newCategory"
                              type="text"
                              className="form-control"
                              value={input.newCategory}
                              placeholder="Enter Category Name"
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row gx-5">
                        <div className="col">
                          <div className="mb-3 ">
                            <label
                              className="form-label"
                              htmlFor="exampleInputEmail1"
                            >
                              Description
                            </label>

                            <input
                              name="description"
                              type="text"
                              className="form-control"
                              value={input.description}
                              placeholder="Enter Category Description"
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row gx-5">
                        <div className="col mb-3">
                          <label
                            className="form-label "
                            htmlFor="exampleInputEmail1"
                          >
                            Select Business Size
                          </label>
                          <Select
                            id="category"
                            className="basic-single"
                            classNamePrefix="Please Select Billing Type"
                            name="category"
                            defaultValue="Select Category"
                            options={transformedBusinessData}
                            onChange={handleBusinessChange}
                          />
                        </div>
                      </div>
                      <div className="row gx-5">
                        <div className="col mb-3">
                          <label
                            className="form-label"
                            htmlFor="exampleInputEmail1"
                          >
                            Select Payer Type
                          </label>
                          <Select
                            id="category"
                            className="basic-single"
                            classNamePrefix="Please Select Billing Type"
                            name="category"
                            defaultValue={payerType[0]}
                            options={payerType}
                            onChange={handlePayerType}
                          />
                        </div>
                      </div>
                      <div className="d-flex justify-content-end">
                        <button
                          type="submit"
                          className="btn shadow-md bg-primary text-white"
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

        <div className="modal fade" id="editCategory">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  Edit Category for {editRow ? editRow?.categoryName : " "}
                </h4>
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
                    <form onSubmit={editCategory}>
                      <div className="row gx-5">
                        <div className="col">
                          <div className="mb-3 ">
                            <label
                              className="form-label"
                              htmlFor="exampleInputEmail1"
                            >
                              Category Name
                            </label>
                            <input
                              type="text"
                              name="categoryName"
                              className="form-control"
                              value={editRow ? editRow.categoryName : ""}
                              placeholder="Enter Category Name"
                              onChange={handleEditChange}
                              required
                            />
                          </div>
                          <div className="mb-3 ">
                            <label
                              className="form-label"
                              htmlFor="exampleInputEmail1"
                            >
                              Category Description
                            </label>
                            <input
                              type="text"
                              name="description"
                              className="form-control"
                              value={editRow ? editRow.description : ""}
                              placeholder="Enter Category Name"
                              onChange={handleEditChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-end">
                        <button
                          type="submit"
                          className="btn shadow-md bg-primary text-white"
                        >
                          {loading ? <Spinner /> : "Edit"}
                        </button>
                      </div>
                    </form>
                  </div>
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

export default Categories;
