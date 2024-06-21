
import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../../axios/custom";
import Select from "react-select";
import { AppSettings } from "../../config/app-settings";
import { Spinner } from "react-activity";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useNavigate } from "react-router-dom";
import AlertPopup from "./alertPopup";

const billingType = [
  { value: "", label: "-- Select a Property Type --" },
  { value: "1", label: "Property" },
  { value: "2", label: "Non-Property" },
];

const Billings = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("myToken");
  const [loading, setLoading] = useState(false);
  const [businessSize, setBusinessSize] = useState([]);
  const [businessType, setBusinessType] = useState([]);
  const [agency, setAgency] = useState([]);
  const [propertyList, setPropertyList] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [correspondingCustomers, setCorrespondingCustomers] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [billingTypes, setBillingTypes] = useState("");
  const [frequency, setFrequency] = useState([]);
  const [selectedRevenueItems, setSelectedRevenueItems] = useState([]);

  const appSettings = useContext(AppSettings);
  const userData = appSettings.userData;
  const organisationId = sessionStorage.getItem("organisationId");
  const [count, setCount] = useState(1);
  const currentDate = new Date();
  const isoDate = currentDate.toISOString();
  const [fields, setFields] = useState([
    {
      agencyId: 0,
      appliedDate: `${new Date().getFullYear()}`,
      BillRevenuePrices: [],
      businessTypeId: 0,
      businessSizeId: 0,
      dateCreated: currentDate,
      createdBy: userData[0]?.email,
    },
  ]);

  const [checkedRevenues, setCheckedRevenues] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryAmounts, setCategoryAmounts] = useState([]);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [isRevenueTypeVisible, setIsRevenueTypeVisible] = useState(false);
  const [isAmountVisible, setIsAmountVisible] = useState(false);

  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);

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

  const transformedPropertyData = propertyList
    ? propertyList.map((item) => ({
        label: item.buildingName,
        value: item.propertyId,
      }))
    : "";
  const transformedfrequency = frequency
    ? frequency?.map((item) => ({
        label: item.frequencyName,
        value: item.id,
      }))
    : "";
//////////////////////////
          useEffect(()=>{
            console.log("allCustomers", allCustomers)
            console.log("transformedAllCustomerData", transformedAllCustomerData)
          },[allCustomers])    
