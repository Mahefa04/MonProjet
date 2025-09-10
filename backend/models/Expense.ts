import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface ExpenseAttributes {
  id: number;
  amount: number;
  description?: string;
  userId: number;
  categoryId: number;
}

interface ExpenseCreationAttributes extends Optional<ExpenseAttributes, "id"> {}

export class Expense extends Model<ExpenseAttributes, ExpenseCreationAttributes>
  implements ExpenseAttributes {
  public id!: number;
  public amount!: number;
  public description?: string;
  public userId!: number;
  public categoryId!: number;
}

Expense.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "expenses",
  }
);
