import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import XLSX from "xlsx";
import DataTable from "react-data-table-component";
import samplefile from "./samplefile/BulkBillUpload.xlsx";
import api from "../../axios/custom";
import { Spinner } from "react-activity";
import { ToastContainer, toast } from "react-toastify";
import { AppSettings } from "../../config/app-settings";
import BulkBillList from "./bulkbillList";

// import Papa from "papaparse";
// import { ExcelRenderer } from "react-excel-renderer";

const BulkBill = () => {
  const token = sessionStorage.getItem("myToken");
  const appSettings = useContext(AppSettings);
  const userData = appSettings.userData;
  const organisationId = sessionStorage.getItem("organisationId");

  const [excelData, setExcelData] = useState([]);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isBillLoading, setIsBillLoading] = useState(false);
  const [isPayerIdLoading, setIsPayerIdLoading] = useState(false);
  const [billReportData, setBillReportData] = useState([]);
  const [activeTab, setActiveTab] = useState("Successful");
  const [isUploaded, setIsUploaded] = useState(false);

  function cleanArrayObjects(arr) {
    if (!Array.isArray(arr)) {
      return arr;
    }

    const cleanedArray = arr.map((obj) => cleanObjectKeys(obj));
    return cleanedArray;
  }

  function cleanObjectKeys(obj) {
    if (typeof obj !== "object" || obj === null) {
      return obj;
    }

    const cleanedObject = {};

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const cleanedKey = key.trim();

        cleanedObject[cleanedKey] = cleanObjectKeys(obj[key]);
      }
    }

    return cleanedObject;
  }

  const handleFileInputChange = (e) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      let tempExcelData = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = (event) => {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 2 });

          const headers = jsonData[0];
          const modifiedHeaders = Object.keys(headers).map((header) => ({
            name: header,
            selector: header,
          }));

          const firstRow = Object.fromEntries(
            Object.keys(headers).map((header) => [header, headers[header]])
          );

          const modifiedData = jsonData.slice(1);
          tempExcelData = [...tempExcelData, firstRow, ...modifiedData];

          console.log("tempExcelData:", tempExcelData);

          setExcelData(tempExcelData);
          setColumns(modifiedHeaders);
        };

        reader.readAsArrayBuffer(file);
      }
    }
  };

  const handleGenerateBulkBill = async (e) => {
    e.preventDefault();

    console.log("tempExcelData:", excelData.slice(0, -1));
    console.log("space-floor:", excelData?.['"Space Floor "']);
    console.log("userData:", appSettings);

    try {
      setIsBillLoading(true);
      const formDataToSend = excelData.slice(0, -1);
      const formData = formDataToSend.map((row) => ({
        spaceIdentifier: row?.spaceIdentifier ? `${row?.spaceIdentifier}` : "",
        buildingName: row?.buildingName ? `${row?.buildingName}` : "",
        buildingNumber: row?.buildingNumber ? `${row?.buildingNumber}` : "",
        streetName: row?.streetName ? `${row?.streetName}` : "",
        spaceFloor: row?.spaceFloor ? `${row?.spaceFloor}` : "",
        // ward: row?.ward ? `${row?.ward}` : "",
        payerType: row?.payerType ? `${row?.payerType}` : "",
        payerID: row?.PayerID ? `${row?.PayerID}` : null,
        title: row?.title ? `${row?.title}` : null,
        firstName: row?.firstName ? `${row?.firstName}` : null,
        middleName: row?.middleName ? `${row?.middleName}` : null,
        lastName: row?.lastName ? `${row?.lastName}` : null,
        fullName: row?.fullName ? `${row?.fullName}` : "",
        gender: row?.gender ? `${row?.gender}` : null,
        email: row?.email ? `${row?.email}` : "",
        phoneNumber: row?.phoneNumber ? `${row?.phoneNumber}` : null,
        agency: row?.agency ? `${row?.agency}` : "",
        revenue: row?.revenue ? `${row?.revenue}` : "",
        revenueCode: row?.revenueCode ? `${row?.revenueCode}` : null,
        category: row?.category ? `${row?.category}` : "",
        businessType: row?.businessType ? `${row?.businessType}` : "",
        businessSize: row?.businessSize ? `${row?.businessSize}` : "",
        appliedDate: row.appliedDate
          ? `${row.appliedDate}`
          : `${new Date().getFullYear()}`,
        interest: row?.interest ? `${row?.interest}` : null,
        penalty: row?.penalty ? `${row?.penalty}` : null,
      }));

      console.log("FormData:", formData);

      const response = await api.post(
        `/billing/${organisationId}/${userData[0]?.email}/create-bills-previewed`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
              // "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Response---:", response?.data);
        setBillReportData(response?.data);

        toast.success("Bulk Bill upload successful:", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        setIsUploaded(true);
      
    } catch (error) {
      console.log("Bulk bill:", error.response?.data);
      toast.error("Bulk Bill not successful:", {
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
      setIsBillLoading(false);
    }
  };

  const customStyles = {
    rows: {
      style: (rowData) => ({
        minHeight: "72px",
        fontWeight: rowData.index === 0 ? "bold" : "normal",
      }),
    },
  };

  const inputStyle = {
    display: "none",
  };

  const labelStyle = {
    padding: "10px 20px",
    backgroundColor: "#348fe2",
    color: "white",
    cursor: "pointer",
    fontSize: "18px",
    width: "120px",
  };

  const successfulItems = billReportData.filter((bill) => bill.status == 200);
  const unSuccessfulItems = billReportData.filter((bill) => bill.status == 0);

  return (
    <>
      <div className="mb-3 flex justify-content-between">
        <div className=" ">
          <h3 className=" mb-0">Bulk Bill Upload</h3>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/home/Homepage">Home</Link>
            </li>
            <li className="breadcrumb-item">Billing</li>
            <li className="breadcrumb-item active">Bulk Bill</li>
          </ol>
        </div>
      </div>

      <div className="items-center mt-5 gap-3 flex flex-row">
        <div className="">
          <form>
            <label htmlFor="">
              <h3>Choose File</h3>
            </label>
            <label
              style={labelStyle}
              className="custom-file-upload ml-5 text-center"
            >
              <input
                type="file"
                accept=".xlsx"
                onChange={handleFileInputChange}
                style={inputStyle}
              />
              Upload
            </label>
          </form>
          <div className="mt-2">
            <a href={samplefile} className="">
              Click here to download sample template
            </a>
          </div>
        </div>
      </div>
      <div className="mt-5 shadow-md p-2">
        <div className="grid gap-3 p-1 overflow-auto">
          {/* Display DataTable if Excel data is available */}
          {excelData && excelData.length > 0 ? (
            <div>
              <h4>Uploaded Data</h4>
              <DataTable
                columns={columns}
                data={excelData}
                customStyles={customStyles}
                pagination
                paginationPerPage={10}
                striped
              />
            </div>
          ) : null}
        </div>
      </div>
      <div className=" items-center	mt-5 gap-3 flex flex-row-reverse">
        {/* <div className="">
            <button className="btn bg-primary text-white rounded-0">
              { isPayerIdLoading ? <Spinner/> : "Generate Bulk PayerID" }
            </button>          
          </div> */}
        <div className="">
          <button
            className="btn bg-primary text-white rounded-0"
            onClick={(e) => handleGenerateBulkBill(e)}
          >
            {isBillLoading ? <Spinner /> : "Generate Bulk Bill"}
          </button>
        </div>
        <ToastContainer />
      </div>

      <div className="w-full lg:w-[80%] lg:mx-auto flex flex-col justify-center items-center mt-16">
        {isUploaded && (
          <>
            <h4 className="font-bold text-xl lg:text-2xl my-4 text-black">
              Uploaded Bill Results
            </h4>
            <div className="w-full lg:w-[60%] lg:mx-auto  flex justify-between items-center gap-4 bg-gray-200 rounded-full p-2">
              <button
                className={`w-full rounded-full py-3 px-6 ${
                  activeTab == "Successful"
                    ? "bg-primary text-white"
                    : "bg-white text-black"
                } font-semibold shadow-md shadow-[rgba(0,0,0,0.3)]`}
                onClick={() => setActiveTab("Successful")}
              >
                Successful{" "}
                <span className="mx-2 rounded-full py-1 px-1.5 bg-green-400 text-white text-center font-semibold">
                  {successfulItems.length}
                </span>
              </button>
              <button
                className={`w-full rounded-full py-3 px-6 ${
                  activeTab == "Unsuccessful"
                    ? "bg-primary text-white"
                    : "bg-white text-black"
                } font-semibold shadow-md shadow-[rgba(0,0,0,0.3)]`}
                onClick={() => setActiveTab("Unsuccessful")}
              >
                Unsuccessful{" "}
                <span className="mx-2 rounded-full py-1 px-1.5 bg-red-500 text-white text-center font-semibold">
                  {unSuccessfulItems.length}
                </span>
              </button>
            </div>
          </>
        )}

        {billReportData.length > 0 && (
          <div className="w-full flex flex-col justify-center items-center">
            {activeTab == "Successful" ? (
              <BulkBillList data={successfulItems} />
            ) : (
              <BulkBillList data={unSuccessfulItems} />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default BulkBill;
