import express from "express";
import userExpenses from "..//controllers/getUserExpenses";

const router = express.Router();

router.get("/expenses/:address", userExpenses);

export default router;
