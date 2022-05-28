import { UmzugOptions } from "../src/types";
import { Sequelize } from "sequelize";
import { SequelizeStorage } from "../src";
const sequelize = new Sequelize({
  dialect: "sqlite",
  database: "database.sqlite",
  logging: false,
});

export const getUmzugOptions = (migrationNames: string[]): UmzugOptions<object> => {
  const up = jest.fn();
  const down = jest.fn();
  const migrations = migrationNames.map(name => ({
    name,
    up,
    down,
  }));

  return {
    migrations,
    context: sequelize,
    storage: new SequelizeStorage({ sequelize })
  }  
}