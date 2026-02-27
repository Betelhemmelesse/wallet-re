import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getSummaryByUserId,
  getTransactionsByUserId,
} from "../controllers/transactionsController.js";

const router = express.Router();

// Specific routes first
router.get("/summary/:userId", getSummaryByUserId);

// General routes after
router.get("/:userId", getTransactionsByUserId);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);

export default router;
