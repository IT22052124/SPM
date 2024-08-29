import Product from "./pages/Products/AddProduct";
import Test from "./pages/Products/AddProduct";
import { MdOutlineInventory2 } from "react-icons/md";

const dashboardRoutes = [
  {
    upgrade: true,
    path: "/product",
    name: "Product",
    icon: MdOutlineInventory2,
    component: Product,
    layout: "/admin",
  },
  {
    path: "/Test",
    name: "Test",
    icon: MdOutlineInventory2 ,
    component: Test,
    layout: "/admin",
  },
];

export default dashboardRoutes;
