import { InputMigrations, LogFn, UmzugStorage } from "umzug";

export interface UmzugOptions<Ctx> {
  context: Ctx,
  logger?: Record<'info' | 'warn' | 'error' | 'debug', LogFn>,
  migrations?: InputMigrations<Ctx>,
  storage: UmzugStorage<Ctx>,
}

export interface IExpressUmzugOptions<Ctx extends object = object> {
  secretKey: string;
  basePath?: string;
  umzugOptions: UmzugOptions<Ctx>;
}