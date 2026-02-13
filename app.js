const API_URL = "https://script.google.com/macros/s/AKfycbzyLM3OH5HQ0yqrSCpT9uv2iZL1DjJLzMO5eUXl7uJam_IBDhZJw1om3kizz1kS05LP/exec";
const REFRESH_INTERVAL = 60000;

let allData = [];

async function fetchData() {
  try {
    const response = await fetch(API_URL + "?t=" + new Date().getTime());
    if (!response.ok) throw new Error("Erreur HTTP");

    allData = await response.json();
    applyFilter();
    updateLastRefresh();

  } catch (error) {
    document.getElementById("cards-container").innerHTML =
      `<div class="empty">Erreur de chargement</div>`;
  }
}

function applyFilter() {
  const filter = document.getElementById("filter-select").value;

  let filtered = allData;

  if (filter === "pending") {
    filtered = allData.filter(row => row["Parti"] === false);
  }

  if (filter === "done") {
    filtered = allData.filter(row => row["Parti"] === true);
  }

  displayCards(filtered);
}

function displayCards(data) {
  const container = document.getElementById("cards-container");
  container.innerHTML = "";

  if (!data || data.length === 0) {
    container.innerHTML = `<div class="empty">Aucun départ</div>`;
    return;
  }

  data.forEach(row => {

    const client = row["Destination"] || "";
    const date = new Date(row["Date"]).toLocaleDateString("fr-FR") || "";//row["Date"] || "";
    const chauffeur = row["Chargement"] || "";
    const parti = row["Parti"] === true ? "Oui" : "Non";

    const card = document.createElement("div");
    card.className = "card";

    // Si déjà parti, griser la carte
    if (row["Parti"] === true) {
      card.style.opacity = "0.5"; // carte grisée
      card.style.backgroundColor = "#e2e8f0"; // fond plus clair
    }
    
    card.innerHTML = `
      <div class="card-left">
      <h3>${client}</h3>
      <div class="info">📅 ${date}</div>
      <div class="info">👷 ${chauffeur}</div>
    </div>
    <div class="card-right">
      <div class="status ${getStatusClass(statut)}">${statut}</div>
      <div class="info">🚚 Parti : ${parti}</div>
    </div>
  `;

    container.appendChild(card);
  });
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

fetchData();
setInterval(fetchData, REFRESH_INTERVAL);




