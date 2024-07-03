// import React from "react";
// import { Outlet } from "react-router-dom";

// import App from "./../app.jsx";

// import DashboardV3 from "../pages/Dashboard/Dashboard.js";
// import LoginV3 from "../pages/User/login-v3.js";
// import RegisterV3 from "../pages/User/register-v3.js";
// import LandingPage from "../LandingPage.jsx";
// import SelfService from "../pages/User/SelfService/SelfService.js";
// import SelfRegistration from "../pages/User/SelfService/SelfRegistration.js";
// import ForgotPassword from "../pages/User/SelfService/ForgotPassword";
// import OneTimePassword from "../pages/User/SelfService/otpPage.js";
// import PasswordReset from "../pages/User/SelfService/PasswordReset.js";
// import PropertyProfile from "../pages/Enumeration/Properties/PropertyProfile.js";
// import NewPropertyProfile from "../pages/Enumeration/Properties/NewPropertyProfile.js";
// import AddBusinessProfile from "../pages/Enumeration/Business Profile/createBusinessProfile.js";
// import CreatePayId from "../pages/Enumeration/CreatePayerId.js";
// import SearchPayId from "../pages/Enumeration/SearchPayerId.js";
// import ValidatePayId from "../pages/Enumeration/ValidatePayerId.js";
// import Ward from "../pages/Administration/Wards/ward.js";
// import Agencies from "../pages/Administration/Agencies/agencies.js";
// import BusinessSize from "../pages/Administration/Business Size/businessSize.js";
// import BusinessType from "../pages/Administration/Business Type/businessType.js";
// import Organizations from "../pages/Administration/Organisations/organisation.js";
// import Revenues from "../pages/Administration/Revenues/revenues.js";
// import SpaceIdentifiers from "../pages/Administration/Space Identifiers/spaceIdentifiers.js";
// import Users from "../pages/Administration/Users/users.js";
// import BusinessProfile from "../pages/Enumeration/Business Profile/businessProfile.js";
// import CustomerProfile from "../pages/Enumeration/Customer Profile/customerProfile.js";
// import CreateNewPayerId from "../pages/Enumeration/createNewPayerId.js";
// import EditProperty from "../pages/Enumeration/Properties/editProperty.js";
// import CreateWard from "../pages/Administration/Wards/create.js";
// import EditWard from "../pages/Administration/Wards/edit.js";
// import EditSpaceIdentifier from "../pages/Administration/Space Identifiers/edit.js";
// import CreateSpaceIdentifier from "../pages/Administration/Space Identifiers/create.js";
// import NonPropertyProfile from "../pages/Enumeration/Non-Property/index.js";
// import Enumerate from "../pages/enumeration/enumerate/enumerate.js";
// import ExtraError from "../UI/error.js";
// import Manifest from "../pages/Enumeration/Manifest/Manifest.js";
// import { PrivateRoute } from "../components/auth/PrivateRoute.js";

// const AppRoute = [
//   // {
//   //   path: "/",
//   //   element: <LandingPage />,
//   // },
//   // {
//   //   path: "/login",
//   //   element: <LoginV3 />,
//   //   exact: true,
//   // },
//   // {
//   //   path: "register",
//   //   element: <RegisterV3 />,
//   // },
//   // {
//   //   path: "selfservice",
//   //   element: <SelfService />,
//   // },
//   // {
//   //   path: "selfregistration",
//   //   element: <SelfRegistration />,
//   // },
//   // {
//   //   path: "forgotpassword",
//   //   element: <ForgotPassword />,
//   // },
//   // {
//   //   path: "otp",
//   //   element: <OneTimePassword />,
//   // },
//   // {
//   //   path: "passwordreset",
//   //   element: <PasswordReset />,
//   // },

//   // {
//   //   path: "dashboard",
//   //   element: <PrivateRoute path="dashboard" element={<App />} />,

//   //   children: [
//   //     {
//   //       path: "",
//   //       element: <DashboardV3 />,
//   //     },
//   //   ],
//   // },
//   // {
//   //   path: "Enumeration",
//   //   element: <App />,
//   //   children: [
//   //     // {
//   //     //   path: "PropertyProfile",
//   //     //   element: <PropertyProfile />,
//   //     // },

