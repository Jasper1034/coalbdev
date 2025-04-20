document.getElementById("registerForm")?.addEventListener("submit", function(e) {
    e.preventDefault();

    var firstName = document.getElementById("first-name").value;
    var lastName = document.getElementById("last-name").value;
    var email = document.getElementById("register-email").value;
    var password = document.getElementById("register-password").value;
    var confirmPassword = document.getElementById("confirm-password").value;

    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    var passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        alert("All fields are required!");
        return;
    }

    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    if (!passwordPattern.test(password)) {
        alert("Password must meet the required criteria!");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    localStorage.setItem("firstName", firstName);
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);

    alert("Account successfully created! You can now log in.");
    clearForm();
    setTimeout(() => window.location.href = "index.html", 2000);
});

document.getElementById("loginForm")?.addEventListener("submit", function(e) {
    e.preventDefault();

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var registeredEmail = localStorage.getItem("email");
    var registeredPassword = localStorage.getItem("password");

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    if (email !== registeredEmail || password !== registeredPassword) {
        alert("Invalid email or password. Please try again.");
        return;
    }

    alert("Logged in successfully!");
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "dashboard.html";
});

document.getElementById("logout")?.addEventListener("click", function() {
    localStorage.setItem("isLoggedIn", "false");
    window.location.href = "index.html";
});

document.getElementById("back-to-dashboard-btn")?.addEventListener("click", function() {
    window.location.href = "dashboard.html";
});

function clearForm() {
    document.getElementById("first-name").value = '';
    document.getElementById("last-name").value = '';
    document.getElementById("register-email").value = '';
    document.getElementById("register-password").value = '';
    document.getElementById("confirm-password").value = '';
}

if (window.location.pathname.includes("dashboard.html")) {
    if (localStorage.getItem("isLoggedIn") !== "true") {
        window.location.href = "index.html";
    } else {
        document.getElementById("user-name").innerText = localStorage.getItem("firstName") || "User";
    }
}

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let budget = parseFloat(localStorage.getItem('budget')) || 0;
let savings = parseFloat(localStorage.getItem('savings')) || 0;
let income = parseFloat(localStorage.getItem('income')) || 0;

document.getElementById("add-expense-form").addEventListener("submit", function(e) {
    e.preventDefault();

    let category = document.getElementById("expense-category").value;
    let amount = parseFloat(document.getElementById("expense-amount").value);
    let date = document.getElementById("expense-date").value;

    let expense = {
        category: category,
        amount: amount,
        date: date
    };

    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));

    updateExpenseList();
    updateExpenseSummary();
    updateBudgetStatus();
    updateProgressBars();
    document.getElementById("add-expense-form").reset();
});

function updateExpenseList() {
    let expenseHistory = document.getElementById("expense-history-list");
    expenseHistory.innerHTML = '';

    expenses.forEach((expense, index) => {
        let expenseItem = document.createElement("li");
        expenseItem.innerHTML =
            `${expense.date} - ${expense.category}: $${expense.amount.toFixed(2)}
            <button onclick="deleteExpense(${index})">Delete</button>`;
        expenseHistory.appendChild(expenseItem);
    });
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    updateExpenseList();
    updateExpenseSummary();
    updateBudgetStatus();
    updateProgressBars();
}

function updateExpenseSummary() {
    let totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
    let categorizedExpenses = expenses.reduce((categories, expense) => {
        if (!categories[expense.category]) {
            categories[expense.category] = 0;
        }
        categories[expense.category] += expense.amount;
        return categories;
    }, {});

    let summary = `Total Expenses: $${totalExpenses.toFixed(2)}<br>`;

    for (let category in categorizedExpenses) {
        summary += `${category}: $${categorizedExpenses[category].toFixed(2)}<br>`;
    }

    document.getElementById("expense-summary").innerHTML = summary;
}

