import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import api, { apis, attachment } from "../../../axios/custom";
import { Spinner } from "react-activity";
import "react-activity/dist/library.css";
import { AppSettings } from "../../../config/app-settings";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bootstrap from  'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap JavaScript
import { stubFalse } from "lodash";


// import ReactCrop, {Crop} from "react-image-crop";
// import "react-image-crop/dist/ReactCrop.css";


const ViewOrganisation = () => {
  const[Agent, verified]=useState(false)
 const appSettings = useContext(AppSettings);
 const userData = appSettings.userData;
 // const [crop, setCrop] = useState(Crop)
 const { id } = useParams();
 const [loading, setLoading] = useState(false);
 const [organisationID, setOrganisationId]= useState()
 const [organisationModule, setOrganisationModule]= useState([])


 const [organisationData, setOrganisationData] = useState([]);
 const [logo, setLogo] = useState(null);
 const [backgroundImage, setBackgroundImage] = useState(null);
 const token = sessionStorage.getItem("myToken");
 const [logoName, setLogoName] = useState("");
 const [backgroundName, setBackgroundName] = useState("");
 const [organisationName, setOrganisationName] = useState(".");
 const [email, setEmail] = useState(".");
 const [address, setAddress] = useState(".");
 const [phone, setPhone] = useState(".");
 const [validateForm, setValidateForm] = useState(true);

const[recheck,isRecheck]=useState(false)
 const [tokenone,uptoken]=useState("");
 const location = useLocation();
 const [moduleData, setModuleData] = useState([]);
 const [selectedModules, setSelectedModules] = useState([]);
 const selectedItem = location.state?.selectedItem;
 //////////////
 const navigate = useNavigate();


 // console.log("organisationData is--", organisationData);




 const addModuleModalRef = useRef(null); // Create a ref for the addModule modal


 // Function to open the modal
 const openModal = () => {
   const addModuleModal = addModuleModalRef.current;
   if (addModuleModal) {
     const modal = new bootstrap.Modal(addModuleModal);
     modal.show();
   }
 };
////////////////


useEffect(()=>{
  submitHandler()  

},[Agent])

 const addOrganisationModules = async () => {
   setTimeout(()=>{
     console.log("selectedItem", tokenone);

   },2000)
   setLoading(true);
               console.log("request", selectedModules)
   await api
       .post(`module/${tokenone}/organisation-modules`,
           selectedModules,
           {
               headers: {
                   Authorization: `Bearer ${token}`,
               },
           })
          
       .then((response) => {
           console.log("addorganisationmodule-response", response.data)

           if (response.status === 200) {
               setLoading(false);
               console.log("addorganisationmodule", response.data)


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
           return true;
       })
       .catch((error) => {
           setLoading(false);
           if (error.message === "timeout exceeded") {
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
           }
           setLoading(false);
           console.log("error", error);
           toast.error(error.response, {
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

// Update the handleCheckboxChange function to handle the checkbox changes
const handleCheckboxChange = (event, moduleId, item, moduleName) => {
  console.log("before:", selectedModules)
  const { checked } = event.target;
  const isModuleSelected = selectedModules.some((module) => module.moduleId === moduleId);

  if (checked && !isModuleSelected) {
    setSelectedModules((prevSelectedModules) => [
      ...prevSelectedModules,
      {
        moduleId,
        status: 1,
        dateCreated: new Date().toISOString(),
        createdBy: userData[0].email,
      },
    ]);

    setOrganisationModule((prevOrganisationModule) => [
      ...prevOrganisationModule,
      { moduleId, modules: { moduleName } },
    ]);
  } else if (!checked && isModuleSelected) {
    setSelectedModules((prevSelectedModules) =>
      prevSelectedModules.filter((module) => module.moduleId !== moduleId)
    );

    setOrganisationModule((prevOrganisationModule) =>
      prevOrganisationModule.filter(
        (module) => module.modules && module.modules.moduleName !== moduleName
      )
    );
  }
};
//api to get all modules
useEffect(() => {
setLoading(true);
api
   .get(`module`, {
       headers: {
           Authorization: `Bearer ${token}`,
       },
   })
   .then((response) => {
       if (response.status === 200) {
           setLoading(false);
           setModuleData(response.data);
           console.log("this is it:",response.data)
       }
   })
   .catch((error) => {
       console.log(error);
   });
}, []);

useEffect(()=>{
  organisationModule.map((item) => {
    const { moduleId } = item.modules;
    const newObj = {
      moduleId,
      status: 1,
      dateCreated: new Date().toISOString(),
      createdBy: userData[0].email,
    };
    selectedModules.push(newObj);
 })  
 console.log("selected",selectedModules )

},[recheck])
useEffect(()=>{
 setLoading(true);
  api
     .get(`module/${organisationID}/organisation-modules`, {
         headers: {
             Authorization: `Bearer ${token}`,
         },
     })
     .then((response) => {
         if (response.status === 200) {
             setLoading(false);
             if(response.data){
               setOrganisationModule(response.data)
               isRecheck(true)     
               console.log("getorganisationmodule",organisationModule )
               console.log("getorganisationmodule response",response )
               console.log("organisationID:",organisationID)
             }
          
           }
          
         setLoading(false);
         return true;
     })
     .catch((error) => {
         setLoading(false);
         if (error.message === "timeout exceeded") {
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
         }
         setLoading(false);
         console.log("error", error);
         toast.error(error.response, {
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
    
},[organisationID])


 //////////////////
 const code = {
   agencyCode: "",
   // revenueCode: "",
   url: "",
 };
 const [input, setInput] = useState(code);




 const fetchOrganisationData = async () => {
   await api
     .get(`organisation/${id}`, {
       headers: {
         Authorization: `Bearer ${token}`,
       },
     })
     .then((response) => {
       setOrganisationData(response.data);
       uptoken(response.data.organisationId)
       console.log("response data is",response.data)
       setOrganisationId(response.data.organisationId)
       const logoUrl = `data:image/png;base64,${response.data.logoData}`;
       const backgroundLogo = `data:image/png;base64,${response.data.backgroundImagesData}`;
       setLogo(logoUrl);
       setBackgroundImage(backgroundLogo);
       setLogoName(response.data.logoName);
       setBackgroundName(response.data.backgroundImagesName);
       setOrganisationName(response.data.organisationName);
       setEmail(response.data.email);
       setAddress(response.data.address);
       setPhone(response.data.phoneNo);
     })
     .catch((error) => {
       console.log(error);
     });
 };
 const handleLogoUpload = (event) => {
   const file = event.target.files[0];
   const reader = new FileReader();
   reader.onload = () => {
     setLogo(reader.result);
   };


   if (file) {
     reader.readAsDataURL(file);
   }


   setLogoName(file.name);
 };


 const handleBackgroundUpload = (event) => {
   const file = event.target.files[0];
   const reader = new FileReader();
   reader.onload = () => {
     setBackgroundImage(reader.result);
   };


   if (file) {
     reader.readAsDataURL(file);
   }
   setBackgroundName(file.name);
 };
 useEffect(() => {
   fetchOrganisationData();
 }, []);


 const handleChange = (e) => {
   const { name, value } = e.target;
   setInput({ ...input, [name]: value });
 };


 const [agencyCodeError, setAgencyCodeError] = useState("");
 const validateAgencyCode = () => {
   let error = "";


   if(!input.agencyCode){
     error = "Agency Code is required!";
   } else if(input.agencyCode.trim().length === 0){
     error ="Enter Agency Code";
   }


   return error;
 }


 const verifyAgencyCode = async (e) => {
  {e && e.preventDefault() }

   try {
     const response = await apis.post(`enumeration/${input.agencyCode}/verify-agencycode`, "", {
       headers: {
         Authorization: `Bearer ${token}`,
       },
     });
      if (response.data.status === 200) {
        verified(true)
        addOrganisationModules()
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
        return true;
     }
      if (response.data.status === 404) {
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
        return false;
     }
   } catch(error) {
     if (error.response && error.response.data && error.response.data.statusMessage) {
       toast.error(error.response.data.statusMessage, {
         position: "top-right",
         autoClose: 5000,
         hideProgressBar: true,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
         theme: "colored",
       });
     } else {
       toast.error("An error occurred while verifying the agency code.", {
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
      return false;
   }
 }
function cancelDefault(e){
  e.preventDefault();

}

 const submitHandler = async () => {
    const agencyError = validateAgencyCode();
   setAgencyCodeError(agencyError);
    if (agencyError.length === 0) {
     setLoading(true);
     const formData = new FormData();
     formData.append("countryId", 149);
     formData.append("payerId", organisationData.payerId);
     formData.append("OrganisationName", organisationData.organisationName);
     formData.append("address", organisationData.address);
     formData.append("stateId", organisationData?.stateId);
     formData.append("City", organisationData?.city);
     formData.append("lgaId", organisationData?.lgaId);
     formData.append("lcdaId", organisationData?.lcdaId);
     formData.append("phoneNo", organisationData?.phoneNo);
     formData.append("email", organisationData?.email);
     formData.append("logo", logo);
     formData.append("logoName", logoName);
     formData.append("AgencyCode", input.agencyCode);
     // formData.append("RevenueCode", code.revenueCode);
     formData.append("backgroundImage", backgroundImage);
     formData.append("backgroundImagesName", backgroundName);
     formData.append("dateCreated", new Date().toISOString());
     formData.append("ModifiedBy", userData[0]?.email);
      const isAgencyVerified = Agent;
      if (isAgencyVerified) {
       try {
         const response = await attachment.post(`organisation/${id}`, formData, {
           headers: {
             "Content-Type": "multipart/form-data",
             Authorization: `Bearer ${token}`,
           },
         });
          if (response.status === 200) {
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
         }
          await apis.post(`organisation/approve-onboarding-request/${id}/agency/${input.agencyCode}`, "", {
           headers: {
             Authorization: `Bearer ${token}`,
           },
         });
          toast.success("Onboarding request approved successfully.", {
           position: "top-right",
           autoClose: 5000,
           hideProgressBar: true,
           closeOnClick: true,
           pauseOnHover: true,
           draggable: true,
           progress: undefined,
           theme: "colored",
         });


        //  setTimeout(() => {
        //    navigate("../");
        //  }, 3000);
       } catch (error) {
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
         } else {
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
         }
       }
     }
     setLoading(false);
   }
 };

 const isButtonDisabled = input.agencyCode.length !== 7;

 return (
   <>
     <ol className="breadcrumb float-xl-end">
       <li className="breadcrumb-item">
         <Link to="/dashboard">Home</Link>
       </li>
       <li className="breadcrumb-item">Administration</li>
       <li className="breadcrumb-item active">Organisations </li>
     </ol>
     <h1 className="page-header mb-3">
       View Details for {organisationData.organisationName}
     </h1>
     <hr />


     <form onSubmit={cancelDefault} className="shadow-lg p-3">
       <div className="space-y-12">
         <div className="border-b border-gray-900/10 pb-12">
           <h2 className="text-base font-semibold leading-7 text-gray-900">
             Personal Information
           </h2>
           <ToastContainer />


           <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
             <div className="col-span-3">
               <label
                 htmlFor="last-name"
                 className="block text-sm font-medium leading-6 text-gray-900"
               >
                 Organisation Name
               </label>
               <div className="mt-2">
                 <input
                   type="text"
                   placeholder="Enter Organization Name"
                   value={organisationName}
                   name="organisationName"
                   disabled
                   className="px-1.5 block w-full rounded-md border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                 />
               </div>
             </div>
             <div className="col-span-3">
               <label
                 htmlFor="email"
                 className="block text-sm font-medium leading-6 text-gray-900"
               >
                 Email address
               </label>
               <div className="mt-2">
                 <input
                   placeholder="Enter Email Address"
                   value={email}
                   name="email"
                   disabled
                   type="email"
                   className="px-1.5 block w-full rounded-md border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                 />
               </div>
             </div>
             <div className="col-span-3">
               <label
                 htmlFor="email"
                 className="block text-sm font-medium leading-6 text-gray-900"
               >
                 Address
               </label>
               <div className="mt-2">
                 <input
                   placeholder="Enter Corporate Address"
                   value={address}
                   disabled
                   name="address"
                   className="px-1.5 block w-full rounded-md border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                 />
               </div>
             </div>
             <div className="col-span-3">
               <label
                 htmlFor="email"
                 className="block text-sm font-medium leading-6 text-gray-900"
               >
                 Phone Number
               </label>
               <div className="mt-2">
                 <input
                   type="tel"
                   placeholder="Enter Phone Number"
                   value={phone}
                   disabled
                   name="phoneNo"
                   className="px-1.5 block w-full rounded-md border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                 />
               </div>
             </div>
             <div className="col-span-4">
               <label
                 htmlFor="first-name"
                 className="block text-sm font-medium leading-6 text-gray-900"
               >
                 Organisation URL
               </label>
               <div className="mt-2">
                 <input
                   type="text"
                   placeholder="Enter URL"
                   value={input.url}
                   name="url"
                   onChange={handleChange}
                   className=" px-1.5 block w-full rounded-md border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                 />
               </div>
             </div>
             <div className="col-span-3">
               <label
                 htmlFor="email"
                 className="block text-sm font-medium leading-6 text-gray-900"
               >
                 Agency Code
               </label>
               <div className="mt-2">
                 <input
                   type="tel"
                   placeholder="Enter Agency Code"
                   value={input.agencyCode}
                   onChange={handleChange}
                   name="agencyCode"
                   className="px-1.5 block w-full rounded-md border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                 />
                 {agencyCodeError.length > 0 && <p className="text-red-400 text-sm">{agencyCodeError}</p>}
               </div>
             </div>
           </div>
         </div>
         <div className="border-b border-gray-900/10 pb-12">
           <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
             <div className="col-span-full">
               <label
                 htmlFor="cover-photo"
                 className="block text-sm font-medium leading-6 text-gray-900"
               >
                 Logo
               </label>
               <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                 <div className="text-center">
                   <div className="mt-4 flex text-sm leading-6 text-gray-600">
                     <label
                       htmlFor="file-upload"
                       className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none  hover:text-indigo-500"
                     >
                       {organisationData && (
                         <img src={logo} alt="Logo Image" />
                       )}


                       <input
                         id="file"
                         accept="image/*"
                         type="file"
                         className=""
                         onChange={handleLogoUpload}
                       />
                     </label>
                   </div>
                   <p className="text-xs leading-5 text-gray-600">
                     PNG, JPG, GIF up to 1MB
                   </p>
                 </div>
               </div>
             </div>
             <div className="col-span-full">
               <label
                 htmlFor="cover-photo"
                 className="block text-sm font-medium leading-6 text-gray-900"
               >
                 Background Image
               </label>


               <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                 <div className="text-center">
                   <div className="mt-4 flex text-sm leading-6 text-gray-600">
                     <label
                       htmlFor="file-upload"
                       className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none  hover:text-indigo-500"
                     >
                       {organisationData && (
                         <img src={backgroundImage} alt="Background Image" />
                       )}


                       <input
                         id="file"
                         accept="image/*"
                         onChange={handleBackgroundUpload}
                         type="file"
                       />
                     </label>
                   </div>
                   <p className="text-xs leading-5 text-gray-600">
                     PNG, JPG, GIF up to 1MB
                   </p>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>


       <div className="mt-6 flex items-center justify-end gap-x-6">
         <button
           type="submit"
           disabled={isButtonDisabled}
           data-bs-toggle="modal"
           data-bs-target="#addModule"
           className="rounded-md btn btn-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
         >
           {loading ? <Spinner /> : "Update Organisation and Approve"}
         </button>
       </div>
       <button
       style={{ marginTop: "-35px" }}
       className="btn shadow-md bg-blue-900 text-white"
       type="button"
       onClick={() => window.history.back()}
     >
       Back
     </button>    
     </form>
     <div className="modal fade" id="addModule">
     <div className="modal-dialog modal-xl">
                   <div className="modal-content">
                       <div className="modal-header">
                           <h4 className="modal-title">Add Module To Organisation</h4>
                           <button
                               type="button"
                               className="btn-close "
                               data-bs-dismiss="modal"
                               aria-hidden="true"
                           ></button>
                       </div>
                       <div className="modal-body">
                           <ToastContainer
                               autoClose={1000} />
                           <div className="  ">
                               <div className=" p-2 ">
                                   <form onSubmit={verifyAgencyCode}>
                                       <div className="row gx-5">
                                           <div className="table-responsive">
                                               <table className="">
                                                   <thead>
                                                       <tr>
                                                           <th className="font-bold"></th>
                                                           <th className="font-bold">S/N</th>
                                                           <th className="font-bold">Module Name</th>
                                                       </tr>
                                                   </thead>
                                                   <tbody>
{moduleData.map((item, idx) => {
  const isModuleSelected = selectedModules.some((module) => module.moduleId === item.moduleId);
  const isChecked =
    organisationModule &&
    organisationModule.some(
      (module) => module.modules && module.modules.moduleName === item.moduleName
    );

  return (
    <tr key={item.moduleId}>
      <td className="font-medium">
        <input
          type="checkbox"
          checked={isChecked || isModuleSelected}
          onChange={(event) => handleCheckboxChange(event, item.moduleId, item, item.moduleName)}
        />
      </td>
      <td className="font-medium">{idx + 1}</td>
      <td className="font-medium">{item.moduleName}</td>
    </tr>
  );
})}
                                                   </tbody>
                                               </table>
                                           </div>
                                       </div>


                                       <div className="d-flex justify-content-end gap-x-10">
                                           <button
                                               type="submit"
                                               // aria-hidden="true"
                                               className="btn shadow-md bg-blue-900 text-white"
                                           >
                                               {loading ? <Spinner /> : "Save /Approve"}
                                           </button>
                                       </div>
                                   </form>
                               </div>


                           </div>
                       </div>
                   </div>
               </div>
           </div>
   </>
 );
};


export default ViewOrganisation;


