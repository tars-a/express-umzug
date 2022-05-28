import * as express from "express";
import {
  Umzug,
  MongoDBStorage as UmzugMongoDBStorage,
  memoryStorage as UmzugMemoryStoreage,
  JSONStorage as UmzugJSONStorage,
  SequelizeStorage as UmzugSequelizeStorage,
} from "umzug";
import handlers from "./handlers";
import DataStore from "./utils/DataStore";
import { IExpressUmzugOptions } from "./types";
import helpers from "./utils/helpers";
import { ALL, COUNT, DEFAULT_PATH, DOWN, EXECUTED, ID, PENDING, STEP, UP } from "./constants";
let umzug;

/* 
  @param {object} options to configure Express Umzug
  @description main function for Express Umzug
*/
export const expressUmzug = (options: IExpressUmzugOptions<object>) => {
  const opts: IExpressUmzugOptions<object> = {
    umzugOptions: {
      migrations: { glob: "migrations/*.js" },
      context: null,
      storage: null,
      logger: console,
    },
    basePath: "",
    secretKey: "",
  };
  if (options && typeof options === "object") {
    const { umzugOptions, secretKey: optionsSecretKey } = options;
    opts.umzugOptions = helpers.sanitizeUmzugOptions(umzugOptions, opts);
    opts.secretKey = optionsSecretKey;
    if (!opts.secretKey) {
      throw new Error("secretKey is required");
    }
    if (!opts.umzugOptions.context) {
      throw new Error("context is required");
    }
    if (!opts.umzugOptions.storage) {
      throw new Error("storage is required");
    }
    if (options.basePath) {
      opts.basePath = options.basePath;
    }
  } else {
    throw new Error("options must be an object");
  }

  umzug = new Umzug({
    context: opts.umzugOptions.context,
    logger: opts.umzugOptions.logger,
    migrations: opts.umzugOptions.migrations,
    storage: opts.umzugOptions.storage,
  });
  const router = express.Router();
  const { secretKey } = opts;
  const dataStore = new DataStore();
  dataStore.set("secretKey", secretKey);
  dataStore.set("umzug", umzug);
  const {
    getAll,
    getPending,
    getExecuted,
    upMigration,
    downMigration,
    upMigrationById,
    downMigrationById,
    upMigrationByCount,
    downMigrationByCount
  } = handlers(dataStore);
  const basePath = opts.basePath;

  router.get(`${basePath}/${DEFAULT_PATH}/${ALL}`, getAll);
  router.get(`${basePath}/${DEFAULT_PATH}/${PENDING}`, getPending);
  router.get(`${basePath}/${DEFAULT_PATH}/${EXECUTED}`, getExecuted);
  router.post(`${basePath}/${DEFAULT_PATH}/${UP}`, upMigration);
  router.post(`${basePath}/${DEFAULT_PATH}/${DOWN}`, downMigration);
  router.post(`${basePath}/${DEFAULT_PATH}/${UP}/${ID}`, upMigrationById);
  router.post(`${basePath}/${DEFAULT_PATH}/${DOWN}/${ID}`, downMigrationById);
  router.post(`${basePath}/${DEFAULT_PATH}/${UP}/${STEP}/${COUNT}`, upMigrationByCount);
  router.post(`${basePath}/${DEFAULT_PATH}/${DOWN}/${STEP}/${COUNT}`, downMigrationByCount);
  return router;
};

export const SequelizeStorage = UmzugSequelizeStorage;
export const MongoDBStorage = UmzugMongoDBStorage;
export const JSONStorage = UmzugJSONStorage;
export const MemoryStorage = UmzugMemoryStoreage;
