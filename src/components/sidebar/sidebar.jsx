import React from "react";
import { Link } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import { AppSettings } from "./../../config/app-settings.js";
import { slideUp } from "./../../composables/slideUp.js";
import { slideToggle } from "./../../composables/slideToggle.js";
import SidebarMinifyBtn from "./sidebar-minify-btn.jsx";
import SidebarNav from "./sidebar-nav.jsx";
import Logout from "../../pages/user/logout.js";

class Sidebar extends React.Component {
  static contextType = AppSettings;

  componentDidMount() {
    var handleSidebarMenuToggle = function (menus, expandTime) {
      // console.log(menus, expandTime);
      menus.map(function (menu) {
        menu.onclick = function (e) {
          e.preventDefault();
          var target = this.nextElementSibling;

          menus.map(function (m) {
            var otherTarget = m.nextElementSibling;
            if (otherTarget !== target) {
              slideUp(otherTarget, expandTime);
              otherTarget.closest(".menu-item").classList.remove("expand");
              otherTarget.closest(".menu-item").classList.add("closed");
            }
            return true;
          });

          var targetItemElm = target.closest(".menu-item");

          if (
            targetItemElm.classList.contains("expand") ||
            (targetItemElm.classList.contains("active") &&
              !target.style.display)
          ) {
            targetItemElm.classList.remove("expand");
            targetItemElm.classList.add("closed");
            slideToggle(target, expandTime);
          } else {
            targetItemElm.classList.add("expand");
            targetItemElm.classList.remove("closed");
            slideToggle(target, expandTime);
          }
        };

        return true;
      });
    };

    var targetSidebar = document.querySelector(
      ".app-sidebar:not(.app-sidebar-end)"
    );
    var expandTime =
      targetSidebar &&
      targetSidebar.getAttribute("data-disable-slide-animation")
        ? 0
        : 300;

    var menuBaseSelector = ".app-sidebar .menu > .menu-item.has-sub";
    var submenuBaseSelector = " > .menu-submenu > .menu-item.has-sub";

    // menu
    var menuLinkSelector = menuBaseSelector + " > .menu-link";
    var menus = Array.from(document.querySelectorAll(menuLinkSelector));
    handleSidebarMenuToggle(menus, expandTime);

    // submenu lvl 1
    var submenuLvl1Selector = menuBaseSelector + submenuBaseSelector;
    var submenusLvl1 = [].slice.call(
      document.querySelectorAll(submenuLvl1Selector + " > .menu-link")
    );
    handleSidebarMenuToggle(submenusLvl1, expandTime);

    // submenu lvl 2
    var submenuLvl2Selector =
      menuBaseSelector + submenuBaseSelector + submenuBaseSelector;
    var submenusLvl2 = [].slice.call(
      document.querySelectorAll(submenuLvl2Selector + " > .menu-link")
    );

    handleSidebarMenuToggle(submenusLvl2, expandTime);

    var appSidebarFloatSubmenuTimeout = "";
    var appSidebarFloatSubmenuDom = "";

    function handleGetHiddenMenuHeight(elm) {
      elm.setAttribute(
        "style",
        "position: absolute; visibility: hidden; display: block !important"
      );
      var targetHeight = elm.clientHeight;
      elm.removeAttribute("style");
      return targetHeight;
    }

    function handleSidebarMinifyFloatMenuClick() {
      var elms = [].slice.call(
        document.querySelectorAll(
          "#app-sidebar-float-submenu .menu-item.has-sub > .menu-link"
        )
      );
      if (elms) {
        elms.map(function (elm) {
          elm.onclick = function (e) {
            e.preventDefault();
            var targetItem = this.closest(".menu-item");
            var target = targetItem.querySelector(".menu-submenu");
            var targetStyle = getComputedStyle(target);
            var close =
              targetStyle.getPropertyValue("display") !== "none" ? true : false;
            var expand =
              targetStyle.getPropertyValue("display") !== "none" ? false : true;

            slideToggle(target);

            var loopHeight = setInterval(function () {
              var targetMenu = document.querySelector(
                "#app-sidebar-float-submenu"
              );
              var targetMenuArrow = document.querySelector(
                "#app-sidebar-float-submenu-arrow"
              );
              var targetMenuLine = document.querySelector(
                "#app-sidebar-float-submenu-line"
              );
              var targetHeight = targetMenu.clientHeight;
              var targetOffset = targetMenu.getBoundingClientRect();
              var targetOriTop = targetMenu.getAttribute("data-offset-top");
              var targetMenuTop = targetMenu.getAttribute(
                "data-menu-offset-top"
              );
              var targetTop = targetOffset.top;
              var windowHeight = document.body.clientHeight;
              if (close) {
                if (targetTop > targetOriTop) {
                  targetTop =
                    targetTop > targetOriTop ? targetOriTop : targetTop;
                  targetMenu.style.top = targetTop + "px";
                  targetMenu.style.bottom = "auto";
                  targetMenuArrow.style.top = "20px";
                  targetMenuArrow.style.bottom = "auto";
                  targetMenuLine.style.top = "20px";
                  targetMenuLine.style.bottom = "auto";
                }
              }
              if (expand) {
                if (windowHeight - targetTop < targetHeight) {
                  var arrowBottom = windowHeight - targetMenuTop - 22;
                  targetMenu.style.top = "auto";
                  targetMenu.style.bottom = 0;
                  targetMenuArrow.style.top = "auto";
                  targetMenuArrow.style.bottom = arrowBottom + "px";
                  targetMenuLine.style.top = "20px";
                  targetMenuLine.style.bottom = arrowBottom + "px";
                }
                var floatSubmenuElm = document.querySelector(
                  "#app-sidebar-float-submenu .app-sidebar-float-submenu"
                );
                if (targetHeight > windowHeight) {
                  if (floatSubmenuElm) {
                    var splitClass = "overflow-scroll mh-100vh".split(" ");
                    for (var i = 0; i < splitClass.length; i++) {
                      floatSubmenuElm.classList.add(splitClass[i]);
                    }
                  }
                }
              }
            }, 1);
            setTimeout(function () {
              clearInterval(loopHeight);
            }, 250);
          };
          return true;
        });
      }
    }

    function handleSidebarMinifyFloatMenu() {
      var elms = [].slice.call(
        document.querySelectorAll(
          ".app-sidebar .menu > .menu-item.has-sub > .menu-link"
        )
      );
      if (elms) {
        elms.map(function (elm) {
          elm.onmouseenter = function () {
            var appElm = document.querySelector(".app");
            if (appElm && appElm.classList.contains("app-sidebar-minified")) {
              clearTimeout(appSidebarFloatSubmenuTimeout);
              var targetMenu =
                this.closest(".menu-item").querySelector(".menu-submenu");
              if (
                appSidebarFloatSubmenuDom === this &&
                document.querySelector("#app-sidebar-float-submenu")
              ) {
                return;
              } else {
                appSidebarFloatSubmenuDom = this;
              }
              var targetMenuHtml = targetMenu.innerHTML;
              if (targetMenuHtml) {
                var bodyStyle = getComputedStyle(document.body);
                var sidebarOffset = document
                  .querySelector("#sidebar")
                  .getBoundingClientRect();
                var sidebarWidth = parseInt(
                  document.querySelector("#sidebar").clientWidth
                );
                var sidebarX =
                  !appElm.classList.contains("app-sidebar-end") &&
                  bodyStyle.getPropertyValue("direction") !== "rtl"
                    ? sidebarOffset.left + sidebarWidth
                    : document.body.clientWidth - sidebarOffset.left;
                var targetHeight = handleGetHiddenMenuHeight(targetMenu);
                var targetOffset = this.getBoundingClientRect();
                var targetTop = targetOffset.top;
                var targetLeft =
                  !appElm.classList.contains("app-sidebar-end") &&
                  bodyStyle.getPropertyValue("direction") !== "rtl"
                    ? sidebarX
                    : "auto";
                var targetRight =
                  !appElm.classList.contains("app-sidebar-end") &&
                  bodyStyle.getPropertyValue("direction") !== "rtl"
                    ? "auto"
                    : sidebarX;
                var windowHeight = document.body.clientHeight;

                if (!document.querySelector("#app-sidebar-float-submenu")) {
                  var overflowClass = "";
                  if (targetHeight > windowHeight) {
                    overflowClass = "overflow-scroll mh-100vh";
                  }
                  var html = document.createElement("div");
                  html.setAttribute("id", "app-sidebar-float-submenu");
                  html.setAttribute(
                    "class",
                    "app-sidebar-float-submenu-container"
                  );
                  html.setAttribute("data-offset-top", targetTop);
                  html.setAttribute("data-menu-offset-top", targetTop);
                  html.innerHTML =
                    "" +
                    '	<div class="app-sidebar-float-submenu-arrow" id="app-sidebar-float-submenu-arrow"></div>' +
                    '	<div class="app-sidebar-float-submenu-line" id="app-sidebar-float-submenu-line"></div>' +
                    '	<div class="app-sidebar-float-submenu ' +
                    overflowClass +
                    '">' +
                    targetMenuHtml +
                    "</div>";
                  appElm.appendChild(html);

                  var elm = document.getElementById(
                    "app-sidebar-float-submenu"
                  );
                  elm.onmouseover = function () {
                    clearTimeout(appSidebarFloatSubmenuTimeout);
                  };
                  elm.onmouseout = function () {
                    appSidebarFloatSubmenuTimeout = setTimeout(() => {
                      document
                        .querySelector("#app-sidebar-float-submenu")
                        .remove();
                    }, 250);
                  };
                } else {
                  var floatSubmenu = document.querySelector(
                    "#app-sidebar-float-submenu"
                  );
                  var floatSubmenuInnerElm = document.querySelector(
                    "#app-sidebar-float-submenu .app-sidebar-float-submenu"
                  );

                  if (targetHeight > windowHeight) {
                    if (floatSubmenuInnerElm) {
                      var splitClass = "overflow-scroll mh-100vh".split(" ");
                      for (var i = 0; i < splitClass.length; i++) {
                        floatSubmenuInnerElm.classList.add(splitClass[i]);
                      }
                    }
                  }
                  floatSubmenu.setAttribute("data-offset-top", targetTop);
                  floatSubmenu.setAttribute("data-menu-offset-top", targetTop);
                  floatSubmenuInnerElm.innerHTML = targetMenuHtml;
                }

                var targetSubmenuHeight = document.querySelector(
                  "#app-sidebar-float-submenu"
                ).clientHeight;
                var floatSubmenuElm = document.querySelector(
                  "#app-sidebar-float-submenu"
                );
                var floatSubmenuArrowElm = document.querySelector(
                  "#app-sidebar-float-submenu-arrow"
                );
                var floatSubmenuLineElm = document.querySelector(
                  "#app-sidebar-float-submenu-line"
                );
                if (windowHeight - targetTop > targetSubmenuHeight) {
                  if (floatSubmenuElm) {
                    floatSubmenuElm.style.top = targetTop + "px";
                    floatSubmenuElm.style.left = targetLeft + "px";
                    floatSubmenuElm.style.bottom = "auto";
                    floatSubmenuElm.style.right = targetRight + "px";
                  }
                  if (floatSubmenuArrowElm) {
                    floatSubmenuArrowElm.style.top = "20px";
                    floatSubmenuArrowElm.style.bottom = "auto";
                  }
                  if (floatSubmenuLineElm) {
                    floatSubmenuLineElm.style.top = "20px";
                    floatSubmenuLineElm.style.bottom = "auto";
                  }
                } else {
                  var arrowBottom = windowHeight - targetTop - 21;
                  if (floatSubmenuElm) {
                    floatSubmenuElm.style.top = "auto";
                    floatSubmenuElm.style.left = targetLeft + "px";
                    floatSubmenuElm.style.bottom = 0;
                    floatSubmenuElm.style.right = targetRight + "px";
                  }
                  if (floatSubmenuArrowElm) {
                    floatSubmenuArrowElm.style.top = "auto";
                    floatSubmenuArrowElm.style.bottom = arrowBottom + "px";
                  }
                  if (floatSubmenuLineElm) {
                    floatSubmenuLineElm.style.top = "20px";
                    floatSubmenuLineElm.style.bottom = arrowBottom + "px";
                  }
                }
                handleSidebarMinifyFloatMenuClick();
              } else {
                document
                  .querySelector("#app-sidebar-float-submenu-line")
                  .remove();
                appSidebarFloatSubmenuDom = "";
              }
            }
          };
          elm.onmouseleave = function () {
            var elm = document.querySelector(".app");
            if (elm && elm.classList.contains("app-sidebar-minified")) {
              appSidebarFloatSubmenuTimeout = setTimeout(() => {
                var elm = document.querySelector(
                  "#app-sidebar-float-submenu-line"
                );
                if (elm) {
                  elm.remove();
                }
                appSidebarFloatSubmenuDom = "";
              }, 250);
            }
          };
          return true;
        });
      }
    }

    handleSidebarMinifyFloatMenu();
  }

  render() {
    return (
      <AppSettings.Consumer>
        {({
          toggleAppSidebarMinify,
          toggleAppSidebarMobile,
          appSidebarTransparent,
          appSidebarGrid,
          toggleMinifyItself,
          toggleMinifyLeave,
        }) => (
          <React.Fragment>
            <div
              id="sidebar"
              className={"app-sidebar shadow-sm mt-3 overflow-auto"}
            >

                <SidebarNav />
                <SidebarMinifyBtn />

            </div>
            <div className="app-sidebar-bg"></div>
            <div className="app-sidebar-mobile-backdrop">
              <Link
                to="/"
                onClick={toggleAppSidebarMobile}
                className="stretched-link"
              ></Link>
            </div>
          </React.Fragment>
        )}
      </AppSettings.Consumer>
    );
  }
}

// const Sidebar = () => {
//   return (
//     <>
//       <nav
//         id="sidenav-6"
//         class="fixed left-0 top-0 z-[1035] h-screen w-60 -translate-x-full overflow-hidden bg-white shadow-[0_4px_12px_0_rgba(0,0,0,0.07),_0_2px_4px_rgba(0,0,0,0.05)] data-[te-sidenav-hidden='false']:translate-x-0 dark:bg-zinc-800"
//         data-te-sidenav-init
//         data-te-sidenav-hidden="false"
//         data-te-sidenav-accordion="true"
//       >
//         <ul class="relative mt-5 list-none px-[0.2rem]" data-te-sidenav-menu-ref>
//           <li class="relative">
//             <a
//               class="flex h-12 cursor-pointer items-center truncate rounded-[5px] px-6 py-4 text-[0.875rem] text-gray-600 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
//               data-te-sidenav-link-ref
//             >
//               <span class="mr-4 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-gray-400 dark:[&>svg]:text-gray-300">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke-width="1.5"
//                   stroke="currentColor"
//                   class="h-4 w-4"
//                 >
//                   <path
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                     d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
//                   />
//                 </svg>
//               </span>
//               <span>Link 1</span>
//             </a>
//           </li>
//           <li class="relative">
//             <a
//               class="flex h-12 cursor-pointer items-center truncate rounded-[5px] px-6 py-4 text-[0.875rem] text-gray-600 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
//               data-te-sidenav-link-ref
//             >
//               <span class="mr-4 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-gray-400 dark:[&>svg]:text-gray-300">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 24 24"
//                   fill="currentColor"
//                   class="h-4 w-4"
//                 >
//                   <path
//                     fill-rule="evenodd"
//                     d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm2.023 6.828a.75.75 0 10-1.06-1.06 3.75 3.75 0 01-5.304 0 .75.75 0 00-1.06 1.06 5.25 5.25 0 007.424 0z"
//                     clip-rule="evenodd"
//                   />
//                 </svg>
//               </span>
//               <span>Category 1</span>
//               <span
//                 class="absolute right-0 ml-auto mr-[0.8rem] transition-transform duration-300 ease-linear motion-reduce:transition-none [&>svg]:text-gray-600 dark:[&>svg]:text-gray-300"
//                 data-te-sidenav-rotate-icon-ref
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                   class="h-5 w-5"
//                 >
//                   <path
//                     fill-rule="evenodd"
//                     d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
//                     clip-rule="evenodd"
//                   />
//                 </svg>
//               </span>
//             </a>
//             <ul
//               class="!visible relative m-0 hidden list-none p-0 data-[te-collapse-show]:block "
//               data-te-sidenav-collapse-ref
//             >
//               <li class="relative">
//                 <a
//                   class="flex h-6 cursor-pointer items-center truncate rounded-[5px] py-4 pl-[3.4rem] pr-6 text-[0.78rem] text-gray-600 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
//                   data-te-sidenav-link-ref
//                 >
//                   Link 2
//                 </a>
//               </li>
//               <li class="relative">
//                 <a
//                   class="flex h-6 cursor-pointer items-center truncate rounded-[5px] py-4 pl-[3.4rem] pr-6 text-[0.78rem] text-gray-600 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
//                   data-te-sidenav-link-ref
//                 >
//                   Link 3
//                 </a>
//               </li>
//             </ul>
//           </li>
//           <li class="relative">
//             <a
//               class="flex h-12 cursor-pointer items-center truncate rounded-[5px] px-6 py-4 text-[0.875rem] text-gray-600 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
//               data-te-sidenav-link-ref
//             >
//               <span class="mr-4 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-gray-400 dark:[&>svg]:text-gray-300">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 24 24"
//                   fill="currentColor"
//                   class="h-4 w-4"
//                 >
//                   <path
//                     fill-rule="evenodd"
//                     d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm2.023 6.828a.75.75 0 10-1.06-1.06 3.75 3.75 0 01-5.304 0 .75.75 0 00-1.06 1.06 5.25 5.25 0 007.424 0z"
//                     clip-rule="evenodd"
//                   />
//                 </svg>
//               </span>
//               <span>Category 2</span>
//               <span
//                 class="absolute right-0 ml-auto mr-[0.8rem] transition-transform duration-300 ease-linear motion-reduce:transition-none [&>svg]:text-gray-600 dark:[&>svg]:text-gray-300"
//                 data-te-sidenav-rotate-icon-ref
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                   class="h-5 w-5"
//                 >
//                   <path
//                     fill-rule="evenodd"
//                     d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
//                     clip-rule="evenodd"
//                   />
//                 </svg>
//               </span>
//             </a>
//             <ul
//               class="show !visible relative m-0 hidden list-none p-0 data-[te-collapse-show]:block "
//               data-te-sidenav-collapse-ref
//             >
//               <li class="relative">
//                 <a
//                   class="flex h-6 cursor-pointer items-center truncate rounded-[5px] py-4 pl-[3.4rem] pr-6 text-[0.78rem] text-gray-600 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
//                   data-te-sidenav-link-ref
//                 >
//                   Link 4
//                 </a>
//               </li>
//               <li class="relative">
//                 <a
//                   class="flex h-6 cursor-pointer items-center truncate rounded-[5px] py-4 pl-[3.4rem] pr-6 text-[0.78rem] text-gray-600 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
//                   data-te-sidenav-link-ref
//                 >
//                   Link 5
//                 </a>
//               </li>
//             </ul>
//           </li>
//         </ul>
//         <hr class="my-4" />
//         <ul class="relative m-0 list-none px-[0.2rem]" data-te-sidenav-menu-ref>
//           <li class="relative">
//             <a
//               class="flex h-12 cursor-pointer items-center truncate rounded-[5px] px-6 py-4 text-[0.875rem] text-gray-600 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
//               data-te-sidenav-link-ref
//             >
//               <span class="mr-4 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-gray-400 dark:[&>svg]:text-gray-300">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke-width="1.5"
//                   stroke="currentColor"
//                   class="h-4 w-4"
//                 >
//                   <path
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                     d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
//                   />
//                 </svg>
//               </span>
//               <span>Link 6</span>
//             </a>
//           </li>
//           <li class="relative">
//             <a
//               class="flex h-12 cursor-pointer items-center truncate rounded-[5px] px-6 py-4 text-[0.875rem] text-gray-600 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
//               data-te-sidenav-link-ref
//             >
//               <span class="mr-4 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-gray-400 dark:[&>svg]:text-gray-300">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 24 24"
//                   fill="currentColor"
//                   class="h-4 w-4"
//                 >
//                   <path
//                     fill-rule="evenodd"
//                     d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm2.023 6.828a.75.75 0 10-1.06-1.06 3.75 3.75 0 01-5.304 0 .75.75 0 00-1.06 1.06 5.25 5.25 0 007.424 0z"
//                     clip-rule="evenodd"
//                   />
//                 </svg>
//               </span>
//               <span>Category 3</span>
//               <span
//                 class="absolute right-0 ml-auto mr-[0.8rem] transition-transform duration-300 ease-linear motion-reduce:transition-none [&>svg]:text-gray-600 dark:[&>svg]:text-gray-300"
//                 data-te-sidenav-rotate-icon-ref
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                   class="h-5 w-5"
//                 >
//                   <path
//                     fill-rule="evenodd"
//                     d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
//                     clip-rule="evenodd"
//                   />
//                 </svg>
//               </span>
//             </a>
//             <ul
//               class="!visible relative m-0 hidden list-none p-0 data-[te-collapse-show]:block "
//               data-te-sidenav-collapse-ref
//             >
//               <li class="relative">
//                 <a
//                   class="flex h-6 cursor-pointer items-center truncate rounded-[5px] py-4 pl-[3.4rem] pr-6 text-[0.78rem] text-gray-600 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
//                   data-te-sidenav-link-ref
//                 >
//                   Link 7
//                 </a>
//               </li>
//               <li class="relative">
//                 <a
//                   class="flex h-6 cursor-pointer items-center truncate rounded-[5px] py-4 pl-[3.4rem] pr-6 text-[0.78rem] text-gray-600 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
//                   data-te-sidenav-link-ref
//                 >
//                   Link 8
//                 </a>
//               </li>
//             </ul>
//           </li>
//           <li class="relative">
//             <a
//               class="flex h-12 cursor-pointer items-center truncate rounded-[5px] px-6 py-4 text-[0.875rem] text-gray-600 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
//               data-te-sidenav-link-ref
//             >
//               <span class="mr-4 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-gray-400 dark:[&>svg]:text-gray-300">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 24 24"
//                   fill="currentColor"
//                   class="h-4 w-4"
//                 >
//                   <path
//                     fill-rule="evenodd"
//                     d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm2.023 6.828a.75.75 0 10-1.06-1.06 3.75 3.75 0 01-5.304 0 .75.75 0 00-1.06 1.06 5.25 5.25 0 007.424 0z"
//                     clip-rule="evenodd"
//                   />
//                 </svg>
//               </span>
//               <span>Category 4</span>
//               <span
//                 class="absolute right-0 ml-auto mr-[0.8rem] transition-transform duration-300 ease-linear motion-reduce:transition-none [&>svg]:text-gray-600 dark:[&>svg]:text-gray-300"
//                 data-te-sidenav-rotate-icon-ref
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                   class="h-5 w-5"
//                 >
//                   <path
//                     fill-rule="evenodd"
//                     d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
//                     clip-rule="evenodd"
//                   />
//                 </svg>
//               </span>
//             </a>
//             <ul
//               class="show !visible relative m-0 hidden list-none p-0 data-[te-collapse-show]:block "
//               data-te-sidenav-collapse-ref
//             >
//               <li class="relative">
//                 <a
//                   class="flex h-6 cursor-pointer items-center truncate rounded-[5px] py-4 pl-[3.4rem] pr-6 text-[0.78rem] text-gray-600 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
//                   data-te-sidenav-link-ref
//                 >
//                   Link 9
//                 </a>
//               </li>
//               <li class="relative">
//                 <a
//                   class="flex h-6 cursor-pointer items-center truncate rounded-[5px] py-4 pl-[3.4rem] pr-6 text-[0.78rem] text-gray-600 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
//                   data-te-sidenav-link-ref
//                 >
//                   Link 10
//                 </a>
//               </li>
//             </ul>
//           </li>
//         </ul>
//       </nav>

//       <button
//         class="mt-10 inline-block rounded bg-primary px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg"
//         data-te-sidenav-toggle-ref
//         data-te-target="#sidenav-6"
//         aria-controls="#sidenav-6"
//         aria-haspopup="true"
//       >
//         <span class="block [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-white">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 24 24"
//             fill="currentColor"
//             class="h-5 w-5"
//           >
//             <path
//               fill-rule="evenodd"
//               d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
//               clip-rule="evenodd"
//             />
//           </svg>
//         </span>
//       </button>
//     </>
//   );
// };

export default Sidebar;
