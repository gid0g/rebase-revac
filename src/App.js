import React from "react";
import { Routes, Route, HashRouter } from "react-router-dom";
// import {BrowserRouter} from "react-router-dom"

// bootstrap
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// css
import "@fortawesome/fontawesome-free/css/all.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "./index.css";
import "./scss/react.scss";
// import store from "./redux/store.js";
import LoginV3 from "./pages/user/login-v3";
// import rootReducer from "./redux/reducers/rootReducer";
import { PrivateRoute } from "./components/auth/privateRoute.js";
import LandingPage from "./pages/landing/landingPage.jsx";
import DefaultLayout from "./components/layout/defaultLayout";
import RegisterV3 from "./pages/user/onboarding/register-v3";
import SelfService from "./pages/user/selfservice/selfService";
import SelfRegistration from "./pages/user/selfservice/selfRegistration";
import ForgotPassword from "./pages/user/selfservice/forgotPassword";
import OneTimePassword from "./pages/user/selfservice/otpPage";
import PasswordReset from "./pages/user/selfservice/passwordReset";
import Dashboard from "./pages/dashboard/dashboard";
import Enumerate from "./pages/enumeration/enumerate/enumerate";
import PropertyProfile from "./pages/enumeration/properties/propertyProfile";
import Enumeration from "./pages/enumeration";
import Manifest from "./pages/enumeration/manifest/manifest";
import NonPropertyProfile from "./pages/enumeration/nonproperty";
import EditProperty from "./pages/enumeration/properties/editProperty";
import NewPropertyProfile from "./pages/enumeration/properties/newPropertyProfile";
import AddBusinessProfile from "./pages/enumeration/businessprofile/createBusinessProfile";
import CreatePayId from "./pages/enumeration/createPayerId";
import BusinessProfile from "./pages/enumeration/businessprofile/businessProfile";
import CustomerProfile from "./pages/enumeration/customerprofile/customerProfile";
import ValidatePayId from "./pages/enumeration/validatePayerId";
import SearchPayId from "./pages/enumeration/searchPayerId";
import CreateNewPayerId from "./pages/enumeration/createNewPayerId";
import Administration from "./pages/administration";

