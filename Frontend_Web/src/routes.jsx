import AddProduct from "./pages/Products/AddProduct";
import { MdOutlineInventory2 } from "react-icons/md";

const dashboardRoutes = [
  {
    path: "/product",
    name: "Product",
    icon: MdOutlineInventory2,
    component: AddProduct, // This should point to the correct component
    layout: "/admin",
  },
];

export default dashboardRoutes;
