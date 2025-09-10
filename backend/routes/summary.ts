import { Router, Response } from "express";
import { Expense } from "../models/Expense";
import { Income } from "../models/Income";
import { AuthRequest, authMiddleware } from "../middleware/auth";
import { Op } from "sequelize";

const router = Router();

// Récupérer le résumé mensuel
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const expenses = await Expense.sum("amount", {
      where: {
        userId: req.user?.id,
        createdAt: { [Op.between]: [startOfMonth, endOfMonth] },
      },
    });

    const incomes = await Income.sum("amount", {
      where: {
        userId: req.user?.id,
        createdAt: { [Op.between]: [startOfMonth, endOfMonth] },
      },
    });

    res.json({
      totalExpenses: expenses || 0,
      totalIncomes: incomes || 0,
      balance: (incomes || 0) - (expenses || 0),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
