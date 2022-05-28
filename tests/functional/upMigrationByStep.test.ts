import * as request from "supertest";
import { expressUmzug } from "../../src";
import * as express from "express";
import { getUmzugOptions } from "../utils";
import { v4 as uuid } from "uuid";
let app: express.Express;

describe("GET /migrations/up/step/:count", () => {
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
      .post("/migrations/up/step/1");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid secret key");
  });

  it("should return with 404", async () => {
    const response = await request(app)
      .post("/migrations/up/step/")
      .set("x-secret-key", "randomsecretkey");

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(`Couldn't find migration to apply with name "step"`);
  });

  it("should execute 2 migrations", async () => {
    let pendingMigrations = await request(app)
      .get("/migrations/pending")
      .set("x-secret-key", "randomsecretkey");

    expect(pendingMigrations.status).toBe(200);
    expect(pendingMigrations.body.pending.length).toBe(3);
    expect(pendingMigrations.body.pending[0].name).toBe(migration1);
    expect(pendingMigrations.body.pending[1].name).toBe(migration2);
    expect(pendingMigrations.body.pending[2].name).toBe(migration3);

    const executeMigrations = await request(app)
      .post("/migrations/up/step/2")
      .set("x-secret-key", "randomsecretkey");

    expect(executeMigrations.status).toBe(200);
    expect(executeMigrations.body.migrations.length).toBe(2);
    expect(executeMigrations.body.migrations[0].name).toBe(migration1);
    expect(executeMigrations.body.migrations[1].name).toBe(migration2);

    pendingMigrations = await request(app)
      .get("/migrations/pending")
      .set("x-secret-key", "randomsecretkey");

    expect(pendingMigrations.status).toBe(200);
    expect(pendingMigrations.body.pending.length).toBe(1);
    expect(pendingMigrations.body.pending[0].name).toBe(migration3);
  });

  it("should execute 1 migration", async () => {
    let pendingMigrations = await request(app)
      .get("/migrations/pending")
      .set("x-secret-key", "randomsecretkey");

    expect(pendingMigrations.status).toBe(200);
    expect(pendingMigrations.body.pending.length).toBe(1);
    expect(pendingMigrations.body.pending[0].name).toBe(migration3);

    const executeMigrations = await request(app)
      .post("/migrations/up/step/1")
      .set("x-secret-key", "randomsecretkey");

    expect(executeMigrations.status).toBe(200);
    expect(executeMigrations.body.migrations.length).toBe(1);
    expect(executeMigrations.body.migrations[0].name).toBe(migration3);

    pendingMigrations = await request(app)
      .get("/migrations/pending")
      .set("x-secret-key", "randomsecretkey");

    expect(pendingMigrations.status).toBe(200);
    expect(pendingMigrations.body.pending.length).toBe(0);
    expect(pendingMigrations.body.pending[0]).toBe(undefined);
  });
});

describe("GET /my-app/migrations/up/step/:count", () => {
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
      .post("/my-app/migrations/up/step/1");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid secret key");
  });

  it("should return with 404", async () => {
    const response = await request(app)
      .post("/my-app/migrations/up/step/")
      .set("x-secret-key", "randomsecretkey");

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(`Couldn't find migration to apply with name "step"`);
  });

  it("should execute 2 migrations", async () => {
    let pendingMigrations = await request(app)
      .get("/my-app/migrations/pending")
      .set("x-secret-key", "randomsecretkey");

    expect(pendingMigrations.status).toBe(200);
    expect(pendingMigrations.body.pending.length).toBe(3);
    expect(pendingMigrations.body.pending[0].name).toBe(migration1);
    expect(pendingMigrations.body.pending[1].name).toBe(migration2);
    expect(pendingMigrations.body.pending[2].name).toBe(migration3);

    const executeMigrations = await request(app)
      .post("/my-app/migrations/up/step/2")
      .set("x-secret-key", "randomsecretkey");

    expect(executeMigrations.status).toBe(200);
    expect(executeMigrations.body.migrations.length).toBe(2);
    expect(executeMigrations.body.migrations[0].name).toBe(migration1);
    expect(executeMigrations.body.migrations[1].name).toBe(migration2);

    pendingMigrations = await request(app)
      .get("/my-app/migrations/pending")
      .set("x-secret-key", "randomsecretkey");

    expect(pendingMigrations.status).toBe(200);
    expect(pendingMigrations.body.pending.length).toBe(1);
    expect(pendingMigrations.body.pending[0].name).toBe(migration3);
  });

  it("should execute 1 migration", async () => {
    let pendingMigrations = await request(app)
      .get("/my-app/migrations/pending")
      .set("x-secret-key", "randomsecretkey");

    expect(pendingMigrations.status).toBe(200);
    expect(pendingMigrations.body.pending.length).toBe(1);
    expect(pendingMigrations.body.pending[0].name).toBe(migration3);

    const executeMigrations = await request(app)
      .post("/my-app/migrations/up/step/1")
      .set("x-secret-key", "randomsecretkey");

    expect(executeMigrations.status).toBe(200);
    expect(executeMigrations.body.migrations.length).toBe(1);
    expect(executeMigrations.body.migrations[0].name).toBe(migration3);

    pendingMigrations = await request(app)
      .get("/my-app/migrations/pending")
      .set("x-secret-key", "randomsecretkey");

    expect(pendingMigrations.status).toBe(200);
    expect(pendingMigrations.body.pending.length).toBe(0);
    expect(pendingMigrations.body.pending[0]).toBe(undefined);
  });
});