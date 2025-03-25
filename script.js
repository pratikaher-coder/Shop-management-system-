
let dayCounter = localStorage.getItem('dayCounter') ? parseInt(localStorage.getItem('dayCounter')) : 0;
let isShopOpen = false;
let previousStock = JSON.parse(localStorage.getItem('previousStock')) || [];

// Function to enable/disable all buttons and inputs
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

// Open Button: Enable functionality and load previous stock
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

// Close Button: Disable functionality, save current stock, and show summary popup
document.getElementById('closeBtn').addEventListener('click', function() {
    if (isShopOpen) {
        isShopOpen = false;
        toggleFunctionality(false);

        const productRows = document.querySelectorAll('#productTable tbody tr');
        previousStock = [];
        productRows.forEach(row => {
            const name = row.cells[0].textContent;
            const price = row.cells[1].textContent.replace('₹', '');
            const quantity = row.cells[2].textContent;
            previousStock.push({ name, price: parseFloat(price), quantity: parseInt(quantity) });
        });
        localStorage.setItem('previousStock', JSON.stringify(previousStock));

        document.querySelector('#productTable tbody').innerHTML = '';
        document.querySelector('#expenseTable tbody').innerHTML = '';

        showSummaryPopup();
    }
});

// Function to show the daily summary popup
function showSummaryPopup() {
    const totalSales = calculateTotalSales();
    const totalExpenses = calculateTotalExpenses();
    const netProfitLoss = totalSales - totalExpenses;

    document.getElementById('totalSales').textContent = totalSales.toFixed(2);
    document.getElementById('totalExpensesSummary').textContent = totalExpenses.toFixed(2);
    document.getElementById('netProfitLossSummary').textContent = netProfitLoss.toFixed(2);

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

        if (soldQuantity > 0) {
            totalSales += price * soldQuantity;
        }
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

    const expenseDescription = document.getElementById('expenseName').value;
    const expenseAmount = document.getElementById('expensePrice').value;

    if (expenseDescription && expenseAmount) {
        addExpenseToTable(expenseDescription, expenseAmount);
        document.getElementById('expenseForm').reset();
    } else {
        alert('Please fill in all fields for the expense.');
    }
});

// Function to add a product to the product table
function addProductToTable(name, price, quantity) {
    const productTableBody = document.querySelector('#productTable tbody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${name}</td>
        <td>₹${price}</td>
        <td>${quantity}</td>
        <td><button class="sell-btn" onclick="sellProduct(this)">Sell</button></td>
        <td><button class="delete-btn" onclick="deleteProduct(this)">Delete</button></td>
    `;

    // Store the initial quantity in a data attribute
    newRow.dataset.initialQuantity = quantity;

    productTableBody.appendChild(newRow);
}

// Function to add an expense to the expense table
function addExpenseToTable(description, amount) {
    const expenseTableBody = document.querySelector('#expenseTable tbody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${description}</td>
        <td>₹${amount}</td>
        <td><button class="delete-btn" onclick="deleteExpense(this)">Delete</button></td>
    `;

    expenseTableBody.appendChild(newRow);
}

// Function to handle selling a product
function sellProduct(button) {
    const row = button.closest('tr');
    const quantityCell = row.cells[2];
    let quantity = parseInt(quantityCell.textContent);

    if (quantity > 0) {
        quantity--;
        quantityCell.textContent = quantity;
    } else {
        alert('No more stock available for this product.');
    }
}

// Function to handle deleting a product
function deleteProduct(button) {
    const row = button.closest('tr');
    row.remove();
}

// Function to handle deleting an expense
function deleteExpense(button) {
    const row = button.closest('tr');
    row.remove();
}

// Bill Generation Functionality
document.getElementById('generateBillBtn').addEventListener('click', function() {
    const billPopup = document.getElementById('billPopup');
    billPopup.style.display = 'flex';

    const productRows = document.querySelectorAll('#productTable tbody tr');
    const billItems = document.getElementById('billItems');
    billItems.innerHTML = '';

    let totalAmount = 0;

    productRows.forEach(row => {
        const name = row.cells[0].textContent;
        const price = parseFloat(row.cells[1].textContent.replace('₹', ''));
        const initialQuantity = parseInt(row.dataset.initialQuantity);
        const currentQuantity = parseInt(row.cells[2].textContent);
        const soldQuantity = initialQuantity - currentQuantity;

        if (soldQuantity > 0) {
            const item = document.createElement('div');
            item.innerHTML = `
                <p>${name} - ₹${price} x ${soldQuantity}</p>
            `;
            billItems.appendChild(item);

            totalAmount += price * soldQuantity;
        }
    });

    const totalAmountElement = document.createElement('p');
    totalAmountElement.innerHTML = `<strong>Total Amount: ₹${totalAmount.toFixed(2)}</strong>`;
    billItems.appendChild(totalAmountElement);
});

document.getElementById('closeBillPopup').addEventListener('click', function() {
    const billPopup = document.getElementById('billPopup');
    billPopup.style.display = 'none';
});

document.getElementById('billForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const customerName = document.getElementById('customerName').value;
    const discount = parseFloat(document.getElementById('discount').value);

    let totalAmount = 0;
    const productRows = document.querySelectorAll('#productTable tbody tr');
    productRows.forEach(row => {
        const price = parseFloat(row.cells[1].textContent.replace('₹', ''));
        const initialQuantity = parseInt(row.dataset.initialQuantity);
        const currentQuantity = parseInt(row.cells[2].textContent);
        const soldQuantity = initialQuantity - currentQuantity;

        if (soldQuantity > 0) {
            totalAmount += price * soldQuantity;
        }
    });

    const discountedAmount = totalAmount - (totalAmount * (discount / 100));

    alert(`Bill for ${customerName}\nTotal Amount: ₹${totalAmount.toFixed(2)}\nDiscount: ${discount}%\nFinal Amount: ₹${discountedAmount.toFixed(2)}`);

    const billPopup = document.getElementById('billPopup');
    billPopup.style.display = 'none';
});

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
    document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('currentUser'); // Clear the current user session
    window.location.href = 'login.html'; // Redirect to the login page
});
});
