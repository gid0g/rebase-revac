import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import api from "../../../axios/custom";
import { Button } from "react-bootstrap";
import logo from "../../../assets/images/Logo.png";
import { useReactToPrint } from "react-to-print";

const ManifestSlip = () => {
  const token = sessionStorage.getItem("myToken");
  const [manifestData, setManifestData] = useState([]);
  const organisationId = sessionStorage.getItem("organisationId");
  const { id } = useParams();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "RevAc-manifest-slip",
    // onAfterPrint: () => alert("Print Success"),
  });

  useEffect(() => {
    api
      .get(`enumeration/${organisationId}/manifest/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // setTableLoading(false);
        setManifestData(response.data);
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
        <li className="breadcrumb-item">Enumeration</li>
        <li className="breadcrumb-item active">Manifest Slip</li>
      </ol>
      <h1 className="page-header mb-3">Manifest Slip</h1>
      <hr />{" "}
      <div>
        {manifestData.map((manifest, idx) => {
          const originalDate = manifest.dateIssued
          const parsedDate = new Date(originalDate);

          const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          };

          const formattedDate = parsedDate.toLocaleString("en-US", options);
          return (
            <>
              <div key={idx} ref={componentRef} style={{ width: "100%" }}>
                <div className="container border p-3">
                  <header className="header flex justify-between">
                    <img className="w-1/12" src={logo} alt="RevAc" />
                    <h2>{manifest.organisationName}</h2>
                    <img alt="organisation" />
                  </header>
                  <hr />
                  <div>
                    <main className="">
                      <div className="d-flex">
                        <section className="d-flex w-4/5 border-r-2">
                          <section className="w-2/4">
                            <p className="font-extrabold">Enumeration Id: </p>
                            <p className="font-extrabold">
                              Surname: <span>{manifest.lastName}</span>{" "}
                            </p>
                            <p className="font-extrabold">
                              Middle Name: <span> {manifest.middleName}</span>
                            </p>
                            <p className="font-extrabold">
                              First Name: <span>{manifest.firstName}</span>
                            </p>
                            <p className="font-extrabold">Gender: </p>
                          </section>
                          <section className="">
                            <p className="font-extrabold">
                              Contact Address:
                              <span> {manifest.customerAddress}</span>
                            </p>
                            <p className="font-extrabold">
                              Property Address:
                              <span> {manifest.propertyAddress}</span>
                            </p>
                            <p className="font-extrabold">
                              {" "}
                              {manifest.businessprofile.map(
                                (businesstype, idx) => {
                                  return (
                                    <>
                                      Business Type:
                                      <span> {businesstype.businessType}</span>
                                    </>
                                  );
                                }
                              )}
                            </p>
                          </section>
                        </section>
                        <section>
                          <img alt="customer" />
                        </section>
                      </div>
                    </main>
                    <aside></aside>
                  </div>
                  <hr />
                  <span className="date">Issued Date : {formattedDate}</span>
                  <hr />
                </div>
              </div>
              <div className="d-flex mt-3 justify-end">
                <Button className="" variant="primary" onClick={handlePrint}>
                  Print Slip
                </Button>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
};

export default ManifestSlip;