///////////////////////
  const transformedCategoryData = (idx) => {
    return categoryType[idx]?.types.map((category) => ({
      label: category.categoryName,
      value: category.categoryId,
    }));
  };

  const transformedCustomerData = correspondingCustomers
    ? correspondingCustomers.map((item) => ({
        label: item.customers.fullName,
        value: item.customerId,
      }))
    : [];

  const transformedAllCustomerData = allCustomers
    ? allCustomers.map((item) => ({
        label: item.fullName,
        value: item.customerId,
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
    console.log("property", selectedProperty);
  };

  const handleBillingTypeChange = (selectedBilling) => {
    setBillingTypes(selectedBilling.value);
    setFields([
      {
        agencyId: 0,
        appliedDate: `${new Date().getFullYear()}`,
        BillRevenuePrices: [],
        businessTypeId: 0,
        businessSizeId: 0,
        dateCreated: currentDate,
        createdBy: userData[0]?.email,
      }]);

       setCheckedRevenues([]);
       setCategories([]);
       setCategoryAmounts([]);
       setCategoryIndex(0);
       setIsRevenueTypeVisible(false);
       setIsAmountVisible(false);
       setIsCategoriesLoading(false);
  };
  const handleCustomerChange = (selectedCustomer) => {
    setSelectedCustomer(selectedCustomer.value);
    console.log("customer", selectedCustomer);
  };



  // useEffect to handle API requests when checkbox selection changes
  useEffect(() => {
    const fetchCategories = async () => {
      if (checkedRevenues.length > 0) {
        setIsCategoriesLoading(true);

        try {
          const fetchedRevenues = await fetchRevenueCategories(checkedRevenues);
          setCategories(fetchedRevenues);
          setIsCategoriesLoading(false);
        } catch (error) {
          console.error(error);
          setIsCategoriesLoading(false);
        }
      }
    }

    fetchCategories();
  }, [checkedRevenues]);
  
//////////////////////////////

/////////////////////////////

  const fetchRevenueCategories = async (revenueIds) => {
    console.log("Organization ID:", organisationId)
    console.log("Revenue ID:", revenueIds)
    const apiEndpoints = revenueIds.map(revenueId => `revenue/${organisationId}/revenueprice-revenue/${revenueId}`);
  
    try {
      const responses = await Promise.all(
        apiEndpoints.map(apiEndpoint =>
          api.get(apiEndpoint, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        )
      );

      console.log("Categories", responses);
      
      const fetchedRevenuesCategories = responses.map(response => response.data);
      return fetchedRevenuesCategories;
    } catch (error) {
      throw error;
    }
  }


  const [errors, setErrors] = useState({});

  const validateField = (field) => {
    let fieldErrors = {};
    if (field.agencyId === 0) {
      fieldErrors.agencyId = 'Agency is required';
    }

    if (field.businessTypeId === 0) {
      fieldErrors.businessTypeId = 'Business Type is required';
    }

    if (field.businessSizeId === 0) {
      fieldErrors.businessSizeId = 'Business Size is required';
    }

    return fieldErrors;
  };

  const validateForm = () => {
    const newErrors = {};
    fields.forEach((field, index) => {
      const fieldErrors = validateField(field);
      if (Object.keys(fieldErrors).length > 0) {
        newErrors[`Field ${index + 1}`] = fieldErrors;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };




  const handleTypeChange = async (selectedBusinessType, idx) => {

    // setting revenueType to default until business type changes
    setCategories([]);
    
    const updatedFields = [...fields];
    updatedFields[idx].businessTypeId = selectedBusinessType.value;
    setFields(updatedFields);
    console.log("Selected Business Type:", selectedBusinessType);

    setIsRevenueTypeVisible(true);
    const types = await api
      .get(
        `revenue/${organisationId}/business-type/${fields[idx].businessTypeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("got revenuetypes:", response.data)
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
    console.log("Updated Fields", updatedFields);
    console.log("Index Fields", idx);

    updatedFields[idx].businessSizeId = selectedBusinessSize.value;
    setFields(updatedFields);


    const types = await api
      .get(
        `revenue/${organisationId}/business-size/${fields[idx].businessSizeId}`,
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

    setCategoryType((prevCategoryType) => ({
      ...prevCategoryType,
      [idx]: {
        types: types,
      },
    }));

  };

  const handleFrequencyChange = (selectedFrequency, idx) => {
    const updatedFields = [...fields];
    updatedFields[idx].frequencyId = selectedFrequency.value;
    setFields(updatedFields);
  };

  const handleAgencyChange = (selectedAgency, idx) => {
    const updatedFields = [...fields];
    updatedFields[idx].agencyId = selectedAgency.value;
    setFields(updatedFields);
  };

function handleRevenueChange(idx, event) {

    const { checked } = event.target;
    const value = event.target.value;
    const updatedFields = [...fields];

    console.log("Updated Fields:", updatedFields);
    updatedFields[idx].createdBy = userData[0]?.email;
    setFields(updatedFields);   
    
    setSelectedRevenueItems(prevSelectedItems => 
      [
        ...prevSelectedItems, 
        updatedFields[idx].revenueId
      ]);

      console.log("Checked Revenues:", checkedRevenues);
  }


  
  const handleCheckedRevenueChange = (revenueId) => {
    if(revenueId) {
      setCheckedRevenues((prevCheckedRevenues) => {
        if (prevCheckedRevenues.includes(revenueId)) {
          const filteredCheckedCategories = prevCheckedRevenues.filter(id => id !== revenueId);
          return filteredCheckedCategories;
        } else {
          return [...prevCheckedRevenues, revenueId];
        }
      });

    }

    console.log("Checked Revenues:", checkedRevenues);
  }
  

  const transformedRevenueCategoryOptions = (index) => {
    
    const filteredCategories = categories.map(category => {
      const filteredData = category.filter(item => checkedRevenues.includes(item.revenueId))
      return {
        data: filteredData,
      };
    });

    // Get the filtered categories for the selected revenueId
    const filteredCategoriesForIndex = filteredCategories[index];

    // Category options
    const options = filteredCategoriesForIndex?.data?.map((item) => ({
      value: item.categoryId,
      label: item.categoryName,
      amount: item.amount,
      revenue: item.revenueId,
    }));
  
    return options;
  };


  const handleCategoryChange = (selectedCategory, index) => {
    const updatedFields = [...fields];
   
    if(selectedCategory) {

      const billRevenuePrice = {
        revenueId: selectedCategory?.revenue,
        billAmount: selectedCategory?.amount,
        category: selectedCategory?.label
      }

      updatedFields[0].BillRevenuePrices = [
        ...updatedFields[0].BillRevenuePrices,
        billRevenuePrice,
      ];
    
      // Update the categoryAmounts array with the amount for the current category
      const newCategoryAmounts = [...categoryAmounts];
      newCategoryAmounts[index] = selectedCategory?.amount;
      setCategoryAmounts(newCategoryAmounts);
    
      setIsAmountVisible(true);

    }
  };



  //submit function for generating Property bill
  const submitHandler = async (e) => {
    e.preventDefault();

    const isValid = validateForm();
    const confirmation = window.confirm("Do you want to continue to generate bill?");
    if (isValid && confirmation) {    
      const formData = {
        createPropertyBillDto: fields,
      }
     
        console.log("see", formData);
      console.log(organisationId,selectedProperty,selectedCustomer)

      try {
      setLoading(true);
      const response = await api.post(
        `billing/${organisationId}/generate-bill/property/${selectedProperty}/customer/${selectedCustomer}`, formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("response--->", response);
  
      if (response.status === 200 || response.status === 403) {
        if (response.data && response?.data?.statusMessage != "Bill(s) Exists!") {
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

          setTimeout(() => {
            navigate("/home/billing/previewbill/", {
              state: {
                customerId: selectedCustomer,
                previewData: response?.data
              }
            })
          }, 2000);
          
        } else {
          toast.error(response.data.statusMessage, {
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
    } catch (error) {
      const { response } = error;
      
      toast.error(response?.data || "An error occurred", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }

  }
};
  

  //submit function for generating Non-Property bill

  const submitNonPropertyHandler = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    const confirmation = window.confirm("Do you want to continue to generate bill?");

    console.log("Non-Fields:", fields);
    if (isValid && confirmation) {    
      const formData = {
        createNonPropertyBillDto: fields,
      }

      try {
        setLoading(true);
    
        const response = await api.post(
          `billing/${organisationId}/generate-bill/customer/${selectedCustomer}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        if (response.status === 200) {
          if (response.data) {
            toastNotification(response.data.message, "success");
            setTimeout(() => {
              navigate("/home/billing/previewbill/", {
                state: {
                  customerId: selectedCustomer,
                  previewData: response?.data
                }
              })
            }, 2000);

          } else if (response.data) {
            toastNotification(response.data.message, "success");
          }
        }
        setLoading(false);
      } catch (error) {
        handleErrors(error);
      }
    }
  };
  
  const toastNotification = (message, type) => {
    toast[type](message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };
  
  const handleErrors = (error) => {
    console.log("context", error);
    setLoading(false);
    const errorMessages = [];
    for (const response in error.response.data) {
      error.response.data[response].forEach((errorMessage) => {
        errorMessages.push(errorMessage);
      });
    }
    errorMessages.forEach((errorMessage) => {
      toastNotification(errorMessage, "error");
    });
  };
  

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
    //fetch all frequencies
    api
      .get("billing/frequency", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setFrequency(response.data);
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
      .get(`enumeration/${organisationId}/agencies`, {
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
  }, [organisationId, token]);

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
  }, [organisationId, token]);

  //fetch all customers
  useEffect(() => {
    const fetchCustomers = async () => {
      await api
        .get(`customer/${organisationId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setAllCustomers(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchCustomers();
  }, [organisationId, token]);

  //fetch corresponding Customers by property
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
            console.log("customers",response.data)
            console.log("customers",selectedProperty)
          setCorrespondingCustomers(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchCustomers();
  }, [organisationId, selectedProperty, token]);

  return (
    <>
      <ol className="breadcrumb float-xl-end">
        <li className="breadcrumb-item">
          <Link to="/dashboard">Home</Link>
        </li>
        <li className="breadcrumb-item">Bill Management</li>
        <li className="breadcrumb-item active">Billing </li>
      </ol>
      <h1 className="page-header mb-3">Billing</h1>
      {Object.entries(errors).map(([field, fieldErrors]) => (
          <div key={field} className="bg-red-600 py-4 px-6 rounded-md ">
            {Object.entries(fieldErrors).map(([key, value]) => (
              <p key={key} className="text-white text-sm">{value}</p>
            ))}
          </div>
        ))}
      <hr />
      <div className="col-span-6 mb-3">
        <label className=" block text-lg font-bold leading-6 text-gray-900">
          Billing Type:
        </label>
        <div className="flex mt-2 ">
          <Select
            id="category"
            className="basic-single w-25"
            classNamePrefix="Please Select Billing Type"
            name="category"
            defaultValue={billingType[0]}
            options={billingType}
            onChange={handleBillingTypeChange}
          />
        </div>
      </div>
      <ToastContainer />
      {billingTypes == 1 && (
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
                <div key={idx}>
                  <div className="flex gap-3 mt-4">
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
                  </div>
                  <div className="mt-3 " key={idx}>
                    <div className="flex gap-4">
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
                            onChange={(selectedOption) => {
                              handleSizeChange(selectedOption, idx);
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {isRevenueTypeVisible && (
                      <fieldset className="col-span-6 mt-3 ">
                        <legend title="Multiple Revenue type/code can be selected"  className="text-lg font-medium leading-6 text-gray-900">
                          Revenue Type/Code <pre className="text-xs">(Multiple Revenue type/code can be selected)</pre>
                        </legend>
                        <div className="mt-2 gap-x-5 flex overflow-auto">
                          {revenueType[idx]?.types?.map((revenue) => {
                            return (
                              <div
                                key={revenue.revenueId}
                                className="form-check form-check-inline"
                              >
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name={`revenueId${idx}`}
                                  value={revenue.revenueId}
                                  checked={checkedRevenues.includes(revenue.revenueId)}
                                  onChange={(event) => {
                                    handleRevenueChange(idx, event);
                                    handleCheckedRevenueChange(revenue.revenueId);
                                  }}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`revenueId${idx}`}
                                >
                                  {revenue.revenueName}
                                </label>
                              </div>
                            );
                          })}
                        </div>

                        {categories && 
                            categories.length != 0 && 
                              categories.map((category, index) => (
                                
                          <div
                            key={index}
                            className="flex gap-3 mt-4"
                          >
                            <div className="w-50">
                              <label
                                htmlFor={`category_${index}`}
                                className="block text-lg font-medium leading-6 text-gray-900"
                              >
                                Category
                              </label>
                              <div className="mt-2">
                                <Select
                                  id={`category_${index}`}
                                  className="basic-single w-50"
                                  classNamePrefix="select"
                                  name={`category_${index}`}
                                  options={transformedRevenueCategoryOptions(index)}
                                  onChange={(selectedOption) => {
                                    handleCategoryChange(selectedOption, index);
                                  }}
                                />
                              </div>
                            </div>
                            {isAmountVisible && (
                              <div className="w-50">
                                <label
                                  htmlFor={`amount_${index}`}
                                  className="block text-lg font-medium leading-6 text-gray-900"
                                >
                                  Amount
                                </label>
                                <div className="mt-2">
                                  <input
                                    id={`amount_${index}`}
                                    className="form-control"
                                    value={categoryAmounts[index]}
                                    name={`amount_${index}`}
                                    readOnly
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </fieldset>
                    )}

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
                </div>
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
              {loading ? <Spinner /> : "Generate Bill"}
            </button>
          </div>
        </form>
      )}

      {/* billingTypes 2 */}
      {billingTypes == 2 && (
        <form onSubmit={submitNonPropertyHandler} className=" ">
          <div className="space-y-1">
            <div className=" pb-6">
              <div className=" grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="col-span-6">
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
                      options={transformedAllCustomerData}
                      
                      onChange={handleCustomerChange}
                    />
                  </div>
                </div>{" "}
              </div>
              {fields.map((field, idx) => {
                return (
                  <>
                    <hr className="font-black mt-5" />
                    <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="sm:col-span-3 ">
                        <label
                          htmlFor="city"
                          className="block text-lg font-medium leading-6 text-gray-900"
                        >
                          Frequency
                        </label>
                        <div className="mt-2">
                          <Select
                            className="basic-single"
                            classNamePrefix="select"
                            defaultValue="Select Business Type"
                            name="frequency"
                            options={transformedfrequency}
                            onChange={(selectedOption) => {
                              handleFrequencyChange(selectedOption, idx);
                            }}
                          />
                        </div>
                      </div>

                      <div className="col-span-3 ">
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
                            onChange={(selectedOption) =>
                              handleAgencyChange(selectedOption, idx)
                            }
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3 ">
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
                      
                      <div className="sm:col-span-3 ">
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
                            // value={selectedProperty}
                            onChange={(selectedOption) =>
                              handleSizeChange(selectedOption, idx)
                            }
                          />
                        </div>
                      </div>

                      {isRevenueTypeVisible && (
                        <fieldset className="col-span-6 mt-3 ">
                        <legend title="Multiple Revenue type/code can be selected"  className="text-lg font-medium leading-6 text-gray-900">
                          Revenue Type/Code <pre className="text-xs text-black">(Multiple Revenue type/code can be selected)</pre>
                        </legend>
                        <div className="mt-2 gap-x-5 flex overflow-auto">
                          {revenueType[idx]?.types?.map((revenue) => {
                            return (
                              <div
                                key={revenue.revenueId}
                                className="form-check form-check-inline"
                              >
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name={`revenueId${idx}`}
                                  value={revenue.revenueId}
                                  checked={checkedRevenues.includes(revenue.revenueId)}
                                  onChange={(event) => {
                                    handleRevenueChange(idx, event);
                                    handleCheckedRevenueChange(revenue.revenueId);
                                  }}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`revenueId${idx}`}
                                >
                                  {revenue.revenueName}
                                </label>
                              </div>
                            );
                          })}
                        </div>

                        {categories && 
                            categories.length != 0 && 
                              categories.map((category, index) => (
                                
                          <div
                            key={index}
                            className="flex gap-3 mt-4"
                          >
                            <div className="w-50">
                              <label
                                htmlFor={`category_${index}`}
                                className="block text-lg font-medium leading-6 text-gray-900"
                              >
                                Category
                              </label>
                              <div className="mt-2">
                                <Select
                                  id={`category_${index}`}
                                  className="basic-single w-50"
                                  classNamePrefix="select"
                                  name={`category_${index}`}
                                  options={transformedRevenueCategoryOptions(index)}
                                  onChange={(selectedOption) => {
                                    handleCategoryChange(selectedOption, index);
                                  }}
                                />
                              </div>
                            </div>
                            {isAmountVisible && (
                              <div className="w-50">
                                <label
                                  htmlFor={`amount_${index}`}
                                  className="block text-lg font-medium leading-6 text-gray-900"
                                >
                                  Amount
                                </label>
                                <div className="mt-2">
                                  <input
                                    id={`amount_${index}`}
                                    className="form-control"
                                    value={categoryAmounts[index]}
                                    name={`amount_${index}`}
                                    readOnly
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </fieldset>
                      )}
                     
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
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="submit"
              className="rounded-md bg-blue-900 px-3 py-2 text-sm font-semibold text-white shadow-sm"
            >
              {loading ? <Spinner /> : "Generate Bill"}
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default Billings;