document.getElementById("budget-form").addEventListener("submit", function(e) {
    e.preventDefault();
    
    let budgetAmount = parseFloat(document.getElementById("budget-amount").value);
    
    if (!isNaN(budgetAmount) && budgetAmount > 0) {
        budget = budgetAmount;
        localStorage.setItem('budget', budget);
        document.getElementById("budget-status").innerHTML = `Your budget goal is set to $${budget.toFixed(2)}.`;
        updateProgressBars();
    } else {
        document.getElementById("budget-status").innerHTML = "Please enter a valid budget amount.";
    }
});

document.getElementById("add-savings-form").addEventListener("submit", function(e) {
    e.preventDefault();

    let savingsAmount = parseFloat(document.getElementById("savings-amount").value);
    
    if (!isNaN(savingsAmount) && savingsAmount > 0) {
        savings += savingsAmount;
        localStorage.setItem('savings', savings);
        document.getElementById("savings-status").innerHTML = `Your total savings is $${savings.toFixed(2)}.`;
        updateProgressBars();
    } else {
        document.getElementById("savings-status").innerHTML = "Please enter a valid savings amount.";
    }
});

document.getElementById("add-income-form").addEventListener("submit", function(e) {
    e.preventDefault();

    let incomeAmount = parseFloat(document.getElementById("income-amount").value);
    
    if (!isNaN(incomeAmount) && incomeAmount > 0) {
        income += incomeAmount;
        localStorage.setItem('income', income);
        document.getElementById("income-status").innerHTML = `Your total income is $${income.toFixed(2)}.`;
        updateProgressBars();
    } else {
        document.getElementById("income-status").innerHTML = "Please enter a valid income amount.";
    }
});

function updateBudgetStatus() {
    let totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
    let remainingBudget = budget - totalExpenses;

    if (remainingBudget < 0) {
        document.getElementById("budget-status").innerHTML = `You've exceeded your budget by $${Math.abs(remainingBudget).toFixed(2)}.`;
    } else {
        document.getElementById("budget-status").innerHTML = `You have $${remainingBudget.toFixed(2)} left in your budget.`;
    }
}

function updateProgressBars() {
    let totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
    let budgetProgress = (totalExpenses / budget) * 100;
    document.getElementById("budget-progress-bar").style.width = Math.min(budgetProgress, 100) + "%";
    
    let savingsGoal = 5000;
    let savingsProgress = (savings / savingsGoal) * 100;
    document.getElementById("savings-progress-bar").style.width = Math.min(savingsProgress, 100) + "%";

    let incomeProgress = (income / 20000) * 100;
    document.getElementById("income-progress-bar").style.width = Math.min(incomeProgress, 100) + "%";
}

window.addEventListener('load', function() {
    updateExpenseList();
    updateExpenseSummary();
    updateBudgetStatus();
    updateProgressBars();
});

document.getElementById("store-discount-form")?.addEventListener("submit", function(e) {
    e.preventDefault();

    let category = document.getElementById("discount-category").value;
    let amount = parseFloat(document.getElementById("discount-amount").value);
    let startDate = document.getElementById("discount-start-date").value;
    let endDate = document.getElementById("discount-end-date").value;

    let discount = {
        category: category,
        amount: amount,
        startDate: startDate,
        endDate: endDate
    };

    let discountList = JSON.parse(localStorage.getItem('discounts')) || {
        transportation: [],
        streaming: [],
        technology: [],
        food: []
    };

    discountList[category].push(discount);
    localStorage.setItem('discounts', JSON.stringify(discountList));

    updateDiscountList();
    document.getElementById("store-discount-form").reset();
});

function updateDiscountList() {
    let discountList = JSON.parse(localStorage.getItem('discounts')) || {
        transportation: [],
        streaming: [],
        technology: [],
        food: []
    };
    const categories = ['transportation', 'streaming', 'technology', 'food'];

    categories.forEach(category => {
        let discountListElement = document.getElementById(`${category}-discounts`);
        discountListElement.innerHTML = '';

        discountList[category].forEach(discount => {
            let discountItem = document.createElement("li");
            discountItem.textContent = `${discount.startDate} - ${discount.endDate}: ${discount.amount}% off`;
            discountListElement.appendChild(discountItem);
        });
    });
}

window.addEventListener('load', function() {
    updateDiscountList();
});