// import Wards from "./pages/administration/wards/ward";
// import Ward from "./pages/administration/wards";
// import StreetIndex from "./pages/administration/street/index"
import Street from "./pages/administration/street/street";
import CreateNewStreet from "./pages/administration/street/newstreet/create";
import BulkStreetUpload from "./pages/administration/street/newstreet/bulkstreetupload"
import BusinessType from "./pages/administration/businesstype";
import BusinessTypes from "./pages/administration/businesstype/businessType";
import Agency from "./pages/administration/agencies";
import Agencies from "./pages/administration/agencies/agencies";
import Revenue from "./pages/administration/revenues";
import Revenues from "./pages/administration/revenues/revenues";
import SpaceIdentifier from "./pages/administration/spaceidentifiers";
import SpaceIdentifiers from "./pages/administration/spaceidentifiers/spaceIdentifiers";
import User from "./pages/administration/users";
import Users from "./pages/administration/users/users";
import ManifestSlip from "./pages/enumeration/manifest/manifestSlip";
import Manifests from "./pages/enumeration/manifest";
import Organisation from "./pages/administration/organisations/organisation";
import Organisations from "./pages/administration/organisations/index";
import Billing from "./pages/billing/index";
import Billings from "./pages/billing/billing";
import BillingList from "./pages/billing/billingList";
import CustomerDto from "./pages/enumeration/customerprofile/customerDto";
// import { ErrorBoundary } from "react-error-boundary";
import ErrorBoundaryComponent from "./components/errorboundary/errorBoundary";
import BusinessSize from "./pages/administration/businesssize";
import BusinessSizes from "./pages/administration/businesssize/businessSize";
import CreateNewOrganisation from "./pages/administration/organisations/create";
import { SelfServiceContextProvider } from "./pages/user/selfservice/selfservicecontext";
import UserForm from "./pages/user/onboarding/userForm";
import HavePayerId from "./pages/user/onboarding/havePayerId";
import VerifyEmail from "./pages/user/selfservice/verifyemail";
import CorporatePayerId from "./pages/user/onboarding/corporatePayerIdCreation";
import { OnboardingContextProvider } from "./pages/user/onboarding/onboardingcontext";
import Tenants from "./pages/administration/tenant/tenant";
import Tenant from "./pages/administration/tenant";
import EnumerateBilling from "./pages/enumeration/enumeration-billing.js/index.js";
import Payment from "./pages/administration/payments";
import Payments from "./pages/administration/payments/payment";
import ChangePassword from "./pages/user/onboarding/changePassword";
import ViewOrganisation from "./pages/administration/organisations/view";
import Department from "./pages/administration/department/department.js";
import Departments from "./pages/administration/department/index.js";
import Modules from "./pages/moduleManagement/modules";
import Module from "./pages/moduleManagement/index";
import RoleManagemnt from"./pages/moduleManagement/roleManagement.js";
import ViewModules from "./pages/moduleManagement/viewmodlues.js"
import PaymentsHome from "./pages/payment/index";
import OrganisationPaymentHistory from "./pages/payment/organisationPaymentHistory";
import IndividualPaymentHistory from "./pages/payment/individualPaymentHistory";
import PaymentGateways from "./pages/payment/paymentGateways";
import Banks from "./pages/bankManagement/banks";
import Bank from "./pages/bankManagement/index";
import GetOrganisationsModules from "./pages/moduleManagement/organisation";
import ViewOrganisationModules from "./pages/moduleManagement/organisationModules";
import Menus from "./pages/moduleManagement/menus";
import BillFormat from "./pages/administration/bill";
import BillFormats from "./pages/administration/bill/billformat";
import BackLogBill from "./pages/billing/backlogbill";
import AutoGenerateBill from "./pages/billing/autogeneratebill";
import RevenuePrice from "./pages/administration/revenuePrices";
import Category from "./pages/administration/categories";
import Categories from "./pages/administration/categories/categories";
import RevenuePrices from "./pages/administration/revenuePrices/revenuePrices";
import DebtManagements from "./pages/debtManagement";
import DebtManagement from "./pages/debtManagement/debtManagement";
import BulkBill from "./pages/billing/bulkbillupload";
import ViewBill from "./pages/billing/viewBill";
import PreviewBill from "./pages/billing/previewbill";
import ReportBuilder from "./pages/transactionReportBuilder";
import TransactionReportBuilder from "./pages/transactionReportBuilder/transactionReport-V2";
import ConfirmAccount from "./pages/user/selfservice/confirmAccount";
import RectifyAccount from "./pages/user/selfservice/rectifyPassword.js";
import Home from "./pages/Home/Home";
import Updatebill from "./pages/billing/updatebill";
import Profile from "./pages/administration/organisations/profile";
import ThankYou from "./pages/user/onboarding/thankyou.js";

