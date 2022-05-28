import { Request, Response } from "express";
import { Umzug } from "umzug";
import DataStore from "./utils/DataStore";
import helpers from "./utils/helpers";
const { compareSecretKey, sendError, sendUnauthorized } = helpers;

export default (dataStore: DataStore) => {
  const umzug = dataStore.get("umzug") as Umzug;
  const secretKey = dataStore.get("secretKey") as string;
  return {
    getAll: async (request: Request, response: Response) => {
      const isAuthorized = compareSecretKey(request, secretKey);
      if (isAuthorized) {
        try {
          const pending = await umzug.pending();
          const executed = await umzug.executed();
          return response.status(200).json({
            all: [...executed, ...pending],
          });
        } catch (error) {
          return sendError(response, error);
        }
      } else {
        return sendUnauthorized(response);
      }
    },
    getPending: async (request: Request, response: Response) => {
      const isAuthorized = compareSecretKey(request, secretKey);
      if (isAuthorized) {
        try {
          const pending = await umzug.pending();
          response.status(200).json({
            pending,
          });
        } catch (error) {
          return sendError(response, error);
        }
      } else {
        sendUnauthorized(response);
      }
    },
    getExecuted: async (request: Request, response: Response) => {
      const isAuthorized = compareSecretKey(request, secretKey);
      if (isAuthorized) {
        try {
          const executed = await umzug.executed();
          response.status(200).json({
            executed,
          });
        } catch (error) {
          return sendError(response, error);
        }
      } else {
        sendUnauthorized(response);
      }
    },
    upMigration: async (request: Request, response: Response) => {
      const isAuthorized = compareSecretKey(request, secretKey);
      if (isAuthorized) {
        try {
          const migrations = await umzug.up();
          response.status(200).json({
            migrations,
          });
        } catch (error) {
          console.log("error", error);
          return sendError(response, error);
        }
      } else {
        sendUnauthorized(response);
      }
    },
    downMigration: async (request: Request, response: Response) => {
      const isAuthorized = compareSecretKey(request, secretKey);
      if (isAuthorized) {
        try {
          const migrations = await umzug.down();
          response.status(200).json({
            migrations,
          });
        } catch (error) {
          return sendError(response, error);
        }
      } else {
        sendUnauthorized(response);
      }
    },
    upMigrationById: async (request: Request, response: Response) => {
      const { id } = request.params;
      const isAuthorized = compareSecretKey(request, secretKey);
      if (isAuthorized) {
        try {
          const to = { to: id };
          const migrations = await umzug.up(to);
          response.status(200).json({
            migrations,
          });
        } catch (error) {
          return sendError(response, error);
        }
      } else {
        sendUnauthorized(response);
      }
    },
    downMigrationById: async (request: Request, response: Response) => {
      const { id } = request.params;
      const isAuthorized = compareSecretKey(request, secretKey);
      if (isAuthorized) {
        try {
          const to = { to: id };
          const migrations = await umzug.down(to);
          response.status(200).json({
            migrations,
          });
        } catch (error) {
          return sendError(response, error);
        }
      } else {
        sendUnauthorized(response);
      }
    },
    upMigrationByCount: async (request: Request, response: Response) => {
      const { count: countParam } = request.params;
      const count = (countParam as unknown) as number;
      const isAuthorized = compareSecretKey(request, secretKey);
      if (isAuthorized) {
        const step = { step: count };
        try {
          const migrations = await umzug.up(step);
          response.status(200).json({
            migrations,
          });
        } catch (error) {
          return sendError(response, error);
        }
      } else {
        sendUnauthorized(response);
      }
    },
    downMigrationByCount: async (request: Request, response: Response) => {
      const { count: countParam } = request.params;
      const count = (countParam as unknown) as number;
      const isAuthorized = compareSecretKey(request, secretKey);
      if (isAuthorized) {
        try {
          const step = { step: count };
          const migrations = await umzug.down(step);
          response.status(200).json({
            migrations,
          });
        } catch (error) {
          return sendError(response, error);
        }
      } else {
        sendUnauthorized(response);
      }
    },
  };
};