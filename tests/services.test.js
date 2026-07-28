import { createRequire } from "node:module";
import { describe, expect, test, vi } from "vitest";

const require = createRequire(import.meta.url);
const api = require("../app/js/services.js");

describe("CuantoVale services", () => {
  test("computes a 90% resale estimate from product prices", () => {
    expect(api.estimate([{ price: 100 }, { price: 200 }])).toBe(135);
    expect(api.estimate([])).toBeNull();
    expect(api.estimate(null)).toBeNull();
  });

  test("encodes category paths and checks HTTP failures", async () => {
    const fetchImpl = vi.fn(async url => ({
      ok: true,
      json: async () => ({ url })
    }));

    const response = await api.getCategory("phone/tablet", fetchImpl);
    expect(response.url).toContain("/categories/phone%2Ftablet");

    await expect(api.getCategory("MLM1055", async () => ({
      ok: false,
      status: 503
    }))).rejects.toThrow(/503/);
  });

  test("uses structured product query parameters", async () => {
    const fetchImpl = vi.fn(async url => ({
      ok: true,
      json: async () => ({ url })
    }));

    const response = await api.getProducts("MLM 1055", "used", fetchImpl);
    const url = new URL(response.url);
    expect(url.searchParams.get("category")).toBe("MLM 1055");
    expect(url.searchParams.get("condition")).toBe("used");
    expect(url.searchParams.get("limit")).toBe("50");
  });

  test("rejects missing category identifiers", () => {
    expect(() => api.getCategory("")).toThrow(/categoryId/);
  });
});
