let dayCounter = localStorage.getItem('dayCounter') ? parseInt(localStorage.getItem('dayCounter')) : 0;
let isShopOpen = false;
let previousStock = JSON.parse(localStorage.getItem('previousStock')) || []; // Load previous stock from localStorage

// Function to enable/disable all buttons and inputs
function toggleFunctionality(isEnabled) {
    const productInputs = document.querySelectorAll('#productForm input, #productForm button');
    const expenseInputs = document.querySelectorAll('#expenseForm input, #expenseForm button');
    const sellButtons = document.querySelectorAll('.sell-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');

    // Enable/disable product and expense forms
    productInputs.forEach(element => element.disabled = !isEnabled);
    expenseInputs.forEach(element => element.disabled = !isEnabled);

    // Enable/disable sell and delete buttons in tables
    sellButtons.forEach(button => button.disabled = !isEnabled);
    deleteButtons.forEach(button => button.disabled = !isEnabled);
}

// Open Button: Enable functionality and load previous stock
document.getElementById('openBtn').addEventListener('click', function() {
    if (!isShopOpen) {
        isShopOpen = true;
        dayCounter++;
        localStorage.setItem('dayCounter', dayCounter); // Save dayCounter to localStorage
        document.getElementById('dayCounter').textContent = `Day: ${dayCounter}`;
        toggleFunctionality(true);

        // Load previous stock
        if (previousStock.length > 0) {
            previousStock.forEach(product => {
                addProductToTable(product.name, product.price, product.quantity);
            });
        }
    }
});

// Close Button: Disable functionality, save current stock, and show summary popup
document.getElementById('closeBtn').addEventListener('click', function() {
    if (isShopOpen) {
        isShopOpen = false;
        toggleFunctionality(false);

        // Save current stock
        const productRows = document.querySelectorAll('#productTable tbody tr');
        previousStock = [];
        productRows.forEach(row => {
            const name = row.cells[0].textContent;
            const price = row.cells[1].textContent.replace('₹', '');
            const quantity = row.cells[2].textContent;
            previousStock.push({ name, price, quantity });
        });
        localStorage.setItem('previousStock', JSON.stringify(previousStock)); // Save previousStock to localStorage

        // Clear tables
        document.querySelector('#productTable tbody').innerHTML = '';
        document.querySelector('#expenseTable tbody').innerHTML = '';

        // Show the daily summary popup
        showSummaryPopup();
    }
});

// Function to show the daily summary popup
function showSummaryPopup() {
    const totalSales = calculateTotalSales();
    const totalExpenses = calculateTotalExpenses();
    const netProfitLoss = totalSales - totalExpenses;

    // Update the popup content
    document.getElementById('totalSales').textContent = totalSales.toFixed(2);
    document.getElementById('totalExpensesSummary').textContent = totalExpenses.toFixed(2);
    document.getElementById('netProfitLossSummary').textContent = netProfitLoss.toFixed(2);

    // Show the popup
    const popup = document.getElementById('summaryPopup');
    popup.style.display = 'flex';
}

// Function to calculate total sales
function calculateTotalSales() {
    const productRows = document.querySelectorAll('#productTable tbody tr');
    let totalSales = 0;

    productRows.forEach(row => {
        const price = parseFloat(row.cells[1].textContent.replace('₹', ''));
        const initialQuantity = parseInt(row.dataset.initialQuantity);
        const currentQuantity = parseInt(row.cells[2].textContent);
        const soldQuantity = initialQuantity - currentQuantity;
        totalSales += price * soldQuantity;
    });

    return totalSales;
}

// Function to calculate total expenses
function calculateTotalExpenses() {
    const expenseRows = document.querySelectorAll('#expenseTable tbody tr');
    let totalExpenses = 0;

    expenseRows.forEach(row => {
        const amount = parseFloat(row.cells[1].textContent.replace('₹', ''));
        totalExpenses += amount;
    });

    return totalExpenses;
}

// Close the popup when the "Close" button is clicked
document.getElementById('closePopup').addEventListener('click', function() {
    const popup = document.getElementById('summaryPopup');
    popup.style.display = 'none';
});

// Handle Product Form Submission
document.getElementById('productForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;
    const productQuantity = document.getElementById('productQuantity').value;

    if (productName && productPrice && productQuantity) {
        addProductToTable(productName, productPrice, productQuantity);
        document.getElementById('productForm').reset();
    } else {
        alert('Please fill in all fields for the product.');
    }
});

// Handle Expense Form Submission
document.getElementById('expenseForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const expenseName = document.getElementById('expenseName').value;
    const expensePrice = document.getElementById('expensePrice').value;

    if (expenseName && expensePrice) {
        addExpenseToTable(expenseName, expensePrice);
        document.getElementById('expenseForm').reset();
    } else {
        alert('Please fill in all fields for the expense.');
    }
});

// Function to Add Product to Table
function addProductToTable(name, price, quantity) {
    const table = document.getElementById('productTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    const cell4 = newRow.insertCell(3);

    cell1.textContent = name;
    cell2.textContent = `₹${price}`;
    cell3.textContent = quantity;

    // Store the initial quantity in a data attribute
    newRow.dataset.initialQuantity = quantity;

    // Sell Button
    const sellButton = document.createElement('button');
    sellButton.textContent = 'Sell';
    sellButton.classList.add('sell-btn');
    sellButton.addEventListener('click', function() {
        const currentQuantity = parseInt(cell3.textContent);
        if (currentQuantity > 0) {
            cell3.textContent = currentQuantity - 1; // Reduce quantity by 1
            if (cell3.textContent == 0) {
                table.deleteRow(newRow.rowIndex - 1); // Remove row if quantity is 0
            }
        }
    });

    // Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', function() {
        table.deleteRow(newRow.rowIndex - 1);
    });

    cell4.appendChild(sellButton);
    cell4.appendChild(deleteButton);
}

// Function to Add Expense to Table
function addExpenseToTable(name, price) {
    const table = document.getElementById('expenseTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);

    cell1.textContent = name;
    cell2.textContent = `₹${price}`;

    // Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', function() {
        table.deleteRow(newRow.rowIndex - 1);
    });

    cell3.appendChild(deleteButton);
}

// Initialize the day counter display
document.getElementById('dayCounter').textContent = `Day: ${dayCounter}`;

// Calculator Button: Show Calculator Popup
document.getElementById('calculatorBtn').addEventListener('click', function() {
    const popup = document.getElementById('calculatorPopup');
    popup.style.display = 'flex';
});

// Close Calculator Popup when clicking outside
document.getElementById('calculatorPopup').addEventListener('click', function(event) {
    if (event.target === this) {
        this.style.display = 'none';
    }
});

// Calculator Logic
const calculatorInput = document.getElementById('calculatorInput');
const calculatorButtons = document.querySelectorAll('.calculator-buttons button');

calculatorButtons.forEach(button => {
    button.addEventListener('click', function() {
        const value = this.textContent;

        if (value === 'C') {
            // Clear the input
            calculatorInput.value = '';
        } else if (value === '=') {
            // Evaluate the expression
            try {
                calculatorInput.value = eval(calculatorInput.value);
            } catch (error) {
                calculatorInput.value = 'Error';
            }
        } else {
            // Append the value to the input
            calculatorInput.value += value;
        }
    });
});
