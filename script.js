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
    cell2.textContent = `₹${price}`; // Updated to Rupee symbol
    cell3.textContent = quantity;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', function() {
        table.deleteRow(newRow.rowIndex - 1);
    });

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
    cell2.textContent = `₹${price}`; // Updated to Rupee symbol

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', function() {
        table.deleteRow(newRow.rowIndex - 1);
    });

    cell3.appendChild(deleteButton);
}
