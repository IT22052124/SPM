import AddProduct from "./pages/Products/AddProduct";
import AddLoyalty from "./pages/Loyalty/AddLoyalty";
import AddPromotion from "./pages/Promotions/AddPromotion";
import { MdOutlineInventory2, MdOutlineLocalOffer } from "react-icons/md";
import { MdOutlineLoyalty } from "react-icons/md";
import ProductList from "./pages/Products/ProductList";
import PromotionList from "./pages/Promotions/PromotionList";
import UpdateProduct from "./pages/Products/UpdateProduct";
import UpdatePromotion from "./pages/Promotions/UpdatePromotion";
import Billing from "./pages/Billing/Billing";
import ProductReport from "./pages/Products/ProductReport";
import LoyaltyReport from "./pages/Loyalty/LoyaltyReport";
import { FaMoneyBill1 } from "react-icons/fa6";
import { HiOutlineDocumentReport } from "react-icons/hi";

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
    path: "/productList/Update/:productId",
    name: "Update Product",
    icon: MdOutlineInventory2,
    component: UpdateProduct,
    layout: "/admin",
    showInSidebar: false, // Set this to false
  },
  {
    path: "/promotionList",
    name: "Promotions",
    icon: MdOutlineLocalOffer,
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
    path: "/promotionList/Update/:promotionId",
    name: "Update Promotion",
    icon: MdOutlineInventory2,
    component: UpdatePromotion,
    layout: "/admin",
    showInSidebar: false, // Set this to false
  },
  {
    path: "/loyalty",
    name: "Loyalty",
    icon: MdOutlineLoyalty,
    component: AddLoyalty,
    layout: "/cashier",
    showInSidebar: true,
  },
  {
    path: "/billing",
    name: "Billing",
    icon: FaMoneyBill1,
    component: Billing,
    layout: "/cashier",
    showInSidebar: true,
  },
  {
    path: "/Reports",
    name: "Report",
    icon: HiOutlineDocumentReport,
    layout: "/admin",
    showInSidebar: true,
    subRoutes: [
      {
        path: "/Reports/productReport",
        name: "Product Report",
        icon: HiOutlineDocumentReport,
        component: ProductReport,
        layout: "/admin",
        showInSidebar: true,
      },
      {
        path: "/Reports/LoyaltyReport",
        name: "Loyalty Report",
        icon: HiOutlineDocumentReport,
        component: LoyaltyReport,
        layout: "/admin",
        showInSidebar: true,
      },
    ],
  },
];

export default dashboardRoutes;
