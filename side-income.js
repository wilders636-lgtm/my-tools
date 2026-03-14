function calculateIncome() {
    let hourly = Number(document.getElementById("hourlyPay").value);
    let hours = Number(document.getElementById("hoursWorked").value);

    if (!hourly || !hours) {
        document.getElementById("incomeResult").innerText = "Please enter both hourly pay and hours worked.";
        document.getElementById("incomeResult").style.color = "red";
        return;
    }

    let totalPay = hourly * hours;

    // --- Tax calculation ---
    let federalRate = 0.12; // 12% federal estimate
    let stateSelect = document.getElementById("state").value;
    let stateRate = 0;

    // Set state tax rate based on selection
    switch(stateSelect) {
        case "CA": stateRate = 0.10; break;
        case "TX": stateRate = 0.00; break;
        case "NY": stateRate = 0.06; break;
        case "PA": stateRate = 0.03; break;
        case "FL": stateRate = 0.00; break;
        default: stateRate = 0; // no selection
    }

    let localRate = Number(document.getElementById("localTax").value) || 0;

    let totalTax = (federalRate + stateRate + (localRate/100)) * totalPay;
    let netPay = totalPay - totalTax;

    // Display results
    document.getElementById("incomeResult").innerHTML =
        "Gross Pay: $" + totalPay.toFixed(2) + "<br>" +
        "Estimated Taxes: $" + totalTax.toFixed(2) + "<br>" +
        "Net Pay: $" + netPay.toFixed(2);

    document.getElementById("incomeResult").style.color = "#333";

    // Save values to localStorage
    localStorage.setItem("hourlyPay", hourly);
    localStorage.setItem("hoursWorked", hours);
    localStorage.setItem("state", stateSelect);
    localStorage.setItem("localTax", localRate);
}

// Load saved values on page load
window.onload = function() {
    document.getElementById("hourlyPay").value = localStorage.getItem("hourlyPay") || "";
    document.getElementById("hoursWorked").value = localStorage.getItem("hoursWorked") || "";
    document.getElementById("state").value = localStorage.getItem("state") || "";
    document.getElementById("localTax").value = localStorage.getItem("localTax") || "";
};