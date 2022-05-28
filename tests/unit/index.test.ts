import { expressUmzug } from "../../src/";

describe("router tests", () => {
  it("should throw secret key is required error", () => {
    expect(() => {
      expressUmzug({
        umzugOptions: {
          context: { sqlClient: {} },
          storage: null,
        },
        secretKey: "",
      });
    }).toThrowError("secretKey is required");
  });

  it("should throw context is required error", () => {
    expect(() => {
      expressUmzug({
        secretKey: "randomsecretkey",
        umzugOptions: {
          context: null,
          storage: null,
        }
      });
    }).toThrowError("context is required");
  });

  it("should throw storage is required error", () => {
    expect(() => {
      expressUmzug({
        secretKey: "randomsecretkey",
        umzugOptions: {
          context: { someContext: {}},
          storage: null,
        }
      });
    }).toThrowError("storage is required");
  });

  it("should throw options must ba an object is required error", () => {
    expect(() => {
      expressUmzug(null);
    }).toThrowError("options must be an object");
  });
});