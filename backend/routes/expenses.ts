import { Router, Response } from "express";
import { body, validationResult } from "express-validator";
import { Expense } from "../models/Expense";
import { AuthRequest, authMiddleware } from "../middleware/auth";

const router = Router();

// Type pour le corps de la requête PUT
interface ExpenseUpdateBody {
  amount?: number;
  categoryId?: number;
  description?: string;
}

// Créer une dépense
router.post(
  "/",
  authMiddleware,
  body("amount").isFloat({ gt: 0 }).withMessage("Le montant doit être > 0"),
  body("categoryId").isInt().withMessage("ID de catégorie invalide"),
  body("description").optional().isString(),
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { amount, categoryId, description } = req.body;

    try {
      const expense = await Expense.create({
        amount,
        categoryId,
        description,
        userId: req.user!.id,
      });
      res.status(201).json(expense);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
);

// Lire toutes les dépenses
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const expenses = await Expense.findAll({ where: { userId: req.user!.id } });
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Mettre à jour une dépense
router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { amount, categoryId, description } = req.body as ExpenseUpdateBody;

  try {
    const expense = await Expense.findOne({ where: { id, userId: req.user!.id } });
    if (!expense) return res.status(404).json({ message: "Dépense non trouvée" });

    if (amount !== undefined) expense.amount = amount;
    if (categoryId !== undefined) expense.categoryId = categoryId;
    if (description !== undefined) expense.description = description;

    await expense.save();
    res.json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Supprimer une dépense
router.delete("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const expense = await Expense.findOne({ where: { id, userId: req.user!.id } });
    if (!expense) return res.status(404).json({ message: "Dépense non trouvée" });

    await expense.destroy();
    res.json({ message: "Dépense supprimée" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
