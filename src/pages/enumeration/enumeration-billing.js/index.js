import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../../axios/custom";
import Select from "react-select";
import { AppSettings } from "../../../config/app-settings";
import { Spinner } from "react-activity";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Context } from "../enumerationContext";
import { useNavigate } from "react-router-dom";

const EnumerateBilling = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("myToken");
  const [loading, setLoading] = useState(false);
  const appSettings = useContext(AppSettings);
  const userData = appSettings.userData;
  const organisationId = sessionStorage.getItem("organisationId");
  const [formValues, setFormValues] = useState([]);
  const [categories, setCategories] = useState([]);
  // const [categoryAmounts, setCategoryAmounts] = useState([]);
  const [categoryAmounts, setCategoryAmounts] = useState({});
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [revenues, setRevenues] = useState([]);
  const [businessType, setBusinessType] = useState([]);
  const [businessSize, setBusinessSize] = useState([]);
  const { agencyName, agencyOption, agencyId, existingCustomerAgencyId,setExistingCustomerFields, data, buildingName, enumerationData, existingCustomerFields, enumerateFields, loadingBusiness, submitBusinessProfile } =
    useContext(Context);
    console.log("EnumerateFields:", enumerateFields);
    console.log("agencyOption:", agencyOption);
    console.log("agencyName:", agencyName);
  const [amountType, setAmountType] = useState({
    0: {
      types: [],
    },
  });

  useEffect(() => {
    const fetchBusinessType = async () => {
      if(enumerateFields[0]?.businessTypeId) {
        const updatedFields = [...existingCustomerFields];
        updatedFields[0].businessTypeId =  enumerateFields[0]?.businessTypeId;
        setExistingCustomerFields(prevState => [
          {
            ...prevState[0], // Keep existing fields of the first object
            businessTypeId:  enumerateFields[0]?.businessTypeId , // Update appliedDate dynamically
          },
          ...prevState.slice(1) // Keep the rest of the array unchanged
        ]);
        try {
          await api.get(
            `enumeration/${organisationId}/business-types`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            console.log("Business Size:", response.data);
            setBusinessType(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
        } catch (error) {
          console.log(error);
        }
      }
    }

    fetchBusinessType();
  }, [enumerateFields[0]?.businessTypeId]);



  useEffect(() => {
    const fetchBusinessSize = async () => {
      if(enumerateFields) {
        
        const updatedFields = [...existingCustomerFields];
        updatedFields[0].businessSizeId =  enumerateFields[0]?.businessSizeId;
        setExistingCustomerFields(prevState => [
          {
            ...prevState[0], // Keep existing fields of the first object
            businessSizeId: enumerateFields[0]?.businessSizeId, // Update businessSizeId
            createdBy: `${userData[0]?.email}` // Update createdBy
          },
          ...prevState.slice(1) // Keep the rest of the array unchanged
        ]);
        try {
          api
          .get(`enumeration/${organisationId}/business-sizes`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            console.log("businesssss", response.data)
            setBusinessSize(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
        } catch(error) {
          console.log(error);
        }
      }
    }

    fetchBusinessSize();
  }, [enumerateFields[0]?.businessSizeId]);


  const removeDuplicates = (arr) => {
    if (arr?.length > 0) {
      return arr?.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
    }
    return arr;
  };


  // const originalRevenues = removeDuplicates(enumerateFields[0]?.billRevenues);
///////////////////////
const [originalRevenues, setOriginalRevenues] = useState([]);
useEffect(() => {
  const processedRevenues = enumerateFields.map((enumerate) =>
    removeDuplicates(enumerate?.billRevenues)
  );

  // Flatten the array of arrays and remove duplicates again if needed
  const flattenedRevenues = [].concat(...processedRevenues);
  const uniqueRevenues = removeDuplicates(flattenedRevenues);
  console.log("orignal", uniqueRevenues)
  setOriginalRevenues(uniqueRevenues);
}, [enumerateFields]);
//////////////////////
useEffect(()=>{
  console.log("originalRevenues", originalRevenues)
},[originalRevenues])
  useEffect(() => {
    console.log("done getting")
    const fetchCategories = async () => {
      
      if(originalRevenues?.length > 0) {
        setIsCategoriesLoading(true);

        try {
          const fetchRevenues = await fetchRevenueCategories(originalRevenues);
          setCategories(fetchRevenues);
          setIsCategoriesLoading(false);
        } catch (error) {
          console.error(error);
          setIsCategoriesLoading(false);
        }
      }
    }

    fetchCategories();
  }, [enumerateFields,businessType]);
  
  useEffect(()=>{
    console.log("Entire Category:",categories)
  },[categories])

  //To get revenues
  // useEffect(() => {
  //   const fetchRevenues = async () => {

      
      
  //     if(originalRevenues?.length > 0) {
  //       try {
  //         await api
  //           .get(
  //             `revenue/${organisationId}/business-type/${enumerateFields[0]?.businessTypeId}`,
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${token}`,
  //               },
  //             }
  //           )
  //           .then((response) => {
  //             setRevenues(response.data);
  //           })
  //           .catch((error) => {
  //             console.log(error);
  //           });
  //       } catch(error) {
  //         console.log(error);
  //       }
  //     }
  //   }

  //   fetchRevenues();
  // }, [enumerateFields[0]?.billRevenues.length]); 
  //////////////////////////////
  useEffect(() => {
    const fetchRevenues = async () => {
      const promises = enumerateFields.map((field) => {
        if (originalRevenues?.length > 0) {
          return api
            .get(
              `revenue/${organisationId}/business-type/${field.businessTypeId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((response) => response.data);
        } else {
          return [];
        }
      });
  
      Promise.all(promises).then((responses) => {
        setRevenues(responses.flat());
      }).catch((error) => {
        console.log(error);
      });
    };
  
    fetchRevenues();
  }, [enumerateFields, originalRevenues]);

  useEffect(()=>{
    console.log("got revenue", revenues)
  },[revenues])
  const fetchRevenueCategories = async (revenueIds) => {

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
  const businessTypeObj = enumerateFields.map((enumerateField) => 
    businessType?.find((item) => item?.id === enumerateField?.businessTypeId)
  );
  
  const businessSizeObj = enumerateFields.map((enumerateField) =>
    businessSize?.find((item) => item?.id === enumerateField?.businessSizeId)
  );
  
  console.log("Business Type Objects:", businessTypeObj);
  console.log("Business Type :", businessType);
  console.log("Business Size Objects:", businessSizeObj);
  console.log("Business Size :", businessSize);
  
  // const businessTypeObj = businessType?.find(
  //   (item) => item?.id === enumerateFields[0]?.businessTypeId
  // );

  // const businessSizeObj = businessSize?.find(
  //   (item) => item?.id === enumerateFields[0]?.businessSizeId);
// const [check,setcheck]=useState(false)
//   const revenueName = (revenueId) => {
//     setcheck(!check)
//     const revenue = revenues.find(revenue => revenue?.revenueId === revenueId);
//     return revenue?.revenueName;
//   }
const [revenueNames, setRevenueNames] = useState({});

const revenueName = (revenueId) => {
  console.log("revenueeeeeeeeeee", revenueId)
  if (!revenueNames[revenueId]) {
    const revenue = revenues.find(revenue => revenue?.revenueId === revenueId);
    setRevenueNames(prevRevenueNames => ({ ...prevRevenueNames, [revenueId]: revenue?.revenueName }));
  }
  return revenueNames[revenueId];
}
  // const transformedRevenueCategoryOptions = (index) => {
    
  //   const filteredCategories = categories.map(category => {
  //     const filteredData = category.filter(item => originalRevenues?.includes(item.revenueId))
  //     return {
  //       data: filteredData,
  //       };
  //       });
  //       console.log("filteredCategories", filteredCategories)
  //       // Get the filtered categories for the selected revenueId
  //       const filteredCategoriesForIndex = filteredCategories[index];
  //       console.log("filteredCategoriesForIndex", filteredCategoriesForIndex)
        
  //       // Category options
  //   const options = filteredCategoriesForIndex?.data?.map((item) => ({
  //     value: item.categoryId,
  //     label: item.categoryName,
  //     amount: item.amount,
  //     revenue: item.revenueId,
  //   }));
  
  //   return options;
  //   };
    
  const transformedRevenueCategoryOptions = (search,index) => {
    console.log("search this", index,search,originalRevenues,categories )
    const filteredCategories = categories.map(category => {
          const filteredData = category.filter(item => originalRevenues?.includes(item.revenueId))
          return {
            data: filteredData,
            };
            });

    console.log("filteredCategories", filteredCategories);

    const filteredCategoriesForIndex = filteredCategories.find(category =>
      category.data.some(item => item.revenueId === search)
    );

    console.log("filteredCategoriesForIndex", filteredCategoriesForIndex);

    const options = filteredCategoriesForIndex?.data?.map((item) => ({
      value: item.categoryId,
      label: item.categoryName,
      amount: item.amount,
      revenue: item.revenueId,
    })) || [];

    return options;
  };
  

    
    // useEffect(()=>{
    //   console.log("transformedRevenueCategoryOptions", transformedRevenueCategoryOptions)
    // },[check])
    
  // const handleCategoryChange = (selectedCategory, index) => {
  //   const updatedFields = [...existingCustomerFields];
   
  //   if(selectedCategory) {

  //     const billRevenuePrice = {
  //       revenueId: selectedCategory?.revenue,
  //       billAmount: selectedCategory?.amount,
  //       category: selectedCategory?.label
  //     }

  //     updatedFields[0].BillRevenuePrices = [
  //       ...updatedFields[0].BillRevenuePrices,
  //       billRevenuePrice,
  //     ];
      
  //     updatedFields[0].agencyId =  agencyOption ? agencyOption?.agencyId : existingCustomerAgencyId;
  //     updatedFields[0].createdBy = userData[0]?.email;
  //     console.log("Updated Fields", updatedFields);
  //     console.log("agencyOption", agencyOption);
  //     console.log("agencyId", agencyId);
  //     console.log("existingCustomerAgencyId", existingCustomerAgencyId);
    

  //     const newCategoryAmounts = [...categoryAmounts];
  //     newCategoryAmounts[index] = selectedCategory?.amount;
  //     setCategoryAmounts(newCategoryAmounts);
    
  //     setIsVisible(true);

  //   }
  // };
  const handleCategoryChange = (selectedCategory, revenueId, idx, revenueIdx) => {
    console.log("selectedCategory",selectedCategory,categoryAmounts,revenueId, idx, revenueIdx)
    if (selectedCategory) {
      setCategoryAmounts((prevCategoryAmounts) => ({
       ...prevCategoryAmounts,
        [revenueId]: selectedCategory.amount,
      }));
      console.log("Setting billrevenues")
      setExistingCustomerFields(prevState => [
        {
          ...prevState[0], // Keep existing fields of the first object
           BillRevenuePrices: [...existingCustomerFields[0].BillRevenuePrices, {
         
              revenueId: selectedCategory?.revenue,
              billAmount: selectedCategory?.amount,
              category: selectedCategory?.label
                       }
                      ], // add a new price to the array
        },
        ...prevState.slice(1) // Keep the rest of the array unchanged
      ]);
    }
  };

  useEffect(()=>{
    console.log("categoryAmounts", categoryAmounts)
  },[categoryAmounts])
  // const handleCategoryChange = (selectedCategory, index) => {
  //   if (index >= 0 && index < existingCustomerFields.length) {
  //     const updatedFields = [...existingCustomerFields];
      
  //     if (selectedCategory) {
  //       const billRevenuePrice = {
  //         revenueId: selectedCategory?.revenue,
  //         billAmount: selectedCategory?.amount,
  //         category: selectedCategory?.label,
  //       };
  
  //       if (!updatedFields[index].BillRevenuePrices) {
  //         updatedFields[index].BillRevenuePrices = [];
  //       }
  
  //       updatedFields[index].BillRevenuePrices.push(billRevenuePrice);
  
  //       updatedFields[index].agencyId = agencyOption? agencyOption?.agencyId : existingCustomerAgencyId;
  //       updatedFields[index].createdBy = userData[0]?.email;
  
  //       const newCategoryAmounts = [...categoryAmounts];
  //       newCategoryAmounts[index] = selectedCategory?.amount;
  //       setCategoryAmounts(newCategoryAmounts);
  
  //       setIsVisible(true);
  //     }
  //   }
  // };

  useEffect(()=>{
    console.log("businessTypeObj", businessTypeObj)
    console.log("businessSizeObj", businessSizeObj)
  },[businessTypeObj,businessSizeObj])
  
  useEffect(()=>{
    console.log("datas", data)
  },[data])
  
  return (
    <>
      <div className=" ">
        <h3 className=" mb-0">Billing</h3>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/home/Dashboard">Home</Link>
          </li>
          <li className="breadcrumb-item">Bill Management</li>
          <li className="breadcrumb-item active">Billing </li>
        </ol>
      </div>

      <ToastContainer />
        <form onSubmit={submitBusinessProfile} className="mt-5">
          <div className="space-y-1">
            <div className=" pb-6">
              <div className=" grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-1">
                <div className="col-span-3">
                  <p
                    htmlFor="last-name"
                    className="block text-lg font-medium leading-6 text-gray-900"
                  >
                    Property Name: {buildingName}
                  </p>
                </div>
                <div className="col-span-3">
                  <p
                    htmlFor="last-name"
                    className="block text-lg font-medium leading-6 text-gray-900"
                  >
                    Customer Details: {data?.fullName}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 ">

                {/*  */}
{/*        
                {businessType?.map((businessTypeItem, idx) => {
            const correspondingEnumerateField = enumerateFields.find(
              (field) => field?.businessTypeId === businessTypeItem.id
            );

                  if (correspondingEnumerateField) {
                    return correspondingEnumerateField.billRevenues.map((revenue, revenueIdx) => {
                      return (
                        <div key={revenueIdx} className="shadow p-4 mt-3 mb-4 d-flex w-full flex-column">
                          <div className="sm:col-span-2 ">
                            <p
                              htmlFor="city"
                              className="block text-lg font-bold leading-6 text-gray-900"
                            >
                              Business Type : <span>{businessTypeItem.businessTypeName}</span>
                            </p>
                          </div>
                          <div className="sm:col-span-2 ">
                            <p
                              htmlFor="city"
                              className="block text-lg font-bold leading-6 text-gray-900"
                            >
                              Business Size: {businessSizeObj.length!==0 && <span>{ businessSizeObj.find((item) => item.id === correspondingEnumerateField.businessSizeId)?.businessSizeName}</span>}
                            </p>
                          </div>
                          <div className="sm:col-span-2 ">
                            <p
                              htmlFor="city"
                              className="block text-lg font-bold leading-6 text-gray-900"
                            >
                              Revenue Type/Code: <span>{revenueName(revenue)}</span>
                            </p>
                          </div>
                          <div className="row mb-3">
                            {" "}
                            <div className="col-6">
                              <p
                                htmlFor="category"
                                className="block text-lg font-bold leading-6 text-gray-900"
                              >
                                Category:
                              </p>
                              <div className="mt-2 ">
                                <Select
                                  id="category"
                                  className="basic-single"
                                  classNamePrefix="select"
                                  name="category"
                                  options={transformedRevenueCategoryOptions(idx)}
                                  onChange={(event) => handleCategoryChange(event, idx)}
                                />
                              </div>
                            </div>
                          <div className="col-6">
                            <div>
                            <p
                                htmlFor="amount"
                                className="block text-lg font-bold leading-6 text-gray-900"
                                >
                                Amount:
                              </p>
                              <input
                                className="form-control"
                                name="amount"
                                value={categoryAmounts[idx]}
                                readOnly
                                />
                            </div>
                          </div>
                                </div>
                        </div>
                      );
                    });
                  } else {
                    return null;
                  }
                })} */}
                {businessType.map((businessTypeItem, idx) => {
  // Ensure businessTypeItem is defined
  if (!businessTypeItem) return null;

  const correspondingEnumerateField = enumerateFields.find(
    (field) => field?.businessTypeId === businessTypeItem.id
  );

  // Ensure correspondingEnumerateField is defined
  if (!correspondingEnumerateField) return null;

  return correspondingEnumerateField.billRevenues.map((revenue, revenueIdx) => {
    // Ensure businessSizeObj is defined
    const businessSizeObj = businessSize?.find(
      (item) => item?.id === correspondingEnumerateField.businessSizeId
    );

    return (
      <div key={revenueIdx} className="shadow p-4 mt-3 mb-4 d-flex w-full flex-column">
        <div className="sm:col-span-2 ">
          <p className="block text-lg font-bold leading-6 text-gray-900">
            Business Type: <span>{businessTypeItem.businessTypeName}</span>
          </p>
        </div>
        <div className="sm:col-span-2 ">
          <p className="block text-lg font-bold leading-6 text-gray-900">
            Business Size: {businessSizeObj && <span>{businessSizeObj.businessSizeName}</span>}
          </p>
        </div>
        <div className="sm:col-span-2 ">
          <p className="block text-lg font-bold leading-6 text-gray-900">
            Revenue Type/Code: <span>{revenueName(revenue)}</span>
          </p>
        </div>
        <div className="row mb-3">
          <div className="col-6">
            <p className="block text-lg font-bold leading-6 text-gray-900">
              Category:
            </p>
            <div className="mt-2 ">
              {/* <Select
                id="category"
                className="basic-single"
                classNamePrefix="select"
                name="category"
                options={transformedRevenueCategoryOptions(revenueIdx)}
                onChange={(event) => handleCategoryChange(event, revenueIdx)}
              /> */}
                  <Select
                  id="category"
                  className="basic-single"
                  classNamePrefix="select"
                  name="category"
                  options={transformedRevenueCategoryOptions(revenue,revenueIdx)}
                  onChange={(event) => handleCategoryChange(event, revenue, idx, revenueIdx)}
                  />  
            </div>
          </div>
          <div className="col-6">
            <div>
              <p className="block text-lg font-bold leading-6 text-gray-900">
                Amount:
              </p>
              {/* <input
                className="form-control"
                name="amount"
                value={categoryAmounts[revenueIdx]}
                readOnly
              /> */}
                  <input
                className="form-control"
                name="amount"
                value={categoryAmounts[revenue] || ''}
                readOnly
                />
            </div>
          </div>
        </div>
      </div>
    );
  });
})}

                {/*  */}

              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="submit"
              className="rounded-md bg-blue-900 px-3 py-2 text-sm font-semibold text-white shadow-sm"
            >
              {loadingBusiness ? <Spinner /> : "Generate Bill"}
            </button>
          </div>
        </form>
    </>
  );
};

export default EnumerateBilling;
