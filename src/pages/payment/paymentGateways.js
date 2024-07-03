import React, { useState, useEffect, useContext, CSSProperties } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../axios/custom";
import { AppSettings } from "../../config/app-settings";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import ClipLoader from "react-spinners/ClipLoader";

//override for page spinner
const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "black",
};

const PaymentGateways = () => {
    const imageWidth = 150; // Desired width in pixels
    const imageHeight = 50; // Desired height in pixels
    const token = sessionStorage.getItem("myToken");
    const organisationId = sessionStorage.getItem("organisationId");
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    let [color, setColor] = useState("#ffffff");
    const appSettings = useContext(AppSettings);
    const userData = appSettings.userData;
    const [data, setData] = useState([]);
    const [billData, setBillData] = useState([]);
    const [referenceNumber, setReferenceNumber] = useState('');
    const selectedItem = location.state?.selectedItem;
    const [payerID, setPayerID] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [agencyName, setAgencyName] = useState('');
    const [revenueName, setRevenueName] = useState('');
    const [agencyCode, setAgencyCode] = useState('');
    const [revenueCode, setRevenueCode] = useState('');

    useEffect(() => {
        if (selectedItem) {
            setReferenceNumber(selectedItem.billReferenceNo);
            viewBill(selectedItem.billReferenceNo);
        }
    }, [selectedItem]);

    const viewHarmonizedBill = async (referenceNumber) => {
        setLoading(true);
        await api
            .post(
                `billing/validate-harmonized-bill`,
                {
                    "harmonizedBillReference": referenceNumber
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                if (response.status === 200) {
                    setLoading(false);
                    setBillData(response.data.data);
                    setPayerID(response.data.data[0].payerID)
                    setTotalAmount(response.data.data[0].bulkTotalAmount)

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

    const viewBill = async (referenceNumber) => {
        setLoading(true);
        await api
            .post(
                'billing/validate-bill',
                {
                    "webGuid": referenceNumber
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                if (response.status === 200) {
                    setLoading(false);
                    setPayerID(response.data.pid)
                    setTotalAmount(response.data.amountDue)
                    setAgencyName(response.data.agencyName)
                    setRevenueName(response.data.revName)
                    setAgencyCode(response.data.agencyCode)
                    setRevenueCode(response.data.revenueCode)

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

    //get all payment methods for an organisation
    useEffect(() => {
        api
            .get(`payment/${organisationId}/gateway`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [])

    const handleImageClick = (url) => {
        // Add switch case or conditional statements to navigate based on the URL
        if (url.includes('techpay')) {
            window.open(`http://test.techpay.ng/#/make_payment/webguid/${referenceNumber}`, '_blank');
        } else if (url.includes('lasepay')) {
            window.open(`https://lasepay.utl.flwdev.site/?reference=${referenceNumber}&type=Webguid`, '_blank');
        }
        else if (url.includes('polaris')) {
            window.open(`https://digital-staging.polarisbanklimited.com/LASGCollection/?billReference=${referenceNumber}&billType=WEBGUID`, '_blank');
        }
    };

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

            <div>
                <h5>Bill Reference Number: {selectedItem.billReferenceNo}</h5>
                {payerID && (
                    <div>
                        <h5>Payer ID: {payerID}</h5>
                    </div>
                )}
            </div>

            {payerID && (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Agency Name</th>
                                <th>Agency Code</th>
                                <th>Revenue Name</th>
                                <th>Revenue Code</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{agencyName}</td>
                                <td>{agencyCode}</td>
                                <td>{revenueName}</td>
                                <td>{revenueCode}</td>
                                <td>₦{totalAmount}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <h6>SELECT A PAYMENT CHANNEL</h6>
                {payerID && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}>
                        {data.map((item) => (
                            item.bankStatus && (
                                <div style={{
                                    flex: '0 0 25%', maxWidth: '25%', padding: '10px', boxSizing: 'border-box', cursor: 'pointer',
                                    transition: 'transform 0.2s'
                                }} key={item.banks.bankId}>
                                    <img
                                        src={`data:image/png;base64,${item.banks.bankLogoData}`}
                                        alt="Bank Logo"
                                        style={{
                                            width: imageWidth,
                                            height: imageHeight,
                                            borderRadius: '5px',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'scale(1.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'scale(1)';
                                        }}
                                        key={item.banks.bankId}
                                        onClick={() => handleImageClick(item.banks.bankUrl)}
                                    />
                                </div>
                            )
                        ))}
                    </div>
                )}
            </div>

            {loading && <ClipLoader
                color={color}
                loading={loading}
                cssOverride={override}
                size={100}
                aria-label="Loading Spinner"
                data-testid="loader"
            />}
        </>
    );
};

export default PaymentGateways;