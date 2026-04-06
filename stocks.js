const API_KEY = "YOUR_FINNHUB_API_KEY";
const BASE_URL = "https://finnhub.io/api/v1";

// Top 5 US stocks by market cap
const topTickers = ["AAPL", "MSFT", "NVDA", "AMZN", "GOOGL"];

// Fetch Quote for a single stock

async function getQuote(symbol) {
    const url = `${BASE_URL}/quote?symbol=${symbol}&token=${API_KEY}`;
    const response = await fetch(url);
    return response.json();
}

// Render card for a stock

function createStockCard(symbol, data) {
    const change = data.dp;
    const color = change >= 0 ? "green" : "red";

    return `
        <div style="
            background:white;
            border:1px solid #ddd;
            border-radius:8px;
            padding:15px;
            margin:10px auto;
            width:260px;
            box-shadow:0 2px 6px rgba(0,0,0,0.1);
        ">
            <h3>${symbol}</h3>
            <p><strong>Price:</strong> $${data.c}</p>
            <p><strong>Change:</strong> <span style="color:${color};">${data.dp}%</span></p>
        </div>
    `;
}

// Load top 5 stocks
async function loadTopStocks() {
    const container = document.getElementById("topStocks");
    container.innerHTML = "<p>Loading..</p>";

    let html = "";

    for (let ticker of topTickers) {
        const data = await getQuote(ticker);
        html += creatStockCard(ticker, data);
    }

    container.innerHTML = html;
}

// Refresh every 15 seconds
setInterval(loadTopStocks, 15000);
loadTopStocks();


// Search Stocks

asyn, function searchStock() {
    const input = document.getElementById("searchInput").value.trim()topUpperCase();
    const resultBox = document.getElementById("searchResult");

    if (!input) {
        resultBox.innerHTML = "<p>Please enter a ticker.</P>";
        return;
    
}

try {
    const data = await getQuota(input);

    if (!data.c) {
        resultBox.innerHTML = "<p>Invalid ticker.</p>";
        return;
    }

    result.Box.innerHTML = createStockCard(input, data);

} catch (err) {
    result.Box.innerHTML = "<P>Error fetching data.</p>";
   }


}
