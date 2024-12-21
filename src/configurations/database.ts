import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const {
  PROD_DB_NAME,
  PROD_DB_PORT,
  PROD_DB_USERNAME,
  PROD_DB_HOST,
  PROD_DB_PASSWORD,
  PROD_DB_SSL
} = process.env;

export const database = new Sequelize(
  PROD_DB_NAME!,
  PROD_DB_USERNAME!,
  PROD_DB_PASSWORD as string,
  {
    host: PROD_DB_HOST,
    port: PROD_DB_PORT as unknown as number,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: PROD_DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    },
  }
);
