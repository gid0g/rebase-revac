import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../axios/custom";
import Select from "react-select";
import { AppSettings } from "../../config/app-settings";
import { Spinner } from "react-activity";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const BackLogBill = () => {
  const token = sessionStorage.getItem("myToken");
  const [loading, setLoading] = useState(false);
  const [propertyList, setPropertyList] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [correspondingCustomers, setCorrespondingCustomers] = useState([]);
  const appSettings = useContext(AppSettings);
  const userData = appSettings.userData;
  const organisationId = sessionStorage.getItem("organisationId");
  const [count, setCount] = useState(1);
  const [businessSize, setBusinessSize] = useState([]);
  const [businessType, setBusinessType] = useState([]);
  const [agency, setAgency] = useState([]);

  const [fields, setFields] = useState([
    {
      businessSize: 0,
      businessType: 0,
      agencyId: 0,
      revenueId: 0,
      billAmount: 0,
      category: "",
      categoryID: "",
      appliedDate: "",
      year: "",
      frequencyId: 0,
      createdBy: userData[0]?.email,
      dateCreated: new Date().toISOString(),
    },
  ]);

  const [revenueType, setRevenueType] = useState({
    0: {
      types: [],
    },
  });
  const [categoryType, setCategoryType] = useState({
    0: {
      types: [],
    },
  });
  const [amountType, setAmountType] = useState({
    0: {
      types: [],
    },
  });

  const yearOptions = [];
  const currentYear = new Date().getFullYear();

  for (let year = currentYear; year >= currentYear - 30; year--) {
    yearOptions.push({ value: year, label: year.toString() });
  }

  const transformedPropertyData = propertyList
    ? propertyList.map((item) => ({
        label: item.buildingName,
        value: item.propertyId,
      }))
    : [];

  const transformedBusinessType = businessType
    ? businessType.map((item) => ({
        label: item.businessTypeName,
        value: item.id,
      }))
    : [];

  const transformedBusinessSize = businessSize
    ? businessSize.map((item) => ({
        label: item.businessSizeName,
        value: item.id,
      }))
    : [];

  const transformedAgency = agency
    ? agency.map((item) => ({
        label: item.agencyName,
        value: item.agencyId,
      }))
    : [];

  const transformedCategoryData = (idx) => {
    return categoryType[idx]?.types.map((categories) => ({
      label: categories.categoryName,
      value: categories.categoryId,
    }));
  };

  const transformedCustomerData = correspondingCustomers
    ? correspondingCustomers.map((item) => ({
        label: item.customers.fullName,
        value: item.customerId,
      }))
    : "";

  const handleTypeChange = async (selectedBusinessType, idx) => {
    const updatedFields = [...fields];
    updatedFields[idx].businessType = selectedBusinessType.value;
    setFields(updatedFields);
    const types = await api
      .get(
        //revenue/${organisationId}/business-type/${fields[index].businessTypeId}
        `revenue`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    setRevenueType({
      ...revenueType,
      [idx]: {
        types: types,
      },
    });
  };

  const handleSizeChange = async (selectedBusinessSize, idx) => {
    const updatedFields = [...fields];
    updatedFields[idx].businessSize = selectedBusinessSize.value;
    setFields(updatedFields);
    const types = await api
      .get(
        `revenue/${organisationId}/business-size/${fields[idx].businessSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    setCategoryType({
      ...categoryType,
      [idx]: {
        types: types,
      },
    });
  };

  const handleAgencyChange = (selectedAgency, idx) => {
    const updatedFields = [...fields];
    updatedFields[idx].agencyId = selectedAgency.value;
    setFields(updatedFields);
  };

  const handleCategoryChange = async (selectedCategory, idx) => {
    const updatedFields = [...fields];
    updatedFields[idx].categoryID = selectedCategory.value;
    updatedFields[idx].category = selectedCategory.label;
    setFields(updatedFields);
    const types = await api
      .get(
        `revenue/${organisationId}/revenueprice-category/${selectedCategory.value}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    setAmountType({
      ...amountType,
      [idx]: {
        types: types,
      },
    });

    console.log("types", types);

    updatedFields[idx].billAmount = types && types[0].amount;
    setFields(updatedFields);
  };

  const handleDateChange = (event, idx) => {
    const { name, value } = event.target;
    const updatedFields = [...fields];
    updatedFields[idx][name] = value;
    setFields(updatedFields);
  };

  const handleYearChange = (selectedYear, idx) => {
    const updatedFields = [...fields];
    updatedFields[idx].year = selectedYear.value;
    setFields(updatedFields);
  };

  async function handleRevenueChange(event, index) {
    const { value } = event.target;
    const updatedFields = [...fields];
    updatedFields[index] = {
      ...updatedFields[index],
      revenueId: value,
      createdBy: userData[0]?.email,
    };
    setFields(updatedFields);
    fields[index].createdBy = userData[0]?.email;
  }

  function handleAdd() {
    const values = [...fields];
    values.push({
      dateCreated: new Date().toISOString(),
      createdBy: userData[0]?.email,
    });
    setFields(values);
    setCount(count + 1);
  }

  function handleDelete(idx) {
    const values = [...fields];
    values.splice(idx, 1);
    setFields(values);
    setCount(count - 1);
  }

  const handlePropertyChange = (selectedProperty) => {
    setSelectedProperty(selectedProperty.value);
  };

  const handleCustomerChange = (selectedCustomer) => {
    setSelectedCustomer(selectedCustomer.value);
  };

  //submit function for generating Property bill
  const submitHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    await api
      //selected customer and selected property is gotten from the selects
      .post(
        `billing/${organisationId}/generate-backlog-bill/property/${selectedProperty}/customer/${selectedCustomer}`,
        {
          createBacklogBillDto: fields,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        console.log("response", response);
        if (response.status === 200) {
          if (response.data) {
            // setData(response.data.data);
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
          } else if (response.data) {
            // setData(response.data.data);
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
          }
        }
      })
      .catch((error) => {
        console.log("context", error);
        setLoading(false);
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
      });
    setLoading(false);
  };

  //Fetch All Properties
  useEffect(() => {
    const fetchProperty = async () => {
      await api
        .get(`enumeration/${organisationId}/property`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setPropertyList(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchProperty();
  }, []);

  //fetch all corresponding customers to property
  useEffect(() => {
    const fetchCustomers = async () => {
      await api
        .get(
          `enumeration/${organisationId}/customer-properties/property/${selectedProperty}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setCorrespondingCustomers(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchCustomers();
  }, [selectedProperty]);

  //fetch business-sizes
  useEffect(() => {
    api
      .get(`enumeration/${organisationId}/business-sizes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // console.log("businessSize", response);
        setBusinessSize(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    //fetch all business types
    api
      .get(`enumeration/${organisationId}/business-types`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setBusinessType(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    //fetch all agencies
    api
      .get(`enumeration/agencies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setAgency(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <ol className="breadcrumb float-xl-end">
        <li className="breadcrumb-item">
          <Link to="/dashboard">Home</Link>
        </li>
        <li className="breadcrumb-item">Bill Management</li>
        <li className="breadcrumb-item active">Billing</li>
      </ol>
      <h1 className="page-header mb-3">BackLog Bill Generation</h1>
      <hr />

      <ToastContainer />

      <form onSubmit={submitHandler} className=" ">
        <div className="space-y-1 mt-4 ">
          <div className=" pb-2">
            <div className=" grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-3">
                <label
                  htmlFor="last-name"
                  className="block text-lg font-medium leading-6 text-gray-900"
                >
                  Property Address
                </label>
                <div className="mt-2">
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue="Select Property"
                    isSearchable={true}
                    name="propertyAddress"
                    options={transformedPropertyData}
                    // value={selectedProperty}
                    onChange={handlePropertyChange}
                  />
                </div>
              </div>
              <div className="col-span-3">
                <label
                  htmlFor="last-name"
                  className="block text-lg font-medium leading-6 text-gray-900"
                >
                  Customer Details
                </label>
                <div className="mt-2">
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue="Select Customer"
                    isSearchable={true}
                    name="color"
                    options={transformedCustomerData}
                    onChange={handleCustomerChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <hr className="font-black mt-5" />
          {fields.map((field, idx) => {
            return (
              <>
                <div className="mt-3 " key={idx}>
                  <div className="flex gap-4">
                    <div className="w-50">
                      <label
                        htmlFor="city"
                        className="block text-lg font-medium leading-6 text-gray-900"
                      >
                        Business Type
                      </label>
                      <div className="mt-2">
                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          defaultValue="Select Business Type"
                          name="color"
                          options={transformedBusinessType}
                          onChange={(selectedOption) =>
                            handleTypeChange(selectedOption, idx)
                          }
                        />
                      </div>
                    </div>
                    <div className="w-50 ">
                      <label
                        htmlFor="city"
                        className="block text-lg font-medium leading-6 text-gray-900"
                      >
                        Business Size
                      </label>
                      <div className="mt-2">
                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          defaultValue="Select Business Size"
                          name="business size"
                          options={transformedBusinessSize}
                          onChange={(selectedOption) =>
                            handleSizeChange(selectedOption, idx)
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <fieldset className="col-span-6 mt-3 ">
                    <legend className="text-lg font-medium leading-6 text-gray-900">
                      Revenue Type/Code
                    </legend>
                    <div className="mt-2 gap-x-5 flex">
                      {revenueType[idx]?.types?.map((revenue) => {
                        return (
                          <div
                            key={revenue.revenueId}
                            className="form-check form-check-inline"
                          >
                            <input
                              className="form-check-input "
                              type="radio"
                              name={`revenueId${idx}`}
                              value={revenue.revenueId}
                              onChange={(event) =>
                                handleRevenueChange(event, idx)
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="checkbox1"
                            >
                              {revenue.revenueName}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </fieldset>
                  <div className="flex mt-3 gap-3">
                    <div className="w-50 ">
                      <label
                        htmlFor="city"
                        className="block text-lg font-medium leading-6 text-gray-900"
                      >
                        Agency Area
                      </label>
                      <div className="mt-2">
                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          defaultValue="Select Agency"
                          name="color"
                          options={transformedAgency}
                          // onChange={handleAgencyChange}
                          onChange={(selectedOption) =>
                            handleAgencyChange(selectedOption, idx)
                          }
                        />
                      </div>
                    </div>
                    <div className="w-50  ">
                      <label
                        htmlFor="category"
                        className="block text-lg font-medium leading-6 text-gray-900"
                      >
                        Category
                      </label>
                      <div className="mt-2">
                        <Select
                          id="category"
                          className="basic-single"
                          classNamePrefix="select"
                          name="category"
                          options={transformedCategoryData(idx)}
                          onChange={(selectedOption) =>
                            handleCategoryChange(selectedOption, idx)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row gap-2 mt-4">
                    <div className="col-4 ">
                      <label
                        htmlFor="category"
                        className="block text-lg font-medium leading-6 text-gray-900"
                      >
                        Applied Date
                      </label>

                      <div className="mt-2 ">
                        <div className="">
                          <input
                            className="form-control"
                            name="appliedDate"
                            value={fields[idx].appliedDate}
                            onChange={(event) => handleDateChange(event, idx)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-4 ">
                      <label
                        htmlFor="category"
                        className="block text-lg font-medium leading-6 text-gray-900"
                      >
                        Year
                      </label>

                      <div className="mt-2 ">
                        <div className="">
                          <Select
                            className="basic-single"
                            classNamePrefix="select"
                            defaultValue="Select Business Size"
                            name="business size"
                            options={yearOptions}
                            onChange={(selectedOption) =>
                              handleYearChange(selectedOption, idx)
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-3 ">
                      <label
                        htmlFor="city"
                        className="block text-lg font-medium leading-6 text-gray-900"
                      >
                        Amount
                      </label>
                      <div className="mt-2">
                        <div className="">
                          <input
                            className="form-control"
                            name="amount"
                            value={fields[idx].billAmount}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {!idx == 0 && (
                    <div className=" mt-4">
                      <div className="">
                        <button
                          type="button"
                          onClick={() => handleDelete(idx)}
                          className="btn btn-danger"
                        >
                          Delete Field
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <hr className="font-black mt-5" />
              </>
            );
          })}
        </div>
        <div className="d-flex mb-4 mt-4">
          <div className="mr-2">
            <button
              type="button"
              onClick={() => handleAdd()}
              className="btn btn-default"
            >
              Add More Bills
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="rounded-md bg-blue-900 px-3 py-2 text-sm font-semibold text-white shadow-sm"
          >
            {loading ? <Spinner /> : "Generate Backlog Bill"}
          </button>
        </div>
      </form>
    </>
  );
};

export default BackLogBill;
