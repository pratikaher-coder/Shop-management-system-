let dayCounter = 0;
let isShopOpen = false;
let previousStock = []; // Store previous day's stock

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

// Close Button: Disable functionality and save current stock
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

        // Clear tables
        document.querySelector('#productTable tbody').innerHTML = '';
        document.querySelector('#expenseTable tbody').innerHTML = '';
    }
});

// Initially disable all functionality
toggleFunctionality(false);

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
