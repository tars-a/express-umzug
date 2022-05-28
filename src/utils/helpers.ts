import { Request, Response } from "express";
import { IExpressUmzugOptions, UmzugOptions } from "../types";

const helpers = {
  /* 
  *  @param {umzugOptions} options to configure Umzug
  *  @param {opts} options to configure Express Umzug
  *  @description sanitize the option object passed to configure Umzug
  */
  sanitizeUmzugOptions: (umzugOptions: UmzugOptions<object>, opts: IExpressUmzugOptions) => {
    const { storage, context, logger, migrations } = umzugOptions;
    return {
      migrations: migrations || opts.umzugOptions.migrations,
      context: context || opts.umzugOptions.context,
      logger: logger || opts.umzugOptions.logger,
      storage: storage || opts.umzugOptions.storage,
    };
  },

  /* 
  *  @param {request} request object from Express
  *  @param {optionsSecretKey} secret key passed into the options
  *  @description retrieve the secret key from the header and compare it to the secret key passed into the options
  */
  compareSecretKey: (request: Request, optionsSecretKey: string) => {
    const requestHeaders = request.headers;
    const requestSecretKey = requestHeaders["x-secret-key"];
    if (requestSecretKey === optionsSecretKey) {
      return true;
    }
    return false;
  },

  /* 
  *  @param {response} response object from Express
  *  @description send unauthorized response
  */
  sendUnauthorized: (response: Response) => {
    return response.status(401).json({
      message: "Invalid secret key",
    });
  },

  /* 
  *  @param {response} response object from Express
  *  @param {error} error object from catch block
  *  @description send error response
  */
  sendError: (response: Response, error: Error) => {
    return response.status(500).json({
      message: error.message,
    });
  },
};

export default helpers;