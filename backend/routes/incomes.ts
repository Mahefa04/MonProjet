import { Router, Response } from "express";
import { body, validationResult } from "express-validator";
import { Income } from "../models/Income";
import { AuthRequest, authMiddleware } from "../middleware/auth";

const router = Router();

// Type pour le corps de la requête PUT
interface IncomeUpdateBody {
  amount?: number;
  description?: string;
}

// Créer un revenu
router.post(
  "/",
  authMiddleware,
  body("amount").isFloat({ gt: 0 }).withMessage("Le montant doit être > 0"),
  body("description").optional().isString(),
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { amount, description } = req.body;

    try {
      const income = await Income.create({
        amount,
        description,
        userId: req.user!.id,
      });
      res.status(201).json(income);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
);

// Lire tous les revenus
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const incomes = await Income.findAll({ where: { userId: req.user!.id } });
    res.json(incomes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Mettre à jour un revenu
router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { amount, description } = req.body as IncomeUpdateBody;

  try {
    const income = await Income.findOne({ where: { id, userId: req.user!.id } });
    if (!income) return res.status(404).json({ message: "Revenu non trouvé" });

    if (amount !== undefined) income.amount = amount;
    if (description !== undefined) income.description = description;

    await income.save();
    res.json(income);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Supprimer un revenu
router.delete("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const income = await Income.findOne({ where: { id, userId: req.user!.id } });
    if (!income) return res.status(404).json({ message: "Revenu non trouvé" });

    await income.destroy();
    res.json({ message: "Revenu supprimé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
