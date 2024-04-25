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


const RevenuePrices = () => {
  const token = sessionStorage.getItem("myToken");
  const appSettings = useContext(AppSettings);
  const organisationId = sessionStorage.getItem("organisationId");
  const userData = appSettings.userData;
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [data, setData] = useState([]);
  const [pending, setPending] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [itemId, setItemId] = useState("");
  const [revenues, setRevenues] = useState([]);
  const [revenueId, setRevenueId] = useState(null);
  const [businessSize, setBusinessSize] = useState(null);
  const [businessSizeId, setBusinessSizeId] = useState(null);
  const [category, setCategory] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState(null);
  const [amount, setAmount] = useState("");
  const [revenueName, setRevenueName] = useState("");

  const transformedRevenueData = revenues
    ? revenues.map((item) => ({
        label: item.revenueName,
        value: item.revenueId,
      }))
    : "";
  
  const transformedCategoryData = category
    ? category?.map((item) => ({
        label: item.categoryName,
        value: item.categoryId,
      }))
    : {
        label: 1,
        value: "Please Select BusinessSize",
      };

  const transformedBusinessData = businessSize
    ? businessSize.map((item) => ({
        label: item.businessSizeName,
        value: item.id,
      }))
    : "";
  
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditRow((prevEditData) => ({
      ...prevEditData,
      [name]: value,
    }));
  };

  const handleBusinessChange = (selectedBusinessSize) => {
    setBusinessSizeId(selectedBusinessSize.value);
  };

  const handleRevenueChange = (selectedRevenue) => {
    setRevenueId(selectedRevenue.value);
  };

  const handleCategory = (selectedCategory) => {
    setCategoryId(selectedCategory.value);
    setCategoryName(selectedCategory.label);
  };

  const handleChange = (e) => {
    setAmount(e.target.value);
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
      selector: (row) => row.businessSize,
      sortable: true,
      grow: 1,
      style: {
        // maxWidth: "50%",
        textAlign: "center",
      },
    },
    {
      name: "Revenue",
      // selector: (row) => <RevenueName isActive={row.revenueId} />,
      selector: (row) => getTableRevenue(row?.revenueId),
    },
    {
      name: "Revenue Price",
      selector: (row) => row.amount,
      sortable: true,
      grow: 2,
      style: {
        // maxWidth: "50%",
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
          data-bs-toggle="modal"
          data-bs-target="#editRevenuePrice"
          className="btn text-dark"
          type="button"
          onClick={() => handleEdit(row)}
        >
          <i className="fa-solid fa-pen-to-square"></i> Edit
        </button>
      ),
    },
  ];

  const handleEdit = (item) => {
    console.log("Edit Item:", item);
    setEditRow(item);
    getRevenue(item?.revenueId);
    setItemId(item?.revenuePriceId);
  };

  const getTableRevenue = (revenueId) => {
    if(revenueId) {
      const revenueData = data.filter(item => item?.revenueId === revenueId);
      const revenue = revenues.filter(revenue => revenue?.revenueId === revenueData[0]?.revenueId);
      return revenue[0]?.revenueName != undefined ? revenue[0]?.revenueName : "None";
    }
  }

  const getRevenue = (revenueId) => {
    const revenue = revenues.filter(revenue => revenue?.revenueId === revenueId);
    setRevenueName(revenue[0]?.revenueName);
  }
  

  const addNewPrice = async (e) => {
    setLoading(true);
    e.preventDefault();

    await api
      .post(
        `revenue/revenue-price/${revenueId}`,
        {
          organisationId: organisationId,
          categoryName: categoryName,
          categoryId: categoryId,
          amount: amount,
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
        console.log("response for prices", response);
        if (response.status === 200) {
          setLoading(false);
          toast.success("Price Created Successfully", {
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
        console.log("error for prices", error);
        if (error.response) {
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
  const editPrice = async (e) => {
    setLoading(true);
    e.preventDefault();
    await api
      .post(
        `revenue/${itemId}/revenue-price`,
        {
          organisationId: organisationId,
          categoryName: editRow?.categoryName,
          categoryId: editRow?.categoryId,
          revenueId: editRow?.revenueId,
          description: "",
          amount: editRow?.amount,
          active: true,
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
        console.log(response)
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
        console.log("error", error);
        toast.error(error.response.data.WardName[0], {
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
      .get(`revenue/revenue-price/${organisationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPending(false);
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token, data]);

  useEffect(() => {
    api
      .get(`revenue/${organisationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setRevenues(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    api
      .get(
        `revenue/${organisationId}/business-size/${
          businessSizeId ? businessSizeId : "0"
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("response", response);
        setCategory(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [businessSizeId]);

  useEffect(() => {
    api
      .get(`enumeration/${organisationId}/business-sizes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("busines response", response);
        setBusinessSize(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <div>
        <div className="mb-2 pl-3 flex justify-content-between">
          <div className=" ">
            <h3 className=" mb-0">Revenue Prices</h3>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/home/Dashboard">Home</Link>
              </li>
              <li className="breadcrumb-item">Administration</li>
              <li className="breadcrumb-item active">Revenue Prices </li>
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
                Add New Revenue Prices
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
                <h4 className="modal-title">Add New Revenue Price</h4>
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
                  <div className=" p-2 ">
                    <form onSubmit={addNewPrice}>
                      <div className="row gx-5">
                        <div className="col mb-3">
                          <label className="form-label " htmlFor="revenue">
                            Select Revenue Type
                          </label>
                          <Select
                            id="revenue"
                            className="basic-single"
                            classNamePrefix="Please Select Billing Type"
                            name="revenue"
                            defaultValue="Select Revenue"
                            options={transformedRevenueData}
                            onChange={handleRevenueChange}
                          />
                        </div>
                      </div>

                      <div className="row gx-5">
                        <div className="col mb-3">
                          <label className="form-label " htmlFor="businessSize">
                            Select Business Size
                          </label>
                          <Select
                            id="businessSize"
                            className="basic-single"
                            classNamePrefix="Please Select Business Size"
                            name="business size"
                            defaultValue="Select Business Size"
                            options={transformedBusinessData}
                            onChange={handleBusinessChange}
                          />
                        </div>
                      </div>
                      <div className="row gx-5">
                        <div className="col mb-3">
                          <label className="form-label " htmlFor="category">
                            Select Category
                          </label>
                          <Select
                            id="category"
                            className="basic-single"
                            classNamePrefix="Please Select Category"
                            name="category"
                            defaultValue="Select Category"
                            options={transformedCategoryData}
                            onChange={handleCategory}
                          />
                        </div>
                      </div>

                      <div className="row gx-5">
                        <div className="col mb-3">
                          <label className="form-label " htmlFor="amount">
                            Revenue Price
                          </label>
                          <input
                            name="amount"
                            type="number"
                            className="form-control"
                            value={amount}
                            placeholder="Enter Amount"
                            onChange={handleChange}
                            required
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

        <div className="modal fade" id="editRevenuePrice">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">
                Edit Amount for Category{" "}
                {editRow ? editRow?.categoryName : " "}
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
                    <form onSubmit={editPrice}>
                      <div className="row gx-5">
                        <div className="col mb-3">
                          <label className="form-label " htmlFor="revenue">
                            Select Revenue Type
                          </label>
                          <input
                            name="revenue"
                            type="text"
                            className="form-control"
                            value={editRow ? revenueName : "None"}
                            placeholder="Enter Amount"
                            required
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="row gx-5">
                        <div className="col mb-3">
                          <label className="form-label " htmlFor="businessSize">
                            Select Business Size
                          </label>
                          
                          <input
                            name="business size"
                            type="text"
                            className="form-control"
                            value={editRow ? editRow.businessSize
                              : ""}
                            placeholder="Enter Amount"
                            required
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="row gx-5">
                        <div className="col mb-3">
                          <label className="form-label " htmlFor="category">
                            Select Category
                          </label>
                          <input
                            name="category"
                            type="text"
                            className="form-control"
                            value={editRow ? editRow?.categoryName : " "}
                            placeholder="Enter Amount"
                            required
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="row gx-5">
                        <div className="col mb-3">
                          <label className="form-label " htmlFor="amount">
                            Revenue Price
                          </label>
                          <input
                            name="amount"
                            type="number"
                            className="form-control"
                            value={editRow ? editRow?.amount : " "}
                            placeholder="Enter Amount"
                            onChange={handleChange}
                            required
                          />
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

export default RevenuePrices;
