import * as request from "supertest";
import { expressUmzug } from "../../src";
import * as express from "express";
import { getUmzugOptions } from "../utils";
import { v4 as uuid } from "uuid";
let app: express.Express;

describe("GET /migrations/up/:id", () => {
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
      .post(`/migrations/up/${migration1}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid secret key");
  });

  it(`should execute the migration with id ${migration1}`, async () => {
    const response = await request(app)
      .post(`/migrations/up/${migration1}`)
      .set("x-secret-key", "randomsecretkey");

    expect(response.status).toBe(200);
    expect(response.body.migrations.length).toBe(1);
    expect(response.body.migrations[0].name).toBe(migration1);
  });

  it(`should execute the migration until id ${migration3}`, async () => {
    const response = await request(app)
      .post(`/migrations/up/${migration3}`)
      .set("x-secret-key", "randomsecretkey");

    expect(response.status).toBe(200);
    expect(response.body.migrations.length).toBe(2);
    expect(response.body.migrations[0].name).toBe(migration2);
    expect(response.body.migrations[1].name).toBe(migration3);
  });

  it("should throw error while executing migration which was already executed", async () => {
    const response = await request(app)
      .post(`/migrations/up/${migration1}`)
      .set("x-secret-key", "randomsecretkey");

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(`Couldn't find migration to apply with name "${migration1}"`);
  });
});

describe("GET /my-app/migrations/up/:id", () => {
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
      .post(`/my-app/migrations/up/${migration1}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid secret key");
  });

  it(`should execute the migration with id ${migration1}`, async () => {
    const response = await request(app)
      .post(`/my-app/migrations/up/${migration1}`)
      .set("x-secret-key", "randomsecretkey");

    expect(response.status).toBe(200);
    expect(response.body.migrations.length).toBe(1);
    expect(response.body.migrations[0].name).toBe(migration1);
  });

  it(`should execute the migration until id ${migration3}`, async () => {
    const response = await request(app)
      .post(`/my-app/migrations/up/${migration3}`)
      .set("x-secret-key", "randomsecretkey");

    expect(response.status).toBe(200);
    expect(response.body.migrations.length).toBe(2);
    expect(response.body.migrations[0].name).toBe(migration2);
    expect(response.body.migrations[1].name).toBe(migration3);
  });

  it("should throw error while executing migration which was already executed", async () => {
    const response = await request(app)
      .post(`/my-app/migrations/up/${migration1}`)
      .set("x-secret-key", "randomsecretkey");

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(`Couldn't find migration to apply with name "${migration1}"`);
  });
});