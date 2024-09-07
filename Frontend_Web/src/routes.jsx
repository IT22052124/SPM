import AddProduct from "./pages/Products/AddProduct";
import AddLoyalty from "./pages/Loyalty/AddLoyalty";
import AddPromotion from "./pages/Promotions/AddPromotion";
import { MdOutlineInventory2 } from "react-icons/md";
import ProductList from "./pages/Products/ProductList";
import PromotionList from "./pages/Promotions/PromotionList";

const dashboardRoutes = [
  {
    path: "/productList",
    name: "Product",
    icon: MdOutlineInventory2,
    component: ProductList,
    layout: "/admin",
    showInSidebar: true,
  },
  {
    path: "/productList/add",
    name: "Add Product",
    icon: MdOutlineInventory2,
    component: AddProduct,
    layout: "/admin",
    showInSidebar: false, // Set this to false
  },
  {
    path: "/promotionList",
    name: "Promotions",
    icon: MdOutlineInventory2,
    component: PromotionList,
    layout: "/admin",
    showInSidebar: true,
  },
  {
    path: "/promotionList/add",
    name: "Add Promotion",
    icon: MdOutlineInventory2,
    component: AddPromotion,
    layout: "/admin",
    showInSidebar: false,
  },
  {
    path: "/loyalty",
    name: "Add Loyalty",
    icon: MdOutlineInventory2,
    component: AddLoyalty,
    layout: "/cashier",
    showInSidebar: true,
  },
  {
    path: "/billing",
    name: "Billing",
    icon: MdOutlineInventory2,
    component: AddProduct,
    layout: "/cashier",
    showInSidebar: true,
  },
];

export default dashboardRoutes;
