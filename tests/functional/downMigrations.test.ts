import * as request from "supertest";
import { expressUmzug } from "../../src";
import * as express from "express";
import { getUmzugOptions } from "../utils";
import { v4 as uuid } from "uuid";

let app: express.Express;

describe("GET /migrations/down", () => {
  const migration1 = `${uuid()}-test-migration`;
  const migration2 = `${uuid()}-test-migration`;
  const migration3 = `${uuid()}-test-migration`;

  beforeEach(() => {
    app = express();
    app.use(expressUmzug({
      secretKey: "randomsecretkey",
      umzugOptions: getUmzugOptions([migration1, migration2, migration3]),
    }));
  });

  it("should return with 401", async () => {
    const response = await request(app)
      .post("/migrations/down");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid secret key");
  });

  it("should undo the last migration", async () => {
    const executeMigrations = await request(app)
      .post("/migrations/up")
      .set("x-secret-key", "randomsecretkey");

    expect(executeMigrations.status).toBe(200);
    expect(executeMigrations.body.migrations.length).toBe(3);
    expect(executeMigrations.body.migrations[0].name).toBe(migration1);
    expect(executeMigrations.body.migrations[1].name).toBe(migration2);
    expect(executeMigrations.body.migrations[2].name).toBe(migration3);

    const pendingMigrations = await request(app)
      .get("/migrations/pending")
      .set("x-secret-key", "randomsecretkey");

    expect(pendingMigrations.status).toBe(200);
    expect(pendingMigrations.body.pending.length).toBe(0);
    expect(pendingMigrations.body.pending[0]).toBe(undefined);

    let undoMigrations = await request(app)
      .post("/migrations/down")
      .set("x-secret-key", "randomsecretkey");

    expect(undoMigrations.status).toBe(200);
    expect(undoMigrations.body.migrations.length).toBe(1);
    expect(undoMigrations.body.migrations[0].name).toBe(migration3);

    let executedMigrations = await request(app)
      .get("/migrations/executed")
      .set("x-secret-key", "randomsecretkey");

    expect(executedMigrations.status).toBe(200);
    expect(executedMigrations.body.executed.length).toBe(2);
    expect(executedMigrations.body.executed[0].name).toBe(migration1);
    expect(executedMigrations.body.executed[1].name).toBe(migration2);

    undoMigrations = await request(app)
      .post("/migrations/down")
      .set("x-secret-key", "randomsecretkey");

    expect(undoMigrations.status).toBe(200);
    expect(undoMigrations.body.migrations.length).toBe(1);
    expect(undoMigrations.body.migrations[0].name).toBe(migration2);

    executedMigrations = await request(app)
      .get("/migrations/executed")
      .set("x-secret-key", "randomsecretkey");

    expect(executedMigrations.status).toBe(200);
    expect(executedMigrations.body.executed.length).toBe(1);
    expect(executedMigrations.body.executed[0].name).toBe(migration1);

    undoMigrations = await request(app)
      .post("/migrations/down")
      .set("x-secret-key", "randomsecretkey");

    expect(undoMigrations.status).toBe(200);
    expect(undoMigrations.body.migrations.length).toBe(1);
    expect(undoMigrations.body.migrations[0].name).toBe(migration1);

    executedMigrations = await request(app)
      .get("/migrations/executed")
      .set("x-secret-key", "randomsecretkey");

    expect(executedMigrations.status).toBe(200);
    expect(executedMigrations.body.executed.length).toBe(0);
    expect(executedMigrations.body.executed[0]).toBe(undefined);
  });

  it("should not undo any migrations", async () => {
    const response = await request(app)
      .post("/migrations/down")
      .set("x-secret-key", "randomsecretkey");

    expect(response.status).toBe(200);
    expect(response.body.migrations.length).toBe(0);
  });
});

describe("GET my-app/migrations/down", () => {
  const migration1 = `${uuid()}-test-migration`;
  const migration2 = `${uuid()}-test-migration`;
  const migration3 = `${uuid()}-test-migration`;

  beforeEach(() => {
    app = express();
    app.use(expressUmzug({
      secretKey: "randomsecretkey",
      umzugOptions: getUmzugOptions([migration1, migration2, migration3]),
      basePath: "/my-app",
    }));
  });

  it("should return with 401", async () => {
    const response = await request(app)
      .post("/my-app/migrations/down");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid secret key");
  });

  it("should undo the last migration", async () => {
    const executeMigrations = await request(app)
      .post("/my-app/migrations/up")
      .set("x-secret-key", "randomsecretkey");

    expect(executeMigrations.status).toBe(200);
    expect(executeMigrations.body.migrations.length).toBe(3);
    expect(executeMigrations.body.migrations[0].name).toBe(migration1);
    expect(executeMigrations.body.migrations[1].name).toBe(migration2);
    expect(executeMigrations.body.migrations[2].name).toBe(migration3);

    const pendingMigrations = await request(app)
      .get("/my-app/migrations/pending")
      .set("x-secret-key", "randomsecretkey");

    expect(pendingMigrations.status).toBe(200);
    expect(pendingMigrations.body.pending.length).toBe(0);
    expect(pendingMigrations.body.pending[0]).toBe(undefined);

    let undoMigrations = await request(app)
      .post("/my-app/migrations/down")
      .set("x-secret-key", "randomsecretkey");

    expect(undoMigrations.status).toBe(200);
    expect(undoMigrations.body.migrations.length).toBe(1);
    expect(undoMigrations.body.migrations[0].name).toBe(migration3);

    let executedMigrations = await request(app)
      .get("/my-app/migrations/executed")
      .set("x-secret-key", "randomsecretkey");

    expect(executedMigrations.status).toBe(200);
    expect(executedMigrations.body.executed.length).toBe(2);
    expect(executedMigrations.body.executed[0].name).toBe(migration1);
    expect(executedMigrations.body.executed[1].name).toBe(migration2);

    undoMigrations = await request(app)
      .post("/my-app/migrations/down")
      .set("x-secret-key", "randomsecretkey");

    expect(undoMigrations.status).toBe(200);
    expect(undoMigrations.body.migrations.length).toBe(1);
    expect(undoMigrations.body.migrations[0].name).toBe(migration2);

    executedMigrations = await request(app)
      .get("/my-app/migrations/executed")
      .set("x-secret-key", "randomsecretkey");

    expect(executedMigrations.status).toBe(200);
    expect(executedMigrations.body.executed.length).toBe(1);
    expect(executedMigrations.body.executed[0].name).toBe(migration1);

    undoMigrations = await request(app)
      .post("/my-app/migrations/down")
      .set("x-secret-key", "randomsecretkey");

    expect(undoMigrations.status).toBe(200);
    expect(undoMigrations.body.migrations.length).toBe(1);
    expect(undoMigrations.body.migrations[0].name).toBe(migration1);

    executedMigrations = await request(app)
      .get("/my-app/migrations/executed")
      .set("x-secret-key", "randomsecretkey");

    expect(executedMigrations.status).toBe(200);
    expect(executedMigrations.body.executed.length).toBe(0);
    expect(executedMigrations.body.executed[0]).toBe(undefined);
  });

  it("should not undo any migrations", async () => {
    const response = await request(app)
      .post("/my-app/migrations/down")
      .set("x-secret-key", "randomsecretkey");

    expect(response.status).toBe(200);
    expect(response.body.migrations.length).toBe(0);
  });
});