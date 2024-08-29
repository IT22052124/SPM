import { Component } from "react";

class Footer extends Component {
  render() {
    return (
      <footer className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex flex-col lg:flex-row justify-between items-center">
            <ul className="flex space-x-4 mb-4 lg:mb-0">
              <li>
                <a
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Company
                </a>
              </li>
              <li>
                <a
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Portfolio
                </a>
              </li>
              <li>
                <a
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Blog
                </a>
              </li>
            </ul>
            <p className="text-center text-gray-600">
              © {new Date().getFullYear()}{" "}
              <a
                href="http://www.creative-tim.com"
                className="text-blue-500 hover:text-blue-700"
              >
                Creative Tim
              </a>
              , made with love for a better web
            </p>
          </nav>
        </div>
      </footer>
    );
  }
}

export default Footer;
