import * as request from "supertest";
import { expressUmzug } from "../../src";
import * as express from "express";
import { getUmzugOptions } from "../utils";
import { v4 as uuid } from "uuid";
let app: express.Express;

describe("GET /migrations/pending", () => {
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
      .get("/migrations/pending");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid secret key");
  });

  it("should return pending migrations", async () => {
    const response = await request(app)
      .get("/migrations/pending")
      .set("x-secret-key", "randomsecretkey");

    expect(response.status).toBe(200);
    expect(response.body.pending.length).toBe(3);
    expect(response.body.pending[0].name).toBe(migration1);
    expect(response.body.pending[1].name).toBe(migration2);
  });

  it("should return pending migrations after executing a migration", async () => {
    await request(app)
      .post("/migrations/up/step/1")
      .set("x-secret-key", "randomsecretkey");

    const response = await request(app)
      .get("/migrations/pending")
      .set("x-secret-key", "randomsecretkey");

    expect(response.status).toBe(200);
    expect(response.body.pending.length).toBe(2);
    expect(response.body.pending[0].name).toBe(migration2);
    expect(response.body.pending[1].name).toBe(migration3);
  });

  it("should return pending migration after undoing migrations", async () => {
    await request(app)
      .post("/migrations/down/step/1")
      .set("x-secret-key", "randomsecretkey");

    const response = await request(app)
      .get("/migrations/pending")
      .set("x-secret-key", "randomsecretkey");

    expect(response.status).toBe(200);
    expect(response.body.pending.length).toBe(3);
    expect(response.body.pending[0].name).toBe(migration1);
    expect(response.body.pending[1].name).toBe(migration2);
    expect(response.body.pending[2].name).toBe(migration3);
  });
});

describe("GET /my-app/migrations/pending", () => {
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
      .get("/my-app/migrations/pending");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid secret key");
  });

  it("should return pending migrations", async () => {
    const response = await request(app)
      .get("/my-app/migrations/pending")
      .set("x-secret-key", "randomsecretkey");

    expect(response.status).toBe(200);
    expect(response.body.pending.length).toBe(3);
    expect(response.body.pending[0].name).toBe(migration1);
    expect(response.body.pending[1].name).toBe(migration2);
  });

  it("should return pending migrations after executing a migration", async () => {
    await request(app)
      .post("/my-app/migrations/up/step/1")
      .set("x-secret-key", "randomsecretkey");

    const response = await request(app)
      .get("/my-app/migrations/pending")
      .set("x-secret-key", "randomsecretkey");

    expect(response.status).toBe(200);
    expect(response.body.pending.length).toBe(2);
    expect(response.body.pending[0].name).toBe(migration2);
    expect(response.body.pending[1].name).toBe(migration3);
  });

  it("should return pending migration after undoing migrations", async () => {
    await request(app)
      .post("/my-app/migrations/down/step/1")
      .set("x-secret-key", "randomsecretkey");

    const response = await request(app)
      .get("/my-app/migrations/pending")
      .set("x-secret-key", "randomsecretkey");

    expect(response.status).toBe(200);
    expect(response.body.pending.length).toBe(3);
    expect(response.body.pending[0].name).toBe(migration1);
    expect(response.body.pending[1].name).toBe(migration2);
    expect(response.body.pending[2].name).toBe(migration3);
  });
});