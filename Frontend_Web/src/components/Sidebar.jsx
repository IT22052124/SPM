/* eslint-disable react/prop-types */
import { useLocation, NavLink } from "react-router-dom";
import Logo from "../assets/Logo.png";

const Sidebar = ({ color, image, routes }) => {
  const location = useLocation();
  const activeRoute = (routeName) => {
    return location.pathname.indexOf(routeName) > -1
      ? "bg-red-300 bg-opacity-30"
      : "";
  };
  return (
    <aside
      className={
        "fixed inset-y-0 flex-wrap items-center justify-between block w-full p-0 my-4 overflow-y-auto antialiased transition-transform duration-200 -translate-x-full bg-white border-0 shadow-xl dark:shadow-none dark:bg-slate-850 max-w-64 ease-nav-brand z-990 xl:ml-6 rounded-2xl xl:left-0 xl:translate-x-0"
      }
    >
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="relative z-10 flex flex-col flex-grow p-4">
        <div className="flex items-center mb-6">
          <a
            href="https://www.creative-tim.com?ref=lbd-sidebar"
            className="inline-flex items-center justify-center w-10 h-10"
          >
            <img src={Logo} alt="Logo" className="w-full h-full" />
          </a>
          <a
            className="ml-4 text-lg font-bold text-black"
            href="http://www.creative-tim.com"
          >
            ShopX
          </a>
        </div>
        <div className="items-center block w-auto max-h-screen overflow-auto h-sidenav grow basis-full">
          <ul className="flex flex-col pl-0 mb-0">
            {routes.map((prop, key) => {
              if (!prop.redirect)
                return (
                  <li
                    className={`${activeRoute(
                      prop.layout + prop.path
                    )} p-3 rounded-lg mt-0.5 w-full flex items-center ${activeRoute(
                      prop.layout + prop.path
                    )==="" ? "hover:bg-white" : ""}  hover:bg-opacity-20 hover:rounded-lg`}
                    key={key}
                  >
                    <NavLink
                      to={prop.layout + prop.path}
                      className="flex items-center w-full"
                    >
                      <div
                        style={{ color: "Black" }}
                        className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5"
                      >
                        {<prop.icon size={20} />}
                      </div>
                      <span className="ml-2 duration-300 text-black opacity-100 pointer-events-none ease">
                        {prop.name}
                      </span>
                    </NavLink>
                  </li>
                );
              return null;
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
