import express from "express";

import {
  createInvoice,
  listInvoice,
} from "../Controller/invoice-controllers.js";

const router = express.Router();

router.post("/new", createInvoice);
router.get("/", listInvoice);

export default router;
