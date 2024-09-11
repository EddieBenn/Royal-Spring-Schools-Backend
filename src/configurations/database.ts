import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config()

const {
    DATABASE_NAME,
    DATABASE_HOST,
    DATABASE_USERNAME,
    DATABSE_PASSWORD,
} = process.env

export const database = new Sequelize(
    DATABASE_NAME!,
    DATABASE_USERNAME!,
    DATABSE_PASSWORD as string,
  {
    host: DATABASE_HOST,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      encrypt: true,
    },
  }
);