const App = () => {
  const roleId = "1";

  return (
    <ErrorBoundaryComponent>
      <SelfServiceContextProvider>
        <OnboardingContextProvider>
          {" "}
          <HashRouter basename="/">
            <Routes>
              <Route path="/" name="Landing Page" element={<LandingPage />} />
              <Route
                path="register"
                name="Register Page"
                element={<RegisterV3 />}
              >
                <Route path="" element={<HavePayerId />} />
                <Route path="form" element={<UserForm />} />
                <Route
                  path="createCorporatePayerId"
                  element={<CorporatePayerId />}
                />
              </Route>
              <Route
                path="selfservice"
                name="Self Service"
                element={<SelfService />}
              >
                <Route path="" element={<SelfRegistration />} />
                <Route
                  path="verifyemail"
                  name="Verify Email"
                  element={<VerifyEmail />}
                />
              </Route>

              <Route
                path="forgotpassword"
                name="Forgot Password"
                element={<ForgotPassword />}
              />
              <Route path="otp" name="otp Page" element={<OneTimePassword />} />
              <Route
                path="passwordreset"
                name="Password Reset Page"
                element={<PasswordReset />}
              />
              <Route
                path="confirmaccount"
                name="Confirm Account Page"
                element={<ConfirmAccount />}
              />
              <Route
                path="rectifyaccount"
                name="Confirm Account Page"
                element={<RectifyAccount />}
              />
              <Route
                path="changepassword"
                name="Password Change Page"
                element={<ChangePassword />}
              />
              <Route
                path="thankyou"
                name="Thankyou Page"
                element={<ThankYou />}
              />
              <Route
                exact
                path="login"
                name="Login Page"
                element={<LoginV3 />}
              />
              <Route
                path="home"
                name="Home"
                element={
                  <PrivateRoute>
                    <DefaultLayout />
                  </PrivateRoute>
                }
              >

                <Route path="Homepage" element={<Home />} />
                <Route path="Dashboard" element={<Dashboard />} />

                {/* Enumeration Routes and all children*/}
                <Route path="enumeration" element={<Enumeration />}>
                  <Route path="" element={<Enumerate />} />
                  <Route path="PropertyProfile" element={<PropertyProfile />} />
                  <Route path="manifest" element={<Manifests />}>
                    <Route path="" element={<Manifest />} />
                    <Route
                      path="print-manifest-slip/:id"
                      element={<ManifestSlip />}
                    />
                  </Route>

                  <Route
                    path="nonpropertyprofile"
                    element={<NonPropertyProfile />}
                  />
                  <Route path="editproperty/:id" element={<EditProperty />} />
                  <Route
                    path="newPropertyProfile"
                    element={<NewPropertyProfile />}
                  />
                  <Route
                    path="createbusinessprofile"
                    element={<AddBusinessProfile />}
                  />
                  <Route path="customerprofiles" element={<CustomerDto />} />
                  <Route path="createPayerId" element={<CreatePayId />} />
                  <Route path="businessprofile" element={<BusinessProfile />} />
                  <Route path="customerprofile" element={<CustomerProfile />} />
                  <Route path="validatepayerId" element={<ValidatePayId />} />
                  <Route path="searchpayerId" element={<SearchPayId />} />
                  <Route
                    path="createnewpayerId"
                    element={<CreateNewPayerId />}
                  />
                  <Route path="billing" element={<EnumerateBilling />} />
                </Route>

                {/* Administration Routes and all children*/}
                <Route path="administration" element={<Administration />}>


                  {/* <Route path="wards" element={<Ward />}>
                    <Route path="" element={<Wards />} />
                  </Route> */}
                  <Route path="SpaceIdentifiers" element={<SpaceIdentifier />}>
                    <Route path="" element={<SpaceIdentifiers />} />
                  </Route>
                  <Route path="Agencies" element={<Agency />}>
                    <Route path="" element={<Agencies />} />
                  </Route>
                  <Route path="Revenues" element={<Revenue />}>
                    <Route path="" element={<Revenues />} />
                  </Route>
                  <Route path="billformat" element={<BillFormat />}>
                    <Route path="" element={<BillFormats />} />
                  </Route>
                  <Route path="department" element={<Departments />}>
                    <Route path="" element={<Department />} />
                  </Route>
                  <Route path="BusinessType" element={<BusinessType />}>
                    <Route path="" element={<BusinessTypes />} />
                  </Route>
                  <Route path="BusinessSize" element={<BusinessSize />}>
                    <Route path="" element={<BusinessSizes />} />
                  </Route>
                  <Route path="users" element={<User />}>
                    <Route path="" element={<Users />} />
                  </Route>
                  {roleId == "1" && (
                    <Route path="tenant" element={<Tenant />}>
                      <Route path="" element={<Tenants />} />
                    </Route>
                  )}
                  <Route path="categories" element={<Category />}>
                    <Route path="" element={<Categories />} />
                  </Route>
                  {roleId == "1" && (
                    <Route path="street" element={<Street />}>
                    </Route>
                  )}
                  {roleId ==  "1" && (
                    <Route path="street/createnewstreet" element={<CreateNewStreet />}>
                    </Route>
                  )}
                  {roleId ==  "1" && (
                    <Route path="street/createnewstreet/bulkstreetupload" element={<BulkStreetUpload />}>
                    </Route>
                  )}
                  <Route
                    path="revenuepricemanagement"
                    element={<RevenuePrice />}
                  >
                    <Route path="" element={<RevenuePrices />} />
                  </Route>
                  {roleId == "1" && (
                    <Route path="organisation" element={<Organisations />}>
                      <Route path="" element={<Organisation />} />
                      <Route
                        path="createneworganisation"
                        element={<CreateNewOrganisation />}
                      />
                      <Route
                        path="vieworganisation/:id"
                        element={<ViewOrganisation />}
                      />
                    </Route>
                  )}
                  <Route path="payments" element={<Payment />}>
                    <Route path="" element={<Payments />} />
                  </Route>
                  <Route path="profile" element={<Profile />} />
                </Route>

                {/* Bill Management Routes and all children*/}
                <Route path="billing" element={<Billing />}>
                  <Route path="" element={<BillingList />} />
                  <Route path="generatenewbill" element={<Billings />} />
                  <Route path="paymentgateway" element={<PaymentGateways />} />
                  <Route
                    path="autogeneratebill"
                    element={<AutoGenerateBill />}
                  />   
                  <Route path="updatebill" element={<Updatebill />} />
                  <Route path="viewbill" element={<ViewBill />} />
                  <Route path="previewbill" element={<PreviewBill/>} />
                  <Route path="bulkbillupload" element={<BulkBill />} />
                  <Route path="generatebacklogbill" element={<BackLogBill />} />
                </Route>

                {/* Module Management Routes and all children*/}
                {roleId == "1" && (
                  <Route path="modulemanagement" element={<Module />}>
                    <Route path="" element={<Modules />} />
                    <Route
                      path="organisations"
                      element={<GetOrganisationsModules />}
                    />
                    <Route
                      path="modules"
                      element={<ViewOrganisationModules />}
                    />
                    <Route path="menus" element={<Menus />} />
                  </Route>
                )}
{/* Admin Module management */}
                    <Route
                      path="viewmodules"
                      element={<ViewModules />}
                    />
                    <Route
                      path="roleManagement"
                      element={<RoleManagemnt />}
                    />

                     


                {/* Payments Routes and all children*/}
                <Route path="payments" element={<PaymentsHome />}>
                  <Route path="" element={<OrganisationPaymentHistory />} />
                  <Route
                    path="individual"
                    element={<IndividualPaymentHistory />}
                  />
                </Route>

                {/* Bank Management*/}
                <Route path="bankmanagement" element={<Bank />}>
                  <Route path="" element={<Banks />} />
                  <Route path="generatebacklogbill" element={<BackLogBill />} />
                  <Route
                    path="autogeneratebill"
                    element={<AutoGenerateBill />}
                  />
                </Route>

                {/* Debt Management Routes*/}
                <Route path="debtmanagement" element={<DebtManagements />}>
                  <Route path="" element={<DebtManagement />} />
                </Route>

                {/* Transaction Report Builder Routes*/}
                <Route
                  path="transactionReportBuilder"
                  element={<ReportBuilder />}
                >
                  <Route path="" element={<TransactionReportBuilder />} />
                </Route>
              </Route>
            </Routes>
          </HashRouter>
        </OnboardingContextProvider>
      </SelfServiceContextProvider>
    </ErrorBoundaryComponent>
  );
};

export default App;
