import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import categoriesRoutes from "./routes/categories";
import expensesRoutes from "./routes/expenses";
import incomesRoutes from "./routes/incomes";
import summaryRoutes from "./routes/summary";
import { sequelize } from "./models";  // connexion Sequelize

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware pour parser le JSON
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/categories", categoriesRoutes);
app.use("/expenses", expensesRoutes);
app.use("/incomes", incomesRoutes);
app.use("/summary", summaryRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("🚀 API Suivi Dépenses est en marche !");
});

// Lancement du serveur + connexion DB
sequelize.sync().then(() => {
  console.log("✅ Connexion à la base de données OK");
  app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("❌ Erreur de connexion à la base de données :", err);
});
