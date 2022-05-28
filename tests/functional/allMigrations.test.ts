import * as request from "supertest";
import { expressUmzug } from "../../src";
import * as express from "express";
import { getUmzugOptions } from "../utils";
import { v4 as uuid } from "uuid";
let app: express.Express;

describe("GET /migrations/all", () => {
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

  it("should return with 401", () => {
    request(app)
      .get("/migrations/all")
      .end((error, response) => {
        if (error) {
          return error;
        }

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid secret key");
      });
  });

  it("should return all migrations", () => {
    request(app)
      .get("/migrations/all")
      .set("x-secret-key", "randomsecretkey")
      .end((error, response) => {
        if (error) {
          return error;
        }
        expect(response.status).toBe(200);
        expect(response.body.all.length).toBe(3);
        expect(response.body.all[0].name).toBe(migration1);
        expect(response.body.all[1].name).toBe(migration2);
      });
  });
});

describe("GET /my-app/migrations/all", () => {
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

  it("should return with 401", () => {
    request(app)
      .get("/my-app/migrations/all")
      .end((error, response) => {
        if (error) {
          return error;
        }

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid secret key");
      });
  });

  it("should return all migrations", () => {
    request(app)
      .get("/my-app/migrations/all")
      .set("x-secret-key", "randomsecretkey")
      .end((error, response) => {
        if (error) {
          return error;
        }
        expect(response.status).toBe(200);
        expect(response.body.all.length).toBe(3);
        expect(response.body.all[0].name).toBe(migration1);
        expect(response.body.all[1].name).toBe(migration2);
      });
  });
});