(function(document, api) {
  "use strict";

  var ROOT_CATEGORY = "MLM1055";
  var category = document.getElementById("category");
  var model = document.getElementById("model");
  var capacity = document.getElementById("capacity");
  var status = document.getElementById("status");
  var result = document.getElementById("result");
  var estimatedValue = document.getElementById("estimated-value");

  function setStatus(message) {
    status.textContent = message || "";
  }

  function populate(select, items, placeholder) {
    select.replaceChildren(new Option(placeholder, ""));
    items.forEach(function(item) {
      select.add(new Option(item.name, item.id));
    });
    select.disabled = items.length === 0;
  }

  async function loadChildren(categoryId, select, placeholder) {
    setStatus("Consultando categorías…");
    try {
      var response = await api.getCategory(categoryId);
      var children = Array.isArray(response.children_categories) ? response.children_categories : [];
      populate(select, children, placeholder);
      return children;
    } catch {
      setStatus("No fue posible consultar Mercado Libre. Intenta de nuevo.");
      populate(select, [], placeholder);
      return [];
    } finally {
      if (!status.textContent.startsWith("No fue")) {
        setStatus("");
      }
    }
  }

  async function calculate() {
    if (!capacity.value) {
      return;
    }
    result.hidden = true;
    setStatus("Calculando estimación…");
    var condition = document.querySelector("input[name=condition]:checked").value;
    try {
      var response = await api.getProducts(capacity.value, condition);
      var value = api.estimate(Array.isArray(response.results) ? response.results : []);
      if (value === null) {
        setStatus("No hay información disponible para este producto.");
        return;
      }
      estimatedValue.textContent = new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN"
      }).format(value);
      result.hidden = false;
      setStatus("");
    } catch {
      setStatus("No fue posible consultar Mercado Libre. Intenta de nuevo.");
    }
  }

  category.addEventListener("change", async function() {
    populate(model, [], "Selecciona un modelo");
    populate(capacity, [], "Selecciona una capacidad");
    result.hidden = true;
    if (category.value) {
      await loadChildren(category.value, model, "Selecciona un modelo");
    }
  });

  model.addEventListener("change", async function() {
    populate(capacity, [], "Selecciona una capacidad");
    result.hidden = true;
    if (!model.value) {
      return;
    }
    var children = await loadChildren(model.value, capacity, "Selecciona una capacidad");
    if (children.length === 0) {
      populate(capacity, [{ id: model.value, name: model.selectedOptions[0].text }], "Selecciona una capacidad");
      capacity.value = model.value;
      await calculate();
    }
  });

  capacity.addEventListener("change", calculate);
  document.querySelectorAll("input[name=condition]").forEach(function(input) {
    input.addEventListener("change", calculate);
  });

  loadChildren(ROOT_CATEGORY, category, "Selecciona una categoría");
}(document, globalThis.CuantoVale));
