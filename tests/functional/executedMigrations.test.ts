import * as request from "supertest";
import { expressUmzug } from "../../src/";
import * as express from "express";
import { getUmzugOptions } from "../utils";
import { v4 as uuid } from "uuid";
let app: express.Express;

describe("GET /migrations/executed", () => {
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
      .get("/migrations/executed");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid secret key");
  });

  it("should return executed migrations", async () => {
    const response = await request(app)
      .get("/migrations/executed")
      .set("x-secret-key", "randomsecretkey");

    expect(response.status).toBe(200);
    expect(response.body.executed.length).toBe(0);
  });

  it("should return executed migrations after executing a migration", async () => {
    await request(app)
      .post("/migrations/up/step/1")
      .set("x-secret-key", "randomsecretkey");

    const response = await request(app)
      .get("/migrations/executed")
      .set("x-secret-key", "randomsecretkey");

    expect(response.status).toBe(200);
    expect(response.body.executed.length).toBe(1);
    expect(response.body.executed[0].name).toBe(migration1);
  });

  it("should return executed migration after undoing migrations", async () => {
    await request(app)
      .post("/migrations/down/step/1")
      .set("x-secret-key", "randomsecretkey");

    const response = await request(app)
      .get("/migrations/executed")
      .set("x-secret-key", "randomsecretkey");

    expect(response.status).toBe(200);
    expect(response.body.executed.length).toBe(0);
  });
});

describe("GET /my-app/migrations/executed", () => {
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
      .get("/my-app/migrations/executed");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid secret key");
  });

  it("should return executed migrations", async () => {
    const response = await request(app)
      .get("/my-app/migrations/executed")
      .set("x-secret-key", "randomsecretkey");

    expect(response.status).toBe(200);
    expect(response.body.executed.length).toBe(0);
  });

  it("should return executed migrations after executing a migration", async () => {
    await request(app)
      .post("/my-app/migrations/up/step/1")
      .set("x-secret-key", "randomsecretkey");

    const response = await request(app)
      .get("/my-app/migrations/executed")
      .set("x-secret-key", "randomsecretkey");

    expect(response.status).toBe(200);
    expect(response.body.executed.length).toBe(1);
    expect(response.body.executed[0].name).toBe(migration1);
  });

  it("should return executed migration after undoing migrations", async () => {
    await request(app)
      .post("/my-app/migrations/down/step/1")
      .set("x-secret-key", "randomsecretkey");

    const response = await request(app)
      .get("/my-app/migrations/executed")
      .set("x-secret-key", "randomsecretkey");

    expect(response.status).toBe(200);
    expect(response.body.executed.length).toBe(0);
  });
});