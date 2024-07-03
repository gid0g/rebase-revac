
const authInfo = {
    userId: sessionStorage.getItem("userId"),
    roleId: sessionStorage.getItem("organisationId"),
    token: sessionStorage.getItem("myToken"),
    roleId: sessionStorage.getItem("roleId"),
    agencyId: sessionStorage.getItem("agencyId"),
    agencyType: sessionStorage.getItem("agencyType"),
}

// SuperAdmin = 1,
// Admin = 2,
// Admin1 = 5,
// SuperUser = 3,
// user = 4 


  function fetchDataBasedOnConditions(user) {
    if ((user.roleId === 2 || user.roleId === 5) && user.agencyType === true) {
      fetchDataByOrganisationId(user.organisationId);
    } else if ((user.roleId !== 2 && user.roleId !== 5) && user.agencyType === true) {
      fetchDataByAgencyId(user.agencyId);
    } else if ((user.roleId !== 2 && user.roleId !== 5) && user.agencyType === false) {
      fetchDataByAgencyId(user.agencyId);
    } else if ((user.roleId === 2 || user.roleId === 5) && user.agencyType === false) {
      fetchDataByAgencyId(user.agencyId);
    } else {
      console.log('Invalid scenario or conditions!');
    }
  }
  
  function fetchDataByOrganisationId(organisationId) {
   if(organisationId) {
    return organisationId;
   }  
  }
  
  function fetchDataByAgencyId(agencyId) {
    if(agencyId) {
      return agencyId;
    }  
  }
  

  