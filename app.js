const API_URL = "https://script.google.com/macros/s/AKfycby0Dc1wmVo7YBNJzJqv90Yv1rvOWfH9En2aWLMlFWdxouqgyzJAKx4WrnaK9L1srZRa/exec";

async function fetchData() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Erreur HTTP " + response.status);

    const data = await response.json();
    displayTable(data);

  } catch (error) {
    document.getElementById("table-container").innerHTML = 
      `<p>Erreur de chargement : ${error.message}</p>`;
    console.error(error);
  }
}

function displayTable(data) {
  if (!data || data.length === 0) {
    document.getElementById("table-container").innerHTML = "<p>Aucune donnée</p>";
    return;
  }

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  // entêtes dynamiques
  const headers = Object.keys(data[0]);
  const headerRow = document.createElement("tr");
  headers.forEach(h => {
    const th = document.createElement("th");
    th.textContent = h;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  // lignes
  data.forEach(row => {
    const tr = document.createElement("tr");
    headers.forEach(h => {
      const td = document.createElement("td");
      td.textContent = row[h] ?? "";
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



