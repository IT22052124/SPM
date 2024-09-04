import AddProduct from "./pages/Products/AddProduct";
import AddLoyalty from "./pages/Loyalty/AddLoyalty";
import { MdOutlineInventory2 } from "react-icons/md";

const dashboardRoutes = [
  {
    path: "/product",
    name: "Product",
    icon: MdOutlineInventory2,
    component: AddProduct, // This should point to the correct component
    layout: "/admin",
  },
  {
    path: "/billing",
    name: "Billing",
    icon: MdOutlineInventory2,
    component: AddProduct, // This should point to the correct component
    layout: "/cashier",
  },
  {
    path: "/loyalty",
    name: "Add loyalty",
    icon: MdOutlineInventory2,
    component: AddLoyalty, // This should point to the correct component
    layout: "/cashier",
  },
];

export default dashboardRoutes;
