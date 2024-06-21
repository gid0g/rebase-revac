import React, { useState, useEffect, useContext } from "react";

import {
  useResolvedPath,
  useMatch,
  NavLink,
  useLocation,
  matchPath,
} from "react-router-dom";
// import { AppSettings } from "./../../config/app-settings.js";
import api from "../../axios/custom";
import { ToastContainer, toast } from "react-toastify";

import {
  SuperAdminMenu,
  AdminMenu,
  SuperUserMenu,
  UserMenu,
  Admin1Menu,
} from "../../config/app-menu";
/////////////

///////////////
const NavItem = ({ menu, ...props }: LinkProps) => {
  let resolved = useResolvedPath(menu.path);

  let match = useMatch({ path: resolved.pathname });

  let location = useLocation();
  let match2 = matchPath({ path: menu.path, end: false }, location.pathname);

  let caret = menu.children && <div className="menu-caret"></div>;

  let title = menu.title && <div className="menu-text">{menu.title} </div>;
  let icon = menu.icon && (
    <div className="menu-icon">
      <i className={menu.icon}></i>
    </div>
  );
  return (
    <div
      className={
        "menu-item" +
        (match || match2 ? " active" : "") +
        (menu.children ? " has-sub" : "")
      }
    >
      <NavLink className="menu-link" to={menu.path} {...props}>
        {icon}
        {title} {caret}
      </NavLink>

      {menu.children && (
        <div className="menu-submenu">
          {menu.children.map((submenu, i) => (
            <NavItem key={i} menu={submenu} />
          ))}
        </div>
      )}
    </div>
  );
};

// const SidebarNav = () => {
//   //////////////////////
// const Id = sessionStorage.getItem("userId")
// const token = sessionStorage.getItem("myToken")
// const [modules,setModules]=useState([])
// const [loading, setLoading] = useState(false);
// /////////////////////
//   const userId = sessionStorage.getItem("roleId")
//   console.log("userID:" , Id)
//   let menu;

// const getOrganisationModules = async (Id) => {

//   setLoading(true);
//   await api
//       .get(`/module/${Id}/organisation-modules`, {
//           headers: {
//               Authorization: `Bearer ${token}`,
//           },
//       })
//       .then((response) => {
//           if (response.status === 200) {
//               setLoading(false);
//               setModules(response.data);
//               console.log("getorganisationmodule", response.data)

//               toast.success(response.data.statusMessage, {
//                   position: "top-right",
//                   autoClose: 5000,
//                   hideProgressBar: true,
//                   closeOnClick: true,
//                   pauseOnHover: true,
//                   draggable: true,
//                   progress: undefined,
//                   theme: "colored",
//               });
//           }
//           setLoading(false);
//           return true;
//       })
//       .catch((error) => {
//           setLoading(false);
//           console.log("error is", error.message)
//           if (error.message === "timeout exceeded") {
//               toast.error(error.message, {
//                   position: "top-right",
//                   autoClose: 5000,
//                   hideProgressBar: true,
//                   closeOnClick: true,
//                   pauseOnHover: true,
//                   draggable: true,
//                   progress: undefined,
//                   theme: "colored",
//               });
//           }
//           setLoading(false);
//           console.log("error", error);
//           toast.error(error.response, {
//               position: "top-right",
//               autoClose: 5000,
//               hideProgressBar: true,
//               closeOnClick: true,
//               pauseOnHover: true,
//               draggable: true,
//               progress: undefined,
//               theme: "colored",
//           });
//       });
// }

// useEffect(()=>{getOrganisationModules(Id)},[])

// useEffect(()=>{
//   const newModule= menu.filter(obj2=>{
//     return modules.some(obj1=>obj1.modules.moduleName===obj2.title)
//   })
  
//   console.log("accepted modules", newModule)
// },[modules])

// /////////////////////
//   switch (userId) {
//     case "1":
//       menu = SuperAdminMenu;
//       break;
//     case "2":
//       menu = AdminMenu;
//       break;
//     case "3":
//       menu = SuperUserMenu;
//       break;
//     case "4":
//       menu = UserMenu;
//       break;
//     case "5":
//       menu = Admin1Menu;
//       break;
    
//     default:
//       return
//   }
// /////////////


//   ////////////////////
//   console.log("menu-------------", menu);

//   return (
//     <div className="menu mt-3">
//       {/* <div className="menu-header">Navigation</div> */}
//       {menu.map((menu, i) => (
//         <NavItem key={i} menu={menu} />
//       ))}
//     </div>
//   );
// };

// export default SidebarNav;

const SidebarNav = () => {
  const Id = sessionStorage.getItem("organisationId");
  const token = sessionStorage.getItem("myToken");
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newModule, setNewModule] = useState([]); // Define newModule state
  const userId = sessionStorage.getItem("roleId");
  const Home={ path: "Homepage", icon: "fa fa-home", title: "Home" }
const Dashboard= { path: "Dashboard", icon: "fa fa-sitemap", title: "Dashboard" } 
  let menu;

  const getOrganisationModules = async (Id) => {
    setLoading(true);
    await api
      .get(`/module/${Id}/organisation-modules`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setLoading(false);
          console.log("module", response)
          console.log("module", Id)
          setModules(response.data);
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
        console.log("error is", error.message);
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
  };

  useEffect(() => {
    getOrganisationModules(Id);
  }, []);

  useEffect(() => {
    const filteredModules = menu.filter((obj2) => {
      return modules.some((obj1) => obj1.modules.moduleName === obj2.title);
    });
    filteredModules.unshift(Home)
    setNewModule(filteredModules); // Update newModule state
    console.log("this is it",menu,newModule)
  }, [modules, menu]);

  switch (userId) {
    case "1":
      menu = SuperAdminMenu;
      break;
    case "2":
      menu = AdminMenu;
      break;
    case "3":
      menu = SuperUserMenu;
      break;
    case "4":
      menu = UserMenu;
      break;
    case "5":
      menu = Admin1Menu;
      break;
    default:
      return null;
  }

  return (
    <div className="menu mt-3">
      {newModule &&
        newModule.map((menuItem, index) => (
          <NavItem key={index} menu={menuItem} />
        ))}
      {/* {menu &&
        menu.map((menuItem, index) => (
          <NavItem key={index} menu={menuItem} />
        ))} */}
    </div>
  );
};

export default SidebarNav;