//   //     // {
//   //     //   path: "enumerate",
//   //     //   element: <Enumerate />,
//   //     // },
//   //     // {
//   //     //   path: "manifest",
//   //     //   element: <Manifest />,
//   //     // },
//   //     // {
//   //     //   path: "NonPropertyProfile",
//   //     //   element: <NonPropertyProfile />,
//   //     // },
//   //     // {
//   //     //   path: "property/:id",
//   //     //   element: <EditProperty />,
//   //     // },

//   //     // {
//   //     //   path: "newPropertyProfile",
//   //     //   element: <NewPropertyProfile />,
//   //     // },
//   //     // {
//   //     //   path: "newPropertyProfile/createbusinessprofile",
//   //     //   element: <AddBusinessProfile />,
//   //     // },
//   //     // {
//   //     //   path: "CreatePayerId",
//   //     //   children: [
//   //     //     {
//   //     //       path: "",
//   //     //       element: <CreatePayId />,
//   //     //     },
//   //     //   ],
//   //     // },
//   //     // {
//   //     //   path: "businessprofile",
//   //     //   children: [
//   //     //     {
//   //     //       path: "",
//   //     //       element: <BusinessProfile />,
//   //     //     },
//   //     //   ],
//   //     // },
//   //     // {
//   //     //   path: "customerprofile",
//   //     //   children: [
//   //     //     {
//   //     //       path: "",
//   //     //       element: <CustomerProfile />,
//   //     //     },
//   //     //   ],
//   //     // },
//   //     // {
//   //     //   path: "ValidatePayerId",
//   //     //   children: [
//   //     //     {
//   //     //       path: "",
//   //     //       element: <ValidatePayId />,
//   //     //     },
//   //     //   ],
//   //     // },
//   //     // {
//   //     //   path: "SearchPayerId",
//   //     //   children: [
//   //     //     {
//   //     //       path: "",
//   //     //       element: <SearchPayId />,
//   //     //     },
//   //     //   ],
//   //     // },
//   //     // {
//   //     //   path: "createnewpayerId",
//   //     //   children: [
//   //     //     {
//   //     //       path: "",
//   //     //       element: <CreateNewPayerId />,
//   //     //     },
//   //     //   ],
//   //     // },
//   //   ],
//   // },

//   {
//     path: "Administration",
//     element: <App />,
//     children: [
//       // {
//       //   path: "wards",
//       //   element: <Ward />,
//       // },
//       // {
//       //   path: "wards/createNew",
//       //   element: <CreateWard />,
//       // },
//       // {
//       //   path: "wards/edit/:id",
//       //   element: <EditWard />,
//       // },
//       // {
//       //   path: "agencies",
//       //   element: <Agencies />,
//       // },
//       {
//         path: "businessSize",
//         element: <BusinessSize />,
//       },
//       {
//         path: "businessType",
//         element: <BusinessType />,
//       },
//       {
//         path: "organisation",
//         element: <Organizations />,
//       },
//       {
//         path: "revenues",
//         element: <Revenues />,
//       },
//       // {
//       //   path: "spaceidentifiers",
//       //   element: <SpaceIdentifiers />,
//       // },
//       // {
//       //   path: "spaceidentifiers/createNew",
//       //   element: <CreateSpaceIdentifier />,
//       // },
//       // {
//       //   path: "spaceidentifiers/edit/:id",
//       //   element: <EditSpaceIdentifier />,
//       // },
//       {
//         path: "users",
//         element: <Users />,
//       },
//     ],
//   },
//   {
//     path: "AuditTrail",
//     element: <App />,
//     children: [
//       {
//         path: "",
//         element: <DashboardV3 />,
//       },
//     ],
//   },
//   {
//     path: "BillManagement",
//     element: <App />,
//     children: [
//       {
//         path: "",
//         element: <DashboardV3 />,
//       },
//     ],
//   },
//   {
//     path: "DebtManagement",
//     element: <App />,
//     children: [
//       {
//         path: "",
//         element: <DashboardV3 />,
//       },
//     ],
//   },
//   {
//     path: "Payments",
//     element: <App />,
//     children: [
//       {
//         path: "",
//         element: <DashboardV3 />,
//       },
//     ],
//   },
//   {
//     path: "TransactionReportBuilder",
//     element: <App />,
//     children: [
//       {
//         path: "",
//         element: <DashboardV3 />,
//       },
//     ],
//   },
// ];

// export default AppRoute;
