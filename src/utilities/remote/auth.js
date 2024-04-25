//Get the tokens expiratin time
const getTokenExpiration = (token) => {
  if (!token) {
    return null;
  }
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const { exp } = JSON.parse(jsonPayload);
    return exp;
  } catch (error) {
    return null;
  }
};

//sending the token and ID to session storage
export const authenticateUser = (token, organisationId, userId, roleId, agencyId, agencyType) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("myToken", token);
    sessionStorage.setItem("organisationId", organisationId);
    sessionStorage.setItem("userId", userId);
    sessionStorage.setItem("roleId", roleId);
    sessionStorage.setItem("agencyId", agencyId);
    sessionStorage.setItem("agencyType", agencyType);
  }
};

//logout the user
export const logout = () => {
  if (typeof window != "undefined") {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("organisationId");
    sessionStorage.removeItem("myToken");
    sessionStorage.removeItem("roleId");
    sessionStorage.removeItem("agencyId");
    sessionStorage.removeItem("agencyType");
    window.location.replace("/Frondend");
  }
};
//check if youre authenticated
export const isAuthenticated = () => {
  const token = sessionStorage.getItem("myToken");
  if (typeof window === "undefined") {
    return false;
  }
  if (token) {
    const tokenExpiration = getTokenExpiration(token);
    if (tokenExpiration && tokenExpiration > Date.now() / 1000) {
      return token;
    } else {
      logout(); // Token expired, logout the user
      return false;
    }
  } else {
    //logout(); // organisationId tampered, logout the user
    return false;
  }
};

export const isAuthenticatedOrganisationId = () => {
  if (typeof window == "undefined") {
    return false;
  }
  if (sessionStorage.getItem("organisationId")) {
    return sessionStorage.getItem("organisationId");
  } else {
    return false;
  }
};
export const isAuthenticatedUserProfileId = () => {
  if (typeof window == "undefined") {
    return false;
  }
  if (sessionStorage.getItem("userId")) {
    return sessionStorage.getItem("userId");
  } else {
    return false;
  }
};
