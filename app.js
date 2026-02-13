const API_URL = "https://script.google.com/macros/s/AKfycbzyLM3OH5HQ0yqrSCpT9uv2iZL1DjJLzMO5eUXl7uJam_IBDhZJw1om3kizz1kS05LP/exec";
const REFRESH_INTERVAL = 60000;

async function fetchData() {
  try {
    const response = await fetch(API_URL + "?t=" + new Date().getTime());
    if (!response.ok) throw new Error("Erreur HTTP");

    const data = await response.json();
    displayCards(data);
    updateLastRefresh();

  } catch (error) {
    document.getElementById("cards-container").innerHTML =
      `<div class="empty">Erreur de chargement</div>`;
  }
}

function displayCards(data) {
  const container = document.getElementById("cards-container");
  container.innerHTML = "";

  if (!data || data.length === 0) {
    container.innerHTML = `<div class="empty">Aucun départ</div>`;
    return;
  }

  data.forEach(row => {
    const card = document.createElement("div");
    card.className = "card";

    // ⚠️ adapte les noms EXACTS des colonnes de ton Sheet ici :
    const client = row["Destination"] || "";
    const date = row["Date"] || "";
    const chauffeur = row["Chargement"] || "";
    const statut = row["Statut"] || "";

    card.innerHTML = `
      <h3>${client}</h3>
      <div class="info">📅 ${date}</div>
      <div class="info">👷 ${chauffeur}</div>
      <div class="status ${getStatusClass(statut)}">${statut}</div>
    `;

    container.appendChild(card);
  });
}

function getStatusClass(statut) {
  if (!statut) return "";

  const s = statut.toLowerCase();

  if (s.includes("FAUX")) return "en-attente";
  if (s.includes("VRAI")) return "parti";

  return "";
}

function updateLastRefresh() {
  const now = new Date();
  const timeString = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit"
  });

  document.getElementById("last-update").textContent =
    "Maj : " + timeString;
}

function manualRefresh() {
  fetchData();
}

fetchData();
setInterval(fetchData, REFRESH_INTERVAL);







