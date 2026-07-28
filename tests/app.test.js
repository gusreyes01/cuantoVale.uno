import { JSDOM } from "jsdom";
import fs from "node:fs";
import { describe, expect, test, vi } from "vitest";

describe("CuantoVale application", () => {
  test("loads categories and reports empty product results", async () => {
    const dom = new JSDOM(fs.readFileSync("app/index.html", "utf8"), {
      runScripts: "outside-only",
      url: "https://example.test/app/"
    });
    const api = {
      getCategory: vi.fn()
        .mockResolvedValueOnce({
          children_categories: [{ id: "phones", name: "Teléfonos" }]
        })
        .mockResolvedValueOnce({
          children_categories: [{ id: "phone-model", name: "Modelo" }]
        })
        .mockResolvedValueOnce({ children_categories: [] }),
      getProducts: vi.fn(async () => ({ results: [] })),
      estimate: vi.fn(() => null)
    };
    Object.assign(dom.window, { CuantoVale: api });
    dom.window.eval(fs.readFileSync("app/js/app.js", "utf8"));
    await new Promise(resolve => setTimeout(resolve, 10));

    const category = dom.window.document.getElementById("category");
    expect(category.options).toHaveLength(2);
    category.value = "phones";
    category.dispatchEvent(new dom.window.Event("change"));
    await new Promise(resolve => setTimeout(resolve, 0));

    const model = dom.window.document.getElementById("model");
    model.value = "phone-model";
    model.dispatchEvent(new dom.window.Event("change"));
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(dom.window.document.getElementById("status").textContent)
      .toMatch(/No hay información/);
  });
});
