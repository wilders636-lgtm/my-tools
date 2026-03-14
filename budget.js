function calculateBudget() {

let income = Number(document.getElementById("income").value) || 0;

let rent = Number(document.getElementById("rent").value) || 0;
let food = Number(document.getElementById("food").value) || 0;
let utilities = Number(document.getElementById("utilities").value) || 0;
let dining = Number(document.getElementById("dining").value) || 0;
let personal = Number(document.getElementById("personal").value) || 0;
let clothing = Number(document.getElementById("clothing").value) || 0;
let savings = Number(document.getElementById("savings").value) || 0;

let totalExpenses =
rent + food + utilities + dining + personal + clothing + savings;

let remaining = income - totalExpenses;

let percentSpent = 0;

if (income > 0) {
percentSpent = (totalExpenses / income) * 100;
}

document.getElementById("expenses").innerText =
"Total Expenses: $" + totalExpenses.toFixed(2);

let resultElement = document.getElementById("result");

resultElement.innerText =
"Money Remaining: $" + remaining.toFixed(2) +
" | Income Used: " + percentSpent.toFixed(1) + "%";

if (remaining < 0) {

resultElement.style.color = "red";
resultElement.innerText += " (Over Budget!)";

} else if (percentSpent > 80) {

resultElement.style.color = "orange";
resultElement.innerText += " (Warning: Spending High)";

} else {

resultElement.style.color = "green";

}

saveBudget();

}

function saveBudget() {

localStorage.setItem("income", document.getElementById("income").value);
localStorage.setItem("rent", document.getElementById("rent").value);
localStorage.setItem("food", document.getElementById("food").value);
localStorage.setItem("utilities", document.getElementById("utilities").value);
localStorage.setItem("dining", document.getElementById("dining").value);
localStorage.setItem("personal", document.getElementById("personal").value);
localStorage.setItem("clothing", document.getElementById("clothing").value);
localStorage.setItem("savings", document.getElementById("savings").value);

}

window.onload = function() {

document.getElementById("income").value = localStorage.getItem("income") || "";
document.getElementById("rent").value = localStorage.getItem("rent") || "";
document.getElementById("food").value = localStorage.getItem("food") || "";
document.getElementById("utilities").value = localStorage.getItem("utilities") || "";
document.getElementById("dining").value = localStorage.getItem("dining") || "";
document.getElementById("personal").value = localStorage.getItem("personal") || "";
document.getElementById("clothing").value = localStorage.getItem("clothing") || "";
document.getElementById("savings").value = localStorage.getItem("savings") || "";

}