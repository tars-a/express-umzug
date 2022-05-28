import DataStore from "../../src/utils/DataStore";
const dataStore = new DataStore();

describe("Data Store tests", () => {
  it("should store value in data store", () => {
    dataStore.set("test", "test value");
    expect(dataStore.get("test")).toBe("test value");
  });

  it("should have the property", () => {
    expect(dataStore.has("test")).toBe(true);
  });

  it("should not have the property", () => {
    expect(dataStore.has("test1")).toBe(false);
  });
});