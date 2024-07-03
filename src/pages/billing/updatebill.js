import React, {useState, useEffect, useContext} from 'react'
import { Link, useLocation} from "react-router-dom";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from '../../axios/custom';
import { AppSettings } from '../../config/app-settings';

const Updatebill = () => {
    const token = sessionStorage.getItem("myToken");
    const organisationId = sessionStorage.getItem("organisationId");
    const appSettings = useContext(AppSettings);
    const userData = appSettings.userData;
    const location = useLocation();
    const [billData, setBillData] = useState([]);
    const [customerid, setCustomerid] = useState();
    const [sections, setSections] = useState([]);
    const selectedItem = location.state?.selectedItem;

    console.log("selectedItem--", selectedItem.harmonizedBillReferenceNo);
    const harmonisedBill = selectedItem.harmonizedBillReferenceNo
    
    const addSection = () => {
      const newSection = {
        id: sections.length + 1, 
      };
      setSections([...sections, newSection]);
    };

    const removeSection = (sectionIdToRemove) => {
      const updatedSections = sections.filter((section) => section.id !== sectionIdToRemove);
      setSections(updatedSections);
    }

    const handleUpdateBill = async () => {
      try {
        const updateBillDto = sections.map((section) => ({
          billId: section.billId,
          agencyId: section.agencyId,
          revenueId: section.revenueId,
          billAmount: section.billAmount,
          category: section.category,
          businessTypeId: section.businessTypeId,
          businessSizeId: section.businessSizeId,
          appliedDate: section.appliedDate,
          dateModified: new Date().toISOString(),
          modifiedBy: userData[0]?.email,
        }));
  
        const response = await api.post(
          `billing/${organisationId}/property/${billData[0]?.property.propertyId}/customer/${customerid}/update-bill`,
          updateBillDto,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response.status === 200) {
          toast.success('Bill updated successfully', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
        }
      } catch (error) {
        toast.error('Failed to update bill', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      }
    };
    
    

      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await api.get(`billing/${organisationId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setCustomerid(response.data[0].customers.customerId);
            console.log("customerid--",customerid)
          } catch (error) {
            console.error(error);
          }
        };
      
        fetchData();
      }, [organisationId, token]);
      
    
      useEffect(() => {
        api
          .get(`billing/${organisationId}/bill/customer/${customerid}/harmonized/${harmonisedBill}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            console.log("API response for billData:", response);
            setBillData(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }, [token, organisationId, customerid, harmonisedBill]);
      
      console.log(billData)
      return (
      <>
        <ol className="breadcrumb float-xl-end">
            <li className="breadcrumb-item">
              <Link to="/dashboard">Home</Link>
            </li>
            <li className="breadcrumb-item">Billing List</li>
            <li className="breadcrumb-item active">Update Bill </li>
        </ol>
        
        <h1 className="page-header mb-3">Update Bill</h1>
        
        <hr />
        <form className=" ">
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
                      isDisabled={true} 
                      value={{
                        value: billData[0]?.property.buildingName
                        || 'defaultValue',
                        label: billData[0]?.property.buildingName
                        || 'Default Label'
                      }}                            
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
                      isDisabled={true} 
                      value={{
                        value: billData[0]?.customers.fullName
                        || 'defaultValue',
                        label: billData[0]?.customers.fullName
                        || 'Default Label'
                      }}                            
              />
                  </div>
                </div>
              </div>
            </div>
            <hr className="font-black mt-5" />
            {billData.map((bill, outerIndex) => (
              <div className="mt-3 " key={outerIndex}>
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
                          isDisabled={true} 
                          value={{ value: bill.businessType.businessTypeName, label: bill.businessType.businessTypeName }}                    
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
                          isDisabled={true} 
                          value={{ value: 'Something', label: 'Something' }}                    
                        />
                    
                    </div>
                  </div>
                </div>
                <fieldset className="col-span-6 mt-3 ">
                <legend className="text-lg font-medium leading-6 text-gray-900">
                    Revenue Type/Code
                  </legend>
                    <div className="mt-2 gap-x-5 flex overflow-auto">
                      <div
                        className="form-check form-check-inline"
                      >
                        <input
                          className="form-check-input "
                          type="radio"
                          isDisabled={true}
                          value={bill.revenues.revenueId}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="checkbox1"
                        >
                          {bill.revenues.revenueName}
                        </label>
                      </div>
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
                        isDisabled={true} 
                        value={{
                          value: bill.agencies.agencyName || 'defaultValue',
                          label: bill.agencies.agencyName || 'Default Label'
                        }}                            
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
                        value={{
                          value: bill.category || 'defaultValue',
                          label: bill.category || 'Default Label'
                        }}                            
                        />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <div className="w-50 ">
                    <label
                      htmlFor="category"
                      className="block text-lg font-medium leading-6 text-gray-900"
                    >
                      Applied Date
                    </label>
                    <div className="mt-2 ">
                      <div className="">
                        <input
                          style={{ backgroundColor: '#f2f2f2', pointerEvents: 'none' }}
                          className="form-control"
                          name="amount"
                          readOnly 
                          value={bill.appliedDate || 'default-value'}                           
                          isDisabled={true} 
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-3 ">
                    <label
                      htmlFor="city"
                      className="block text-lg font-medium leading-6 text-gray-900"
                    >
                      Amount
                    </label>
                    <div className="mt-2">
                      <div className="">
                      <input
                        style={{ backgroundColor: '#f2f2f2', pointerEvents: 'none' }}
                        className="form-control"
                        name="amount"
                        readOnly 
                        value={bill.billAmount || 'default-value'}                           
                         isDisabled={true} 
                      />
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="font-black mt-5" /> 

              </div>        
               ))}
          </div>
          {sections.map((section, index) => (
              <div className="mt-3 " key={section.id}>
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
                          value={{ value: billData[0]?.businessType.businessTypeName, label:  billData[0]?.businessType.businessTypeName }}    
                          isDisabled={true}                
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
                          isDisabled={true}
                          value={{ value: 'Something', label: 'Something' }}                    
                        />
                    
                    </div>
                  </div>
                </div>
                <fieldset className="col-span-6 mt-3 ">
                  <legend className="text-lg font-medium leading-6 text-gray-900">
                    Revenue Type/Code
                  </legend>
                    <div className="mt-2 gap-x-5 flex overflow-auto">
                      <div
                        className="form-check form-check-inline"
                      >
                        <input
                          className="form-check-input "
                          type="radio"
                          // value={revenue.revenueId}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="checkbox1"
                        >
                          {/* {revenue.revenueName} */}
                        </label>
                      </div>
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
                        isDisabled={true} 
                        value={{
                          value: billData[0].agencies.agencyName || 'defaultValue',
                          label: billData[0].agencies.agencyName || 'Default Label'
                        }}                            
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
                        // value={{
                        //   value: bill.category || 'defaultValue',
                        //   label: bill.category || 'Default Label'
                        // }}                            
                        />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <div className="w-50 ">
                    <label
                      htmlFor="category"
                      className="block text-lg font-medium leading-6 text-gray-900"
                    >
                      Applied Date
                    </label>
                    <div className="mt-2 ">
                      <div className="">
                        <input
                          style={{ backgroundColor: '#f2f2f2', pointerEvents: 'none' }}
                          className="form-control"
                          name="amount"
                          readOnly 
                          value={billData[0]?.appliedDate || 'default-value'}                           
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-3 ">
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
                      />
                      </div>
                    </div>
                  </div>
                </div>
                <button className='btn btn-danger mt-2' onClick={(event) => { event.preventDefault(); removeSection(section.id); }}>Delete</button>
                <hr className="font-black mt-5" /> 

              </div>        

                ))}
        </form>
        <div className="mr-2">
                <button
                  type="button"
                  onClick={addSection}
                  className="btn btn-default mt-1"
                >
                  Add More Bills
                </button>
              </div>
          <div className=" items-center	mt-5 gap-3 flex flex-row-reverse">
            <div className="">
              <button className="btn bg-primary text-white rounded-0 " 
                  onClick={handleUpdateBill}
                >
                  Update Bill
              </button>
            </div>
          </div>

      </>
    )
}

export default Updatebill;
