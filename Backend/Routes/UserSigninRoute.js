import express from "express";
import {userLogin} from "../Controller/UserSignin-controller.js"
const router = express.Router();

router.post("/",userLogin)

export default router;