const fullName = data?.fullName ? data.fullName : "";

const nameInfo = splitFullName(fullName);

const payerTypeDto = customerStatus == false ? 0 : checkPayerType(data?.payerTypes?.payerTypeCode);
const payerDto = customerStatus == false ? "string" : data.payerID;
const titleDto = customerStatus == false ? 0 : checkTitle(data?.titles?.titleCode);
const genderDto = customerStatus == false ? 0 : checkGender(data?.genders?.genderCode);
const maritalStatusDto = customerStatus == false ? 0 : checkMaritalDtoStatus(data?.maritalStatuses);
const phoneNoDto = customerStatus == false ? "string" : data?.phoneNo
;
const corporateNameDto = customerStatus == false ? "string" : data.corporateName;
const firstNameDto = customerStatus == false ? "string" : nameInfo.firstName;
const middleNameDto = customerStatus == false ? "string" : nameInfo.middleName;
const lastNameDto = customerStatus == false ? "string" : nameInfo.lastName;
const addressDto = customerStatus == false ? "string" : data.address;
const emailDto = customerStatus == false ? "user@example.com" : data.email;
const suppliedPidDto = customerStatus == false ? true : enumerationStatus;

console.log("Customer Status:", customerStatus);
console.log("Marital Id:", maritalStatusId);
console.log("Customer Data:", data);
const createCustomerDto = {
  payerTypeId: payerTypeDto,
  payerId: payerDto,
  titleId: titleDto,
  corporateName: corporateNameDto,
  firstName: firstNameDto,
  lastName: lastNameDto,
  middleName: middleNameDto,
  genderId: genderDto,
  maritalStatusId: maritalStatusDto,
  address: addressDto,
  email: emailDto,
  suppliedPID: suppliedPidDto,
  phoneNo: phoneNoDto,
  dateCreated: new Date().toISOString(),
  createdBy: userData[0]?.email,
};

console.log("createCustomerDto:", createCustomerDto);