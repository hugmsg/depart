const API_URL = "https://script.google.com/macros/s/AKfycbzyLM3OH5HQ0yqrSCpT9uv2iZL1DjJLzMO5eUXl7uJam_IBDhZJw1om3kizz1kS05LP/exec";
const REFRESH_INTERVAL = 60000; // 60000 ms = 60 secondes (mettre 30000 pour 30s)

let refreshTimer = null;

async function fetchData() {
  try {
    const response = await fetch(API_URL + "?t=" + new Date().getTime()); 
    // ?t= évite le cache

    if (!response.ok) throw new Error("Erreur HTTP " + response.status);

    const data = await response.json();
    displayTable(data);
    updateLastRefresh();

  } catch (error) {
    document.getElementById("table-container").innerHTML =
      `<p>Erreur de chargement : ${error.message}</p>`;
    console.error(error);
  }
}

function displayTable(data) {
  if (!data || data.length === 0) {
    document.getElementById("table-container").innerHTML =
      "<p>Aucune donnée</p>";
    return;
  }

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  const headers = Object.keys(data[0]);

  const headerRow = document.createElement("tr");
  headers.forEach(h => {
    const th = document.createElement("th");
    th.textContent = h;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

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

function updateLastRefresh() {
  const now = new Date();
  const timeString = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit"
  });

  document.getElementById("last-update").textContent =
    "Dernière mise à jour : " + timeString;
}

function manualRefresh() {
  fetchData();
}

// 🔄 Lancement initial
fetchData();

// 🔁 Auto-refresh
refreshTimer = setInterval(fetchData, REFRESH_INTERVAL);
