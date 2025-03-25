// Shop Management Script - Fixed Version
let dayCounter = localStorage.getItem('dayCounter') ? parseInt(localStorage.getItem('dayCounter')) : 0;
let isShopOpen = false;
let products = JSON.parse(localStorage.getItem('products')) || [];
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    updateDayCounter();
    renderProducts();
    renderExpenses();
});

// Toggle shop functionality
function toggleFunctionality(isEnabled) {
    document.querySelectorAll('#productForm input, #productForm button, #expenseForm input, #expenseForm button')
        .forEach(el => el.disabled = !isEnabled);
}

// Open Shop
document.getElementById('openBtn').addEventListener('click', function() {
    if (!isShopOpen) {
        isShopOpen = true;
        dayCounter++;
        localStorage.setItem('dayCounter', dayCounter);
        updateDayCounter();
        toggleFunctionality(true);
    }
});

// Close Shop
document.getElementById('closeBtn').addEventListener('click', function() {
    if (isShopOpen) {
        isShopOpen = false;
        toggleFunctionality(false);
        showSummaryPopup();
    }
});

// Product Form
document.getElementById('productForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const quantity = parseInt(document.getElementById('productQuantity').value);

    if (name && price > 0 && quantity > 0) {
        products.push({ name, price, quantity, sold: 0 });
        localStorage.setItem('products', JSON.stringify(products));
        renderProducts();
        this.reset();
    }
});

// Expense Form
document.getElementById('expenseForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('expenseName').value;
    const amount = parseFloat(document.getElementById('expensePrice').value);

    if (name && amount > 0) {
        expenses.push({ name, amount });
        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderExpenses();
        this.reset();
    }
});

// Render Products
function renderProducts() {
    const tbody = document.querySelector('#productTable tbody');
    tbody.innerHTML = '';
    
    products.forEach((product, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${product.name}</td>
            <td>₹${product.price.toFixed(2)}</td>
            <td>${product.quantity}</td>
            <td>${product.sold}</td>
            <td>
                <button class="sell-btn" data-index="${index}">Sell</button>
                <button class="delete-btn" data-index="${index}">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Add event listeners for new buttons
    document.querySelectorAll('.sell-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.dataset.index;
            sellProduct(index);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.dataset.index;
            deleteProduct(index);
        });
    });
}

// Render Expenses
function renderExpenses() {
    const tbody = document.querySelector('#expenseTable tbody');
    tbody.innerHTML = '';
    
    expenses.forEach((expense, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${expense.name}</td>
            <td>₹${expense.amount.toFixed(2)}</td>
            <td><button class="delete-btn" data-index="${index}">Delete</button></td>
        `;
        tbody.appendChild(tr);
    });

    document.querySelectorAll('#expenseTable .delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.dataset.index;
            deleteExpense(index);
        });
    });
}

// Product Actions
function sellProduct(index) {
    if (products[index].quantity > 0) {
        products[index].quantity--;
        products[index].sold++;
        localStorage.setItem('products', JSON.stringify(products));
        renderProducts();
    } else {
        alert('No more stock available!');
    }
}

function deleteProduct(index) {
    products.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderExpenses();
}

// Summary Calculations
function showSummaryPopup() {
    const totalSales = products.reduce((sum, product) => sum + (product.sold * product.price), 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const netProfit = totalSales - totalExpenses;

    document.getElementById('totalSales').textContent = totalSales.toFixed(2);
    document.getElementById('totalExpensesSummary').textContent = totalExpenses.toFixed(2);
    document.getElementById('netProfitLossSummary').textContent = netProfit.toFixed(2);

    document.getElementById('summaryPopup').style.display = 'flex';
}

// Update day counter display
function updateDayCounter() {
    document.getElementById('dayCounter').textContent = `Day: ${dayCounter}`;
}

// Close popup
document.getElementById('closePopup').addEventListener('click', function() {
    document.getElementById('summaryPopup').style.display = 'none';
});

// Reset data for new day (optional)
function resetForNewDay() {
    products.forEach(product => {
        product.quantity += product.sold; // Restore sold items
        product.sold = 0;
    });
    expenses = [];
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderProducts();
    renderExpenses();
}
