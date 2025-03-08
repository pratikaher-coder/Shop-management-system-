let dayCounter = localStorage.getItem('dayCounter') ? parseInt(localStorage.getItem('dayCounter')) : 0;
let isShopOpen = false;
let previousStock = JSON.parse(localStorage.getItem('previousStock')) || []; 
let totalSales = parseFloat(localStorage.getItem("totalSales")) || 0;
let totalExpenses = parseFloat(localStorage.getItem("totalExpenses")) || 0;

// Function to enable/disable buttons and inputs
function toggleFunctionality(isEnabled) {
    const productInputs = document.querySelectorAll('#productForm input, #productForm button');
    const expenseInputs = document.querySelectorAll('#expenseForm input, #expenseForm button');
    const sellButtons = document.querySelectorAll('.sell-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');

    productInputs.forEach(element => element.disabled = !isEnabled);
    expenseInputs.forEach(element => element.disabled = !isEnabled);
    sellButtons.forEach(button => button.disabled = !isEnabled);
    deleteButtons.forEach(button => button.disabled = !isEnabled);
}

// Open shop and load previous stock
document.getElementById('openBtn').addEventListener('click', function() {
    if (!isShopOpen) {
        isShopOpen = true;
        dayCounter++;
        localStorage.setItem('dayCounter', dayCounter);
        document.getElementById('dayCounter').textContent = `Day: ${dayCounter}`;
        toggleFunctionality(true);

        if (previousStock.length > 0) {
            previousStock.forEach(product => {
                addProductToTable(product.name, product.price, product.quantity);
            });
        }
    }
});

// Close shop, save stock, and show daily summary
document.getElementById('closeBtn').addEventListener('click', function() {
    if (isShopOpen) {
        isShopOpen = false;
        toggleFunctionality(false);

        // Save stock for next day
        const productRows = document.querySelectorAll('#productTable tbody tr');
        previousStock = [];
        productRows.forEach(row => {
            const name = row.cells[0].textContent;
            const price = row.cells[1].textContent.replace('₹', '');
            const quantity = row.cells[2].textContent;
            previousStock.push({ name, price, quantity });
        });
        localStorage.setItem('previousStock', JSON.stringify(previousStock));

        showSummaryPopup();
    }
});

// Show daily summary popup
function showSummaryPopup() {
    document.getElementById('totalSales').textContent = `₹${totalSales.toFixed(2)}`;
    document.getElementById('totalExpensesSummary').textContent = `₹${totalExpenses.toFixed(2)}`;
    document.getElementById('netProfitLossSummary').textContent = `₹${(totalSales - totalExpenses).toFixed(2)}`;

    document.getElementById('summaryPopup').style.display = 'flex';

    // Reset for next day
    totalSales = 0;
    totalExpenses = 0;
    localStorage.setItem("totalSales", totalSales);
    localStorage.setItem("totalExpenses", totalExpenses);
}

// Close summary popup
document.getElementById('closePopup').addEventListener('click', function() {
    document.getElementById('summaryPopup').style.display = 'none';
});

// Handle product addition
document.getElementById('productForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const productName = document.getElementById('productName').value;
    const productPrice = parseFloat(document.getElementById('productPrice').value);
    const productQuantity = parseInt(document.getElementById('productQuantity').value);

    if (productName && productPrice > 0 && productQuantity > 0) {
        addProductToTable(productName, productPrice, productQuantity);
        document.getElementById('productForm').reset();
    } else {
        alert('Please enter valid product details.');
    }
});

// Handle expense addition
document.getElementById('expenseForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const expenseName = document.getElementById('expenseName').value;
    const expensePrice = parseFloat(document.getElementById('expensePrice').value);

    if (expenseName && expensePrice > 0) {
        addExpenseToTable(expenseName, expensePrice);
        document.getElementById('expenseForm').reset();
    } else {
        alert('Please enter a valid expense.');
    }
});

// Function to add product to table
function addProductToTable(name, price, quantity) {
    const table = document.getElementById('productTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    
    newRow.innerHTML = `
        <td>${name}</td>
        <td>₹${price}</td>
        <td>${quantity}</td>
        <td>
            <button class="sell-btn">Sell</button>
            <button class="delete-btn">Delete</button>
        </td>
    `;

    // Store initial quantity
    newRow.dataset.initialQuantity = quantity;

    // Sell button event
    newRow.querySelector('.sell-btn').addEventListener('click', function() {
        let currentQuantity = parseInt(newRow.cells[2].textContent);
        if (currentQuantity > 0) {
            currentQuantity--;
            newRow.cells[2].textContent = currentQuantity;
            totalSales += price;
            localStorage.setItem("totalSales", totalSales);
        }
    });

    // Delete button event
    newRow.querySelector('.delete-btn').addEventListener('click', function() {
        table.deleteRow(newRow.rowIndex - 1);
    });
}

// Function to add expense to table
function addExpenseToTable(name, price) {
    const table = document.getElementById('expenseTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    
    newRow.innerHTML = `
        <td>${name}</td>
        <td>₹${price}</td>
        <td><button class="delete-btn">Delete</button></td>
    `;

    // Update expenses
    totalExpenses += price;
    localStorage.setItem("totalExpenses", totalExpenses);

    // Delete button event
    newRow.querySelector('.delete-btn').addEventListener('click', function() {
        table.deleteRow(newRow.rowIndex - 1);
    });
}

// Initialize day counter display
document.getElementById('dayCounter').textContent = `Day: ${dayCounter}`;
