import React, {
  useState,
  useEffect,
  useContext,
  CSSProperties,
  useRef,
} from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../axios/custom";
import { AppSettings } from "../../config/app-settings";
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

const ViewBill = () => {
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
  const selectedItem = location.state?.selectedItem;
  let totalPrice = 0;
  for (let i = 0; i < data?.length; i++) {
    totalPrice += data[i]?.balance;
  }
  let componentRef = useRef();

  console.log("selectedItem", selectedItem);
  console.log("selectedItemBillId", selectedItem?.billId);

  const fetchId = (id) => {
    if(id){
      return id?.billId || id;
    } else if(id?.billId){
      return id?.billId;
    }
  }
  
  const billValues = async () => {
    await api
      .get(
        `billing/${organisationId}/bill/${fetchId(selectedItem)}/generate-bill`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("billValuesResponse", response);
        setData(response.data);
   
      })
      .catch((error) => {
        console.log(error);
      }).finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    billValues();
  }, []);

  const harmonisedBill = selectedItem?.harmonizedBillReferenceNo
  
  const originalDate = data[0]?.generatedDate;
  const parsedDate = new Date(originalDate);

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const barcode = `data:image/png;base64,${data[0]?.barCode}`;
  const organisationLogo = `data:image/png;base64,${data[0]?.organisationLogo}`;

  const formattedDate = parsedDate.toLocaleString("en-US", options);

  return (
    <>
      <ol className="breadcrumb float-xl-end">
        <li className="breadcrumb-item">
          <Link to="/dashboard">Home</Link>
        </li>
        <li className="breadcrumb-item">Payments</li>
        <li className="breadcrumb-item active">Make Payment</li>
      </ol>

      <h1 className="page-header mb-3">Payment Details</h1>
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

      {!loading && (
        <div>
          {/* button to trigger printing of target component */}
          <ReactToPrint
            trigger={() => <button className="btn btn-primary mb-8">Print this out!</button>}
            content={() => componentRef}
          />

          {/* component to be printed */}
          <div ref={(el) => (componentRef = el)}>
           
          <div className="">
            <header className="flex justify-between">
              <div>
                <img
                  src={organisationLogo}
                  alt="organisation logo"
                  width="100"
                  height="100"
                />
              </div>
              <div className="self-center text-center">
                <font size="2">
                  <b>{data[0]?.organisationName}</b> <br />
                  {data[0]?.organisationAddress} <br />
                  Phone:{data[0]?.organisationPhoneNumber}, Email:{" "}
                  {data[0]?.organisationEmail}
                </font>
              </div>
              <div>
                <img src={barcode} alt="barcode" width="100" height="100" />
              </div>
            </header>
            <hr />

            <div>
              <div className="text-base font-bold text-center">
                {/* DEMAND NOTICE FOR YEAR {data[0].year} */}
              </div>

              <div className="flex justify-between mt-[20px]">
                <font size="2" className="w-6/12">
                  Notice is hereby given to:
                  <br />
                  <br />
                  <b>
                    Customer: {data[0]?.firstName} {data[0]?.middleName}{" "}
                    {data[0]?.lastName} ,{data[0]?.payerID}
                  </b>
                  <br />
                  {/* <b>Area Office: {data[0].areaOffice}</b> */}
                  <br />
                  <b>Generated Date: {formattedDate}</b>
                  <br />
                  {/* <b>Printed Date: {data[0].printedDate}</b> */}
                  <br />
                  In respect of the property situated at:{" "}
                  {data[0]?.propertyAddress} <br />
                  {/* <b> {data[0].propertyAddress}</b> */}
                </font>
                <font size="2" className="w-6/12">
                  <b>IMPORTANT!</b>
                  <br />
                  <br />
                  <b>All enquiries are to be forwarded to:</b>
                  <br />
                  Council Treasurer - {"treasurePhone"}
                  <br />
                  Use the Links below for 'Online Payment'
                  <br />
                  <a href="#">https://lagos.vulte.ng</a>
                  <br />
                  <a href="#">https://pay.etranzactng.com/lirs</a>
                  <br />
                  Click I have Bill and Select WEBGUID ("Bill" "Reference")
                </font>
              </div>

              <br />

              <div>
                <font size="2">
                  The <b>{data[0].organisationName}</b> under the LOCAL
                  GOVERNMENT law demad payment of{" "}
                  <b> DEMAND NOTICE FOR YEAR {}</b> on the above property of the
                  approved ratein respect of the financial year under
                  consideration. The amount due for the current year and arrears
                  (if any) of the former rate is now due from you. Payment of
                  the total amount is now due and is to be made at any of the
                  designated banks not later than 7 days from the date of this
                  demand notice. If Payment is not made within <b>ONE WEEK</b>{" "}
                  of the day of this Demand Notice, legal proceedings shall be
                  taken immediately
                </font>
              </div>

              <br />
              <table className="w-full border-separate border-spacing-1 ">
                <tbody className="text-center">
                  <tr className="mx-4 pr-8 ">
                    <th className="border-solid border-2 border-dark text-center">
                      Year
                    </th>
                    <th className="border-solid border-2 border-dark text-center">
                      Bill Reference
                    </th>
                    <th colSpan="3" className="border-solid border-2 border-dark text-center">
                      Summary
                    </th>
                    <th className="border-solid border-2 border-dark text-center">
                      Arrears(₦)
                    </th>
                    <th className="border-solid border-2 border-dark text-center">
                      Credit(₦)
                    </th>
                    {/* <th className="border-solid border-2 border-dark text-center">
                      Credit(₦)
                    </th> */}
                    <th className="border-solid border-2 border-dark text-center">
                      Balance(₦)
                    </th>
                  </tr>
                  {data.map((item, idx) => {
                    return (
                      <tr key={idx} className=" ">
                        <td className="border-solid border-1 border-dark text-center">
                          {item.year}
                        </td>
                        <td className="border-solid border-1 border-dark text-center">
                          <b>{item.billReference}</b>
                        </td>
                        <td colSpan="3"className="border-solid border-1 border-dark text-center">
                          {item.summary}
                        </td>
                        <td className="border-solid border-1 border-dark text-center">
                          ₦ {item.arrears.toLocaleString("en-NG")}
                        </td>
                        <td className="border-solid border-1 border-dark text-center">
                          ₦ {item.credit.toLocaleString("en-NG")}
                        </td>
                        {/* <td className="border-solid border-1 border-dark text-center">
                          ₦ {item.credit.toLocaleString("en-NG")}
                        </td> */}
                        <td className="border-solid border-1 border-dark text-center">
                        ₦ {item.balance.toLocaleString("en-NG")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="2" className="text-left font-bold">
                      Hours of Payment : Monday - Friday 8:00 a.m. - 4:00 p.m.
                    </td>
                    <td colSpan="2" className="text-right font-bold">
                      Harmonized Bill Reference
                    </td>
                    <td className="border-solid border-2 border-dark text-center">
                      {harmonisedBill ? harmonisedBill : data?.harmonizedBillReference}
                    </td>
                    <td colSpan="2" className="text-right font-bold">
                      Total Due
                    </td>
                    <td className="border-solid border-2 border-dark text-center">
                      ₦ {totalPrice.toLocaleString("en-NG")}
                    </td>
                  </tr>
                </tfoot>
              </table>

              <br />
              <font size="2">
                Please turn over leaf for list of Banks into which paymentcan be
                made. Collect your eReceipt before leaving before leaving the
                bank or before leaving the revenue collecting agent's office.
              </font>
              <br />
              <br />
              <hr className=" border-dashed border-dark" />
              <br />

              <div className="flex">
                <div className="w-6/12 text-center border-r-2 border-dark">
                  <font size="2">
                    <b>Bank's/Agent's Copy</b> <br />
                    <b>{data[0]?.organisationName}</b> <br />
                    <b> DEMAND NOTICE FOR YEAR {2023}</b> <br />
                    <br />
                    <font size="2" className="w-6/12">
                      <b>Payer Name:</b> {data[0]?.firstName}{" "}
                      {data[0]?.middleName} {data[0]?.lastName} ,
                      {data[0]?.payerID}
                      <br />
                      <b>Payer ID:</b> {data[0]?.payerID}
                      <br />
                      <b>Address:</b> {data[0]?.propertyAddress}
                      <br />
                      <b>Area Office:</b> {data[0]?.summary}
                      <br />
                      <b>Agency Code:</b> {data[0]?.areaOffice}
                      <br />
                      <b>Total Due:</b> ₦ {totalPrice.toLocaleString("en-NG")}
                    </font>
                  </font>
                </div>
                <div className="w-6/12 text-center ">
                  <font size="2">
                    <b>Local Govt's Copy</b> <br />
                    <b>{data[0]?.organisationName}</b> <br />
                    <b> DEMAND NOTICE FOR YEAR {2023}</b> <br />
                    <br />
                    <font size="2" className="w-6/12">
                      <b>Payer Name:</b> {data[0]?.firstName}{" "}
                      {data[0]?.middleName} {data[0]?.lastName} ,
                      {data[0]?.payerID}
                      <br />
                      <b>Payer ID:</b> {data[0]?.payerID}
                      <br />
                      <b>Address:</b> {data[0]?.propertyAddress}
                      <br />
                      <b>Area Office:</b>
                      {data[0]?.summary}
                      <br />
                      <b>Agency Code:</b> {data[0]?.areaOffice}
                      <br />
                      <b>Total Due:</b> ₦ {totalPrice.toLocaleString("en-NG")}
                    </font>
                  </font>
                </div>
              </div>
              <div className="mt-[30px] flex justify-around">
                <div className="p-0">
                  <img
                    className="img-responsive"
                    src="https://drive.google.com/uc?id=1VwOBRRQ85TqqSUWwtxFoeLqZYDsCzMXK&export=download"
                    alt="lasepa signature"
                  />
                  <div className="w-full font-bold ml-[15px]">
                    Council Treasurer
                  </div>
                </div>
                <div className="p-0">
                  <img
                    className="img-responsive"
                    src="https://drive.google.com/uc?id=1VwOBRRQ85TqqSUWwtxFoeLqZYDsCzMXK&export=download"
                    alt="lasepa signature"
                  />
                  <div className="w-full font-bold ml-[15px]">
                    Revenue Chairman
                  </div>
                </div>
              </div>

              <br />

              <div>
                <div className="text-center">
                  <p>
                    All enquiries are to be forwarded to the Chairman - Revenue
                    Collection and Review Commitee
                  </p>
                  <b>
                    {" "}
                    LOST BILL WILL ATTRACT A FINE OF ₦1000, FOR REPRINTING{" "}
                  </b>
                </div>
              </div>
            </div>
          </div>
          <hr></hr>
       
          </div>
        </div>
      )}
    </>
  );
};

export default ViewBill;
