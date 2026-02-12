const API_URL = "https://script.google.com/macros/library/d/1LBlp2pcouWliPZZp1ISJjjWKQerlwvQcUJOBhLUlEXGAHlH8GUL-kP2V/1";

async function fetchData() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    displayTable(data);

  } catch (error) {
    document.getElementById("table-container").innerHTML = 
      "<p>Erreur de chargement</p>";
  }
}

function displayTable(data) {

  if (data.length === 0) {
    document.getElementById("table-container").innerHTML = 
      "<p>Aucune donnée</p>";
    return;
  }

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  // Headers dynamiques
  const headers = Object.keys(data[0]);
  const headerRow = document.createElement("tr");

  headers.forEach(header => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);

  // Lignes
  data.forEach(row => {
    const tr = document.createElement("tr");

    headers.forEach(header => {
      const td = document.createElement("td");
      td.textContent = row[header] ?? "";
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  table.appendChild(thead);
  table.appendChild(tbody);

  const container = document.getElementById("table-container");
  container.innerHTML = "";
  container.appendChild(table);
}

fetchData();

