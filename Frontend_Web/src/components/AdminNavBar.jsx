import { useLocation } from "react-router-dom";
import { useState } from "react";
import routes from "../routes.jsx";

function Header() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const mobileSidebarToggle = (e) => {
    e.preventDefault();
    document.documentElement.classList.toggle("nav-open");
    var node = document.createElement("div");
    node.id = "bodyClick";
    node.onclick = function () {
      this.parentElement.removeChild(this);
      document.documentElement.classList.toggle("nav-open");
    };
    document.body.appendChild(node);
  };

  const getBrandText = () => {
    for (let i = 0; i < routes.length; i++) {
      if (location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto flex justify-between items-center py-3 px-4 lg:px-8">
        <div className="flex items-center">
          <button
            onClick={mobileSidebarToggle}
            className="lg:hidden text-gray-800 focus:outline-none"
          >
            <i className="fas fa-ellipsis-v text-xl"></i>
          </button>
          <a
            href="#home"
            onClick={(e) => e.preventDefault()}
            className="text-xl font-semibold text-gray-800 ml-4 lg:ml-0"
          >
            {getBrandText()}
          </a>
        </div>

        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-800 focus:outline-none"
          >
            <span className="block w-6 h-0.5 bg-gray-800 mb-1"></span>
            <span className="block w-6 h-0.5 bg-gray-800 mb-1"></span>
            <span className="block w-6 h-0.5 bg-gray-800"></span>
          </button>
        </div>

        <div
          className={`${
            isOpen ? "block" : "hidden"
          } lg:flex flex-col lg:flex-row lg:items-center w-full lg:w-auto`}
        >
          <ul className="flex flex-col lg:flex-row lg:space-x-4">
            <li className="relative">
              <a
                href="#pablo"
                onClick={(e) => e.preventDefault()}
                className="text-gray-800 hover:text-gray-600 flex items-center"
              >
                <i className="nc-icon nc-palette"></i>
                <span className="lg:hidden ml-2">Dashboard</span>
              </a>
            </li>
            <li className="relative">
              <div className="dropdown">
                <button
                  className="relative text-gray-800 hover:text-gray-600 flex items-center"
                  id="dropdown-67443507"
                >
                  <i className="nc-icon nc-planet"></i>
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-1">
                    5
                  </span>
                  <span className="lg:hidden ml-2">Notification</span>
                </button>
                <div className="dropdown-menu absolute hidden text-gray-700 pt-2">
                  <a
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    className="block px-4 py-2 bg-white hover:bg-gray-100"
                  >
                    Notification 1
                  </a>
                  <a
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    className="block px-4 py-2 bg-white hover:bg-gray-100"
                  >
                    Notification 2
                  </a>
                  <a
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    className="block px-4 py-2 bg-white hover:bg-gray-100"
                  >
                    Notification 3
                  </a>
                  <a
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    className="block px-4 py-2 bg-white hover:bg-gray-100"
                  >
                    Notification 4
                  </a>
                  <a
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    className="block px-4 py-2 bg-white hover:bg-gray-100"
                  >
                    Another notification
                  </a>
                </div>
              </div>
            </li>
            <li>
              <a
                href="#pablo"
                onClick={(e) => e.preventDefault()}
                className="text-gray-800 hover:text-gray-600 flex items-center"
              >
                <i className="nc-icon nc-zoom-split"></i>
                <span className="lg:block hidden ml-2">Search</span>
              </a>
            </li>
          </ul>
          <ul className="flex flex-col lg:flex-row lg:space-x-4 ml-auto">
            <li>
              <a
                href="#pablo"
                onClick={(e) => e.preventDefault()}
                className="text-gray-800 hover:text-gray-600"
              >
                Account
              </a>
            </li>
            <li className="relative">
              <div className="dropdown">
                <button
                  className="text-gray-800 hover:text-gray-600"
                  id="navbarDropdownMenuLink"
                >
                  Dropdown
                </button>
                <div className="dropdown-menu absolute hidden text-gray-700 pt-2">
                  <a
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    className="block px-4 py-2 bg-white hover:bg-gray-100"
                  >
                    Action
                  </a>
                  <a
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    className="block px-4 py-2 bg-white hover:bg-gray-100"
                  >
                    Another action
                  </a>
                  <a
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    className="block px-4 py-2 bg-white hover:bg-gray-100"
                  >
                    Something
                  </a>
                  <a
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    className="block px-4 py-2 bg-white hover:bg-gray-100"
                  >
                    Something else here
                  </a>
                  <div className="border-t border-gray-200 my-1"></div>
                  <a
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    className="block px-4 py-2 bg-white hover:bg-gray-100"
                  >
                    Separated link
                  </a>
                </div>
              </div>
            </li>
            <li>
              <a
                href="#pablo"
                onClick={(e) => e.preventDefault()}
                className="text-gray-800 hover:text-gray-600"
              >
                Log out
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
