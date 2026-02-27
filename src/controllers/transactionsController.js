import { sql } from "../config/db.js";

export async function getTransactionsByUserId(req, res) {
  try {
    if (!sql) {
      return res.status(503).json({ 
        message: "Database not available. Please configure DATABASE_URL.",
        error: "Database connection not established"
      });
    }
    
    const { userId } = req.params;
    const transactions = await sql`
        SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY create_at DESC`;

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error getting transactions:", error);
    console.error("Error details:", error.message);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ 
      message: "internal server error",
      error: error.message 
    });
  }
}

export async function createTransaction(req, res) {
  try {
    const { title, amount, catagory, user_id } = req.body;
    if (!title || !user_id || !catagory || amount === undefined) {
      return res.status(400).json({ message: "all fields are required" });
    }

    const transaction = await sql`
        INSERT INTO transactions(user_id,title,amount,catagory)
        VALUES (${user_id},${title},${amount},${catagory})
        RETURNING *`;

    console.log(transaction);
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.log("Error creating the transaction", error);
    res.status(500).json({ message: "internal server error" });
  }
}

export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "invalid transaction ID " });
    }

    const result = await sql`
    DELETE FROM transactions WHERE id = ${id} RETURNING *`;

    if (result.length === 0) {
      return res.status(404).json({ message: "transaction not found" });
    }
    res.status(200).json({ message: "tarnsaction deleted successfully" });
  } catch (error) {
    console.log("Error deleting the transaction", error);
    res.status(500).json({ message: "internal server error" });
  }
}

export async function getSummaryByUserId(req, res) {
  try {
    if (!sql) {
      return res.status(503).json({ 
        message: "Database not available. Please configure DATABASE_URL.",
        error: "Database connection not established"
      });
    }
    
    const { userId } = req.params;

    const balanceResult = await sql`
    SELECT COALESCE(SUM(amount),0) as balance FROM transactions 
    WHERE user_id = ${userId}`; // Fixed: transactions (plural)

    const incomeResult = await sql`
    SELECT COALESCE(SUM(amount),0) as income FROM transactions 
    WHERE user_id = ${userId} AND amount > 0
    `;

    const expensesResult = await sql`
    SELECT COALESCE(SUM(amount),0) as expenses FROM transactions 
    WHERE user_id = ${userId} AND amount < 0 
    `;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses,
    });
  } catch (error) {
    console.error("Error getting summary:", error);
    console.error("Error details:", error.message);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ 
      message: "internal server error",
      error: error.message 
    });
  }
}
