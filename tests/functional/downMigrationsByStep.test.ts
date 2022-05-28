import * as request from "supertest";
import { expressUmzug } from "../../src/";
import * as express from "express";
import { getUmzugOptions } from "../utils";
import { v4 as uuid } from "uuid";
let app: express.Express;

describe("GET /migrations/down/step/:count", () => {
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
      .post("/migrations/down/step/1");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid secret key");
  });

  it("should return with 404", async () => {
    const response = await request(app)
      .post("/migrations/down/step/")
      .set("x-secret-key", "randomsecretkey");

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(`Couldn't find migration to apply with name "step"`);
  });

  it("should undo 2 migrations", async () => {
    await request(app)
      .post("/migrations/up")
      .set("x-secret-key", "randomsecretkey");

    let executedMigrations = await request(app)
      .get("/migrations/executed")
      .set("x-secret-key", "randomsecretkey");

    expect(executedMigrations.status).toBe(200);
    expect(executedMigrations.body.executed.length).toBe(3);
    expect(executedMigrations.body.executed[0].name).toBe(migration1);
    expect(executedMigrations.body.executed[1].name).toBe(migration2);
    expect(executedMigrations.body.executed[2].name).toBe(migration3);

    const undoMigrations = await request(app)
      .post("/migrations/down/step/2")
      .set("x-secret-key", "randomsecretkey");

    expect(undoMigrations.status).toBe(200);
    expect(undoMigrations.body.migrations.length).toBe(2);
    expect(undoMigrations.body.migrations[0].name).toBe(migration3);
    expect(undoMigrations.body.migrations[1].name).toBe(migration2);

    executedMigrations = await request(app)
      .get("/migrations/executed")
      .set("x-secret-key", "randomsecretkey");

    expect(executedMigrations.status).toBe(200);
    expect(executedMigrations.body.executed.length).toBe(1);
    expect(executedMigrations.body.executed[0].name).toBe(migration1);
  });

  it("should undo 1 migration", async () => {
    let executedMigrations = await request(app)
      .get("/migrations/executed")
      .set("x-secret-key", "randomsecretkey");

    expect(executedMigrations.status).toBe(200);
    expect(executedMigrations.body.executed.length).toBe(1);
    expect(executedMigrations.body.executed[0].name).toBe(migration1);

    const undoMigrations = await request(app)
      .post("/migrations/down/step/1")
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
});

describe("GET /my-app/migrations/down/step/:count", () => {
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
      .post("/my-app/migrations/down/step/1");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid secret key");
  });

  it("should return with 404", async () => {
    const response = await request(app)
      .post("/my-app/migrations/down/step/")
      .set("x-secret-key", "randomsecretkey");

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(`Couldn't find migration to apply with name "step"`);
  });

  it("should undo 2 migrations", async () => {
    await request(app)
      .post("/my-app/migrations/up")
      .set("x-secret-key", "randomsecretkey");

    let executedMigrations = await request(app)
      .get("/my-app/migrations/executed")
      .set("x-secret-key", "randomsecretkey");

    expect(executedMigrations.status).toBe(200);
    expect(executedMigrations.body.executed.length).toBe(3);
    expect(executedMigrations.body.executed[0].name).toBe(migration1);
    expect(executedMigrations.body.executed[1].name).toBe(migration2);
    expect(executedMigrations.body.executed[2].name).toBe(migration3);

    const undoMigrations = await request(app)
      .post("/my-app/migrations/down/step/2")
      .set("x-secret-key", "randomsecretkey");

    expect(undoMigrations.status).toBe(200);
    expect(undoMigrations.body.migrations.length).toBe(2);
    expect(undoMigrations.body.migrations[0].name).toBe(migration3);
    expect(undoMigrations.body.migrations[1].name).toBe(migration2);

    executedMigrations = await request(app)
      .get("/my-app/migrations/executed")
      .set("x-secret-key", "randomsecretkey");

    expect(executedMigrations.status).toBe(200);
    expect(executedMigrations.body.executed.length).toBe(1);
    expect(executedMigrations.body.executed[0].name).toBe(migration1);
  });

  it("should undo 1 migration", async () => {
    let executedMigrations = await request(app)
      .get("/my-app/migrations/executed")
      .set("x-secret-key", "randomsecretkey");

    expect(executedMigrations.status).toBe(200);
    expect(executedMigrations.body.executed.length).toBe(1);
    expect(executedMigrations.body.executed[0].name).toBe(migration1);

    const undoMigrations = await request(app)
      .post("/my-app/migrations/down/step/1")
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
});