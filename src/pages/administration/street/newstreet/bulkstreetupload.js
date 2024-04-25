import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import XLSX from "xlsx";
import DataTable from "react-data-table-component";
import api from "../../../../axios/custom";
import { Spinner } from "react-activity";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
// import samplefile from "../../../billing/samplefile/Sample Template.csv";
import samplefile from "../samplefile/Sample Template.xlsx";
import { Context } from "../../../enumeration/enumerationContext.js";

const BulkStreet = () => {
  const token = sessionStorage.getItem("myToken");
  const organisationId = sessionStorage.getItem("organisationId");
  const [excelData, setExcelData] = useState([]);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isStreetLoading, setIsStreetLoading] = useState(false);
  const [agencyId, setAgencyId] = useState(""); // Added agencyId state

  const { agencies, setAgencyOption, setAgencyName } = useContext(Context);

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

          tempExcelData.push(...jsonData);

          if (i === files.length - 1) {
            setExcelData(tempExcelData);
            setFilesToUpload(Array.from(files));

            const generatedColumns =
              tempExcelData.length > 0
                ? Object.keys(tempExcelData[0]).map((header) => ({
                    name: header,
                    selector: header,
                  }))
                : [];

            setColumns(generatedColumns);
          }
        };

        reader.readAsArrayBuffer(file);
      }
    }
  };

  const handleAgencyChange = (agencyOption) => {
    setAgencyOption(agencyOption.value);
    setAgencyName(agencyOption.label);
    setAgencyId(agencyOption.value); // Set agencyId to agencyOption.value
    console.log("customer", agencyOption);
  };

  const transformedAgencyData = agencies
    ? agencies.map((item) => ({
        label: item.agencyName,
        value: item.agencyId,
      }))
    : [];

  const handleUploadBulkStreet = async (e) => {
    e.preventDefault();

    try {
      setIsStreetLoading(true);
      const formData = new FormData();

      for (let i = 0; i < filesToUpload.length; i++) {
        formData.append(`file`, filesToUpload[i]);
      }

      await api.post(
        `enumeration/${organisationId}/agency/${agencyId}/uploadStreets`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Bulk Street upload successful", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (error) {
      toast.error("Bulk Street not successful", {
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
      setIsStreetLoading(false);
    }
  };

  const customStyles = {
    rows: {
      style: {
        minHeight: "72px",
      },
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

  return (
    <>
      <div className="mb-3 flex justify-content-between">
        <div className=" ">
          <h3 className=" mb-0">Bulk Street Upload</h3>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/home/Homepage">Home</Link>
            </li>
            <li className="breadcrumb-item">Street</li>
            <li className="breadcrumb-item">New Street</li>
            <li className="breadcrumb-item active">Bulk Street</li>
          </ol>
        </div>
      </div>
      <div className="col" style={{ width: "400px" }}>
        <div className="row">
          <div className="col-3">
            <label className="form-label" style={{ marginTop: "7px" }}>
              <h4>Agency</h4>
            </label>
          </div>
          <div className="col-9">
            <div className="mb-3">
              <Select
                className="basic-single"
                classNamePrefix="select"
                defaultValue="Select Space Identifier"
                isSearchable={true}
                name="spaceIdentifier"
                options={transformedAgencyData}
                onChange={handleAgencyChange}
              />
            </div>
          </div>
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
                multiple
              />
              Upload
            </label>
          </form>
          <div className="mt-2">
            <a href={samplefile} className="">
              Click here to download the sample template
            </a>
          </div>
        </div>
      </div>
      <div className="mt-5 shadow-md p-2">
        <div className="grid gap-3 p-1 overflow-auto">
          {excelData &&
          excelData.length > 0 &&
          columns &&
          columns.length > 0 ? (
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
      <div className="items-center	mt-5 gap-3 flex flex-row-reverse">
        <div className="">
          <button
            className="btn bg-primary text-white rounded-0"
            onClick={(e) => handleUploadBulkStreet(e)}
          >
            {isStreetLoading ? <Spinner /> : "Generate Bulk Street"}
          </button>
        </div>
        <ToastContainer />
      </div>
      <button
        style={{ marginTop: "-70px" }}
        className="btn shadow-md bg-blue-900 text-white"
        type="button"
        onClick={() => window.history.back()}
      >
        Back
      </button>
    </>
  );
};

export default BulkStreet;
