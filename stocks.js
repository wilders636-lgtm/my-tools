const API_KEY = "d79tk79r01qspme63fi0d79tk79r01qspme63fig";
const BASE_URL = "https://finnhub.io/api/v1";

// Top 5 US stocks by market cap
const topTickers = ["AAPL", "MSFT", "NVDA", "AMZN", "GOOGL"];

// LocalStorage keys
const FAVORITES_KEY = "stock_favorites";
const RECENT_KEY = "stock_recent";

// ===============================
// Helpers for LocalStorage
// ===============================
function getFavorites() {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
}

function saveFavorites(list) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
}

function getRecent() {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
}

function saveRecent(list) {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
}

// ===============================
// API helpers
// ===============================
async function getQuote(symbol) {
    const url = `${BASE_URL}/quote?symbol=${symbol}&token=${API_KEY}`;
    const response = await fetch(url);
    return response.json();
}

async function searchSymbols(query) {
    const url = `${BASE_URL}/search?q=${encodeURIComponent(query)}&token=${API_KEY}`;
    const response = await fetch(url);
    return response.json();
}

// ===============================
// UI: Stock card
// ===============================
function createStockCard(symbol, data, showFavoriteButton = true) {
    const change = data.dp;
    const color = change >= 0 ? "green" : "red";

    const favorites = getFavorites();
    const isFavorite = favorites.includes(symbol);

    const starIcon = isFavorite ? "fa-solid" : "fa-regular";

    return `
        <div style="
            background:white;
            border:1px solid #ddd;
            border-radius:8px;
            padding:15px;
            margin:10px auto;
            width:260px;
            box-shadow:0 2px 6px rgba(0,0,0,0.1);
            position:relative;
        ">
            <h3>${symbol}</h3>
            <p><strong>Price:</strong> $${data.c}</p>
            <p><strong>Change:</strong> <span style="color:${color};">${data.dp}%</span></p>
            ${
                showFavoriteButton
                    ? `<button class="favorite-btn" onclick="toggleFavorite('${symbol}')">
                           <i class="${starIcon} fa-star"></i> Favorite
                       </button>`
                    : ""
            }
        </div>
    `;
}

// ===============================
// Load Top 5 Stocks
// ===============================
async function loadTopStocks() {
    const container = document.getElementById("topStocks");
    container.innerHTML = "<p>Loading...</p>";

    let html = "";

    for (let ticker of topTickers) {
        const data = await getQuote(ticker);
        html += createStockCard(ticker, data);
    }

    container.innerHTML = html;
}

// Refresh every 15 seconds
setInterval(loadTopStocks, 15000);
loadTopStocks();

// ===============================
// Search Stocks (name or ticker)
// ===============================
async function searchStock() {
    const input = document.getElementById("searchInput").value.trim();
    const resultBox = document.getElementById("searchResult");

    if (!input) {
        resultBox.innerHTML = "<p>Please enter a ticker or company name.</p>";
        return;
    }

    resultBox.innerHTML = "<p>Searching...</p>";

    try {
        const searchData = await searchSymbols(input);

        if (!searchData.result || searchData.result.length === 0) {
            resultBox.innerHTML = "<p>No matching stocks found.</p>";
            return;
        }

        const symbol = searchData.result[0].symbol;
        const quote = await getQuote(symbol);

        if (!quote.c) {
            resultBox.innerHTML = "<p>Could not fetch stock data.</p>";
            return;
        }

        resultBox.innerHTML = createStockCard(symbol, quote);

        addToRecent(symbol);

    } catch (err) {
        resultBox.innerHTML = "<p>Error fetching data.</p>";
    }
}

// ===============================
// Autocomplete
// ===============================
let autocompleteTimeout = null;

async function handleAutocomplete() {
    const input = document.getElementById("searchInput").value.trim();
    const list = document.getElementById("autocompleteList");

    if (!input) {
        list.innerHTML = "";
        list.style.display = "none";
        return;
    }

    // debounce
    if (autocompleteTimeout) {
        clearTimeout(autocompleteTimeout);
    }

    autocompleteTimeout = setTimeout(async () => {
        try {
            const data = await searchSymbols(input);

            if (!data.result || data.result.length === 0) {
                list.innerHTML = "";
                list.style.display = "none";
                return;
            }

            let html = "";
            const maxItems = 8;
            for (let i = 0; i < Math.min(maxItems, data.result.length); i++) {
                const item = data.result[i];
                if (!item.symbol) continue;
                html += `
                    <div class="autocomplete-item" onclick="selectAutocomplete('${item.symbol}')">
                        <strong>${item.symbol}</strong> - ${item.description}
                    </div>
                `;
            }

            list.innerHTML = html;
            list.style.display = "block";

        } catch (err) {
            list.innerHTML = "";
            list.style.display = "none";
        }
    }, 300);
}

function selectAutocomplete(symbol) {
    const input = document.getElementById("searchInput");
    const list = document.getElementById("autocompleteList");

    input.value = symbol;
    list.innerHTML = "";
    list.style.display = "none";

    searchStock();
}

// ===============================
// Favorites
// ===============================
function toggleFavorite(symbol) {
    let favorites = getFavorites();

    if (favorites.includes(symbol)) {
        favorites = favorites.filter(s => s !== symbol);
    } else {
        favorites.push(symbol);
    }

    saveFavorites(favorites);
    renderFavorites();

    // Re-render search result / top cards to update star state
    const currentSearch = document.getElementById("searchInput").value.trim();
    if (currentSearch) {
        // not re-calling API, but you could if you want live star update
    }
}

async function renderFavorites() {
    const container = document.getElementById("favoritesList");
    const favorites = getFavorites();

    if (favorites.length === 0) {
        container.innerHTML = "<p>No favorites yet. Use the ⭐ button on a stock.</p>";
        return;
    }

    let html = "";
    for (let symbol of favorites) {
        const quote = await getQuote(symbol);
        html += `
            <div class="favorite-item" onclick="loadFromFavorite('${symbol}')">
                <strong>${symbol}</strong> - $${quote.c}
                <button class="favorite-remove" onclick="removeFavorite(event, '${symbol}')">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        `;
    }

    container.innerHTML = html;
}

function loadFromFavorite(symbol) {
    document.getElementById("searchInput").value = symbol;
    searchStock();
}

function removeFavorite(event, symbol) {
    event.stopPropagation();
    let favorites = getFavorites().filter(s => s !== symbol);
    saveFavorites(favorites);
    renderFavorites();
}

// ===============================
// Recent Searches
// ===============================
function addToRecent(symbol) {
    let recent = getRecent();

    // remove if already exists
    recent = recent.filter(s => s !== symbol);
    // add to front
    recent.unshift(symbol);
    // keep last 10
    if (recent.length > 10) {
        recent = recent.slice(0, 10);
    }

    saveRecent(recent);
    renderRecent();
}

async function renderRecent() {
    const container = document.getElementById("recentList");
    const recent = getRecent();

    if (recent.length === 0) {
        container.innerHTML = "<p>No recent searches yet.</p>";
        return;
    }

    let html = "";
    for (let symbol of recent) {
        html += `
            <div class="recent-item" onclick="loadFromRecent('${symbol}')">
                ${symbol}
            </div>
        `;
    }

    container.innerHTML = html;
}

function loadFromRecent(symbol) {
    document.getElementById("searchInput").value = symbol;
    searchStock();
}

// ===============================
// Init
// ===============================
window.addEventListener("load", () => {
    renderFavorites();
    renderRecent();
});