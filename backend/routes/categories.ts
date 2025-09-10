import { Router, Request, Response } from "express";
import { Category } from "../models/Category";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { body, validationResult } from "express-validator";

const router = Router();

// ✅ Créer une catégorie
router.post(
  "/",
  authMiddleware,
  body("name").notEmpty().withMessage("Le nom de la catégorie est obligatoire"),
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name } = req.body;

    try {
      const category = await Category.create({ name, userId: req.user?.id });
      res.status(201).json(category);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
);

// ✅ Récupérer toutes les catégories
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const categories = await Category.findAll({ where: { userId: req.user?.id } });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ✅ Mettre à jour une catégorie
router.put(
  "/:id",
  authMiddleware,
  body("name").notEmpty().withMessage("Le nom est obligatoire"),
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { id } = req.params;
    const { name } = req.body;

    try {
      const category = await Category.findOne({ where: { id, userId: req.user?.id } });
      if (!category) return res.status(404).json({ message: "Catégorie non trouvée" });

      category.name = name;
      await category.save();
      res.json(category);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
);

// ✅ Supprimer une catégorie
router.delete("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const category = await Category.findOne({ where: { id, userId: req.user?.id } });
    if (!category) return res.status(404).json({ message: "Catégorie non trouvée" });

    await category.destroy();
    res.json({ message: "Catégorie supprimée" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
