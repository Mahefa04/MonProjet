import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface IncomeAttributes {
  id: number;
  amount: number;
  description?: string;
  userId: number;
}

interface IncomeCreationAttributes extends Optional<IncomeAttributes, "id"> {}

export class Income extends Model<IncomeAttributes, IncomeCreationAttributes>
  implements IncomeAttributes {
  public id!: number;
  public amount!: number;
  public description?: string;
  public userId!: number;
}

Income.init(
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
  },
  {
    sequelize,
    tableName: "incomes",
  }
);
