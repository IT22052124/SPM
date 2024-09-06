import AddProduct from "./pages/Products/AddProduct";
import AddLoyalty from "./pages/Loyalty/AddLoyalty";
import AddPromotion from "./pages/Promotions/AddPromotion";
import { MdOutlineInventory2 } from "react-icons/md";
import ProductList from "./pages/Products/ProductList";
import PromotionList from "./pages/Promotions/PromotionList";

const dashboardRoutes = [
  {
    path: "/productList/Add",
    name: "Product",
    icon: MdOutlineInventory2,
    component: AddProduct, // This should point to the correct component
    layout: "/admin",
  },
  {
    path: "/productList",
    name: "Product List Temp",
    icon: MdOutlineInventory2,
    component: ProductList, // This should point to the correct component
    layout: "/admin",
  },
  {
    path: "/promotion/Add",
    name: "Promtions",
    icon: MdOutlineInventory2,
    component: AddPromotion, // This should point to the correct component
    layout: "/admin",
  },
  {
    path: "/promotionList",
    name: "Promtion List Temp",
    icon: MdOutlineInventory2,
    component: PromotionList, // This should point to the correct component
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
