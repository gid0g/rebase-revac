
export function getAppliedDate(timestamp) {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    console.log("formattedDate: ", formattedDate); 
    return formattedDate;
}
  

// const [fields, setFields] = useState({
//   agencyId: 0,
//   BillRevenuePrices: [],
//   businessTypeId: 0,
//   businessSizeId: 0,
//   appliedDate: new Date().getFullYear,
//   dateCreated: "",
//   createdBy: ""
// })

// const billRevenuePrice = {
//   revenueId: 1002,
//   billAmount: 1350,
//   category: "B"
// }
  
// {
//   "createPropertyBillDto": [
//     {
//       "agencyId": 45,
//       "BillRevenuePrices": [],
//       "businessTypeId": 12,
//       "businessSizeId": 8,
//       "appliedDate": "2023",
//       "dateCreated": "2023-10-10T12:27:49.396Z",
//       "createdBy": "Lilian aduku"
//     }
//   ]
// }