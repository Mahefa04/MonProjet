import { User } from "./User";
import { Expense } from "./Expense";
import { Income } from "./Income";
import { Category } from "./Category";

// Associations

// 🔹 Un utilisateur peut avoir plusieurs dépenses
User.hasMany(Expense, { foreignKey: "userId", as: "expenses" });
Expense.belongsTo(User, { foreignKey: "userId", as: "user" });

// 🔹 Un utilisateur peut avoir plusieurs revenus
User.hasMany(Income, { foreignKey: "userId", as: "incomes" });
Income.belongsTo(User, { foreignKey: "userId", as: "user" });

// 🔹 Un utilisateur peut avoir plusieurs catégories
User.hasMany(Category, { foreignKey: "userId", as: "categories" });
Category.belongsTo(User, { foreignKey: "userId", as: "user" });

// 🔹 Une catégorie peut avoir plusieurs dépenses
Category.hasMany(Expense, { foreignKey: "categoryId", as: "expenses" });
Expense.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

export { User, Expense, Income, Category };
