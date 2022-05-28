import * as request from "supertest";
import { expressUmzug } from "../../src";
import * as express from "express";
import { getUmzugOptions } from "../utils";
import { v4 as uuid } from "uuid";
let app: express.Express;

describe("GET /migrations/up", () => {
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
      .post("/migrations/up");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid secret key");
  });

  it("should execute all the migrations", async () => {
    const response = await request(app)
      .post("/migrations/up")
      .set("x-secret-key", "randomsecretkey");

    expect(response.status).toBe(200);
    expect(response.body.migrations.length).toBe(3);
    expect(response.body.migrations[0].name).toBe(migration1);
    expect(response.body.migrations[1].name).toBe(migration2);
    expect(response.body.migrations[2].name).toBe(migration3);
  });

  it("should not execute any migrations", async () => {
    const response = await request(app)
      .post("/migrations/up")
      .set("x-secret-key", "randomsecretkey");

    expect(response.status).toBe(200);
    expect(response.body.migrations.length).toBe(0);
  });
});

describe("GET /my-app/migrations/up", () => {
  const migration1 = `${uuid()}-test-migration`;
  const migration2 = `${uuid()}-test-migration`;
  const migration3 = `${uuid()}-test-migration`;

  beforeEach(() => {
    app = express();
    app.use(expressUmzug({
      secretKey: "randomsecretkey",
      umzugOptions: getUmzugOptions([migration1, migration2, migration3]),
      basePath: "/my-app"
    }));
  });

  it("should return with 401", async () => {
    const response = await request(app)
      .post("/my-app/migrations/up");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid secret key");
  });

  it("should execute all the migrations", async () => {
    const response = await request(app)
      .post("/my-app/migrations/up")
      .set("x-secret-key", "randomsecretkey");

    expect(response.status).toBe(200);
    expect(response.body.migrations.length).toBe(3);
    expect(response.body.migrations[0].name).toBe(migration1);
    expect(response.body.migrations[1].name).toBe(migration2);
    expect(response.body.migrations[2].name).toBe(migration3);
  });

  it("should not execute any migrations", async () => {
    const response = await request(app)
      .post("/my-app/migrations/up")
      .set("x-secret-key", "randomsecretkey");

    expect(response.status).toBe(200);
    expect(response.body.migrations.length).toBe(0);
  });
});