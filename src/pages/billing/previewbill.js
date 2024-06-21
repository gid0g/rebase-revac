import React, {
    useState,
    useEffect,
    useContext,
    CSSProperties,
    useRef,
  } from "react";
  import { Link, useLocation, useNavigate } from "react-router-dom";
  import api from "../../axios/custom";
  import { AppSettings } from "../../config/app-settings";
  // import { ToastContainer, toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  import "react-date-range/dist/styles.css";
  import "react-date-range/dist/theme/default.css";
  import ReactToPrint from "react-to-print";
  import ClipLoader from "react-spinners/ClipLoader";



  //override for page spinner
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "black",
  };
  
  const PreviewBill = () => {
    const navigate = useNavigate();
    const imageWidth = 150; // Desired width in pixels
    const imageHeight = 50; // Desired height in pixels
    const token = sessionStorage.getItem("myToken");
    const organisationId = sessionStorage.getItem("organisationId");
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    console.log("data---", data);
    let [color, setColor] = useState("#ffffff");
    const appSettings = useContext(AppSettings);
    const userData = appSettings.userData;
    const selectedItem = location?.state?.previewData;
    const customerId = location?.state?.customerId;
    const billId = location?.state?.billId;

    let totalPrice = 0;
    for (let i = 0; i < data?.length; i++) {
      totalPrice += data[i]?.balance;
    }
    let componentRef = useRef();

    console.log("Selected Item:", selectedItem);
    console.log("Customer Id:", customerId);
    
    const harmonisedBill = selectedItem?.data;
    console.log("harmonisedBill:", harmonisedBill);

    const fetchBillValues = async () => {
        await api
          .get(
            `billing/${organisationId}/bill/${selectedItem?.data}/generate-bill`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            console.log("fetchBillValuesResponse", response);
            setLoading(false);
            setData(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      };

      const checkHarmonizedBill = () => {
        if(Array.isArray(harmonisedBill)) {
          return billId;
        } else {
          return harmonisedBill;
        }
      }
  
      const fetchPreviewHarmonizedBill = async () => {
        console.log("BillId:", billId);
        await api.get(
          `/billing/${organisationId}/bill/customer/${customerId}/harmonized/${checkHarmonizedBill()}`,
           {
             headers: {
               Authorization: `Bearer ${token}`,
             },
           }
         )
         .then((response) => {
           console.log("fetchPreviewHarmonizedBillResponse", response.data);
           setData(response.data);
         })
         .catch((error) => {
           console.log(error);
         }).finally(() => {
          setLoading(false);
         });

      };
  
    const determineDataAndFetch = async () => {
      if (typeof selectedItem?.data == 'number') {
        navigate("/home/billing/viewbill", {
          state: { 
            selectedItem: selectedItem?.data
          },
        });
      } else {
        await fetchPreviewHarmonizedBill();
      }
    };

  
    useEffect(() => {
      determineDataAndFetch();
    }, [])
    
    const handlePreview = (e, billToBeViewed) => {
      e.preventDefault();

      navigate("/home/billing/viewbill", {
        state: { selectedItem: billToBeViewed },
      });
    }


    const consolidateBills = (bills) => {
      const consolidatedData = new Map();
    
      bills?.forEach((bill) => {
        const identifier = JSON.stringify({
          property: bill?.property,
          customers: bill?.customers,
          agencies: bill?.agencies,
          category: bill?.category,
        });

    
        if (consolidatedData.has(identifier)) {
          const existing = consolidatedData.get(identifier);
          existing.billAmount += bill?.billAmount;
          existing.revenues.push(bill?.revenues?.revenueName);
          existing.categories.push(bill?.category);
          consolidatedData.set(identifier, existing);
        } else {
          consolidatedData.set(identifier, {
            ...bill,
            revenues: [bill?.revenues?.revenueName],
            categories: [bill?.category],
          });
        }
      });
    
      const consolidatedValues = Array.from(consolidatedData.values()).map(
        (item) => {
          return {
            ...item,
            revenues: item?.revenues.join(', '),
            categories: item?.categories.join(', '),
          };
        }
      );
    
      return consolidatedValues;
    };
    
    
    const consolidatedBills = consolidateBills(data);
    console.log("Consolidated Bills:", consolidatedBills); 
    console.log("Consolidated Data:", data); 

      
    return (
      <>
        <ol className="breadcrumb float-xl-end">
          <li className="breadcrumb-item">
            <Link to="/dashboard">Home</Link>
          </li>
          <li className="breadcrumb-item">Billing</li>
          <li className="breadcrumb-item active">Bill Preview</li>
        </ol>
  
        <h1 className="page-header mb-3">Bill Preview Details</h1>
        <hr />
  
        {loading && (
          <ClipLoader
            color={color}
            loading={loading}
            cssOverride={override}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        )}

        <section className="flex flex-col justify-start items-start gap-8">
          <div className="flex flex-col">
            <h4 className="text-lg text-black font-bold">View Bills</h4>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {consolidatedBills.length > 0 ?
                consolidatedBills.map((item, i) => (
                <div key={i} className="rounded-md shadow-md shadow-[rgba(0,0,0,0.2)] bg-white py-3 px-2">
                    
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center gap-8 border-b-[1px] border-gray-500 p-2">
                      <h5 className="text-sm text-gray-500 font-medium">HarmonizedBill ReferenceNo</h5>
                      <h5 className="text-sm text-black font-semibold">{item?.harmonizedBillReferenceNo}</h5>
                    </div>


                    <div className="flex justify-between items-center gap-8 border-b-[1px] border-gray-500 p-2">
                      <h5 className="text-sm text-gray-500 font-medium">Property</h5>
                      <h5 className="text-sm text-black font-semibold">{item?.customers?.corporateName}</h5>
                    </div>

                    <div className="flex justify-between items-center gap-8 border-b-[1px] border-gray-500 p-2">
                      <h5 className="text-sm text-gray-500 font-medium">Customer's Name</h5>
                      <h5 className="text-sm text-black font-semibold">{item?.customers?.fullName}</h5>
                    </div>


                    <div className="flex justify-between items-center gap-8 border-b-[1px] border-gray-500 p-2">
                      <h5 className="text-sm text-gray-500 font-medium">Agency Area</h5>
                      <h5 className="text-sm text-black font-semibold">{item?.agencies.agencyName}</h5>
                    </div>

                    <div className="flex justify-between items-center gap-8 border-b-[1px] border-gray-500 p-2">
                      <h5 className="text-sm text-gray-500 font-medium">Revenue(s)</h5>
                      <h5 className="text-sm text-black font-semibold">{item?.revenues}</h5>
                    </div>


                    <div className="flex justify-between items-center gap-8 border-b-[1px] border-gray-500 p-2">
                      <h5 className="text-sm text-gray-500 font-medium">Category(s)</h5>
                      <h5 className="text-sm text-black font-semibold">{item?.categories}</h5>
                    </div>

                    <div className="flex justify-between items-center gap-8 border-b-[1px] border-gray-500 p-2">
                      <h5 className="text-sm text-gray-500 font-medium">Amount</h5>
                      <h5 className="text-sm text-black font-semibold">{item?.billAmount}</h5>
                    </div>
                  </div>

                  <div className="flex justify-between items-center gap-8 mt-8">
                    <div className="flex-1">
                      <button className="w-full flex justify-center items-center gap-4 btn bg-black text-white rounded-md" onClick={(e) => handlePreview(e, item)}>
                        <i class="fa-solid fa-book mr-3"></i> 
                        <span className="text-white">View Bill</span>
                      </button>
                    </div>
                    <div className="flex-1">
                      <button className="w-full flex justify-center items-center gap-4 btn bg-primary text-white rounded-md">
                        <i className="fa-solid fa-external-link-square-alt mr-3"></i> 
                        <span className="text-white">Upgrade Bill</span>
                      </button>
                    </div>
                  </div>
                </div>
                  
              )) : 
              <div className="flex flex-col justify-center items-center py-6">
                <h4 className="text-center text-black font-bold">No Bill Found!</h4>
              </div>
              
            }
          </div>

        </section>
  
      </>
    );
  };
  
  export default PreviewBill;
  


  