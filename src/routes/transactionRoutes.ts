import express from "express";
import getTransactionController from "../controllers/getTransaction.controller";

const router = express.Router();

router.get("/getTransactions/:address", getTransactionController);

export default router;
