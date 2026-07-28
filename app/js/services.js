(function(root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.CuantoVale = api;
}(typeof globalThis !== "undefined" ? globalThis : this, function() {
  "use strict";

  var API_BASE_URL = "https://api.mercadolibre.com";
  var RESALE_FACTOR = 0.9;

  function validateCategoryId(categoryId) {
    if (!categoryId || typeof categoryId !== "string") {
      throw new TypeError("categoryId is required");
    }
  }

  async function requestJson(path, params, fetchImpl) {
    var url = new URL(API_BASE_URL + path);
    Object.keys(params || {}).forEach(function(key) {
      url.searchParams.set(key, params[key]);
    });
    var response = await (fetchImpl || fetch)(url.toString(), {
      headers: { Accept: "application/json" }
    });
    if (!response.ok) {
      throw new Error("Mercado Libre request failed with status " + response.status);
    }
    return response.json();
  }

  function getCategory(categoryId, fetchImpl) {
    validateCategoryId(categoryId);
    return requestJson("/categories/" + encodeURIComponent(categoryId), {}, fetchImpl);
  }

  function getProducts(categoryId, condition, fetchImpl) {
    validateCategoryId(categoryId);
    return requestJson("/sites/MLM/search", {
      category: categoryId,
      condition: condition === "used" ? "used" : "new",
      limit: "50"
    }, fetchImpl);
  }

  function estimate(results) {
    if (!Array.isArray(results) || results.length === 0) {
      return null;
    }
    var total = results.reduce(function(sum, product) {
      return sum + (Number(product.price) || 0);
    }, 0);
    return total / results.length * RESALE_FACTOR;
  }

  return {
    getCategory: getCategory,
    getProducts: getProducts,
    estimate: estimate
  };
}));
