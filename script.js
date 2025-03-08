document.addEventListener('DOMContentLoaded', function () {
    let dayCounter = localStorage.getItem('dayCounter') ? parseInt(localStorage.getItem('dayCounter')) : 0;
    let isShopOpen = false;
    let previousStock = JSON.parse(localStorage.getItem('previousStock')) || [];

    function toggleFunctionality(isEnabled) {
        document.querySelectorAll('#productForm input, #productForm button, #expenseForm input, #expenseForm button, .sell-btn, .delete-btn')
            .forEach(element => element.disabled = !isEnabled);
    }

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
                previousStock.push({ name, price, quantity });
            });

            localStorage.setItem('previousStock', JSON.stringify(previousStock));
            document.querySelector('#productTable tbody').innerHTML = '';
            document.querySelector('#expenseTable tbody').innerHTML = '';

            showSummaryPopup();
        }
    });

    function showSummaryPopup() {
        const totalSales = calculateTotalSales();
        const totalExpenses = calculateTotalExpenses();
        const netProfitLoss = totalSales - totalExpenses;

        document.getElementById('totalSales').textContent = totalSales.toFixed(2);
        document.getElementById('totalExpensesSummary').textContent = totalExpenses.toFixed(2);
        document.getElementById('netProfitLossSummary').textContent = netProfitLoss.toFixed(2);

        document.getElementById('summaryPopup').style.display = 'flex';
    }
    // Store daily data
let totalSales = 0;
let totalExpenses = 0;

// Function to update daily summary
function updateDailySummary() {
    const salesText = document.getElementById("totalSales");
    const expensesText = document.getElementById("totalExpenses");
    const profitLossText = document.getElementById("profitLoss");

    // Get data from localStorage
    let storedSales = parseFloat(localStorage.getItem("totalSales")) || 0;
    let storedExpenses = parseFloat(localStorage.getItem("totalExpenses")) || 0;
    let profitLoss = storedSales - storedExpenses;

    // Display updated values
    salesText.textContent = `Total Sales: ₹${storedSales.toFixed(2)}`;
    expensesText.textContent = `Total Expenses: ₹${storedExpenses.toFixed(2)}`;
    profitLossText.textContent = `Profit/Loss: ₹${profitLoss.toFixed(2)}`;
}

// Function to add sales
function addSale(price) {
    totalSales += price;
    localStorage.setItem("totalSales", totalSales);
    updateDailySummary();
}

// Function to add expense
function addExpense(amount) {
    totalExpenses += amount;
    localStorage.setItem("totalExpenses", totalExpenses);
    updateDailySummary();
}

// Handle selling items
document.addEventListener("click", function(event) {
    if (event.target.classList.contains("sell-btn")) {
        let row = event.target.closest("tr");
        let price = parseFloat(row.cells[1].textContent.replace("₹", "")) || 0;
        let quantityCell = row.cells[2];
        let quantity = parseInt(quantityCell.textContent) || 0;

        if (quantity > 0) {
            quantity--;
            quantityCell.textContent = quantity;
            addSale(price);
        }
    }
});

// Handle adding expenses
document.getElementById("addExpenseBtn").addEventListener("click", function() {
    let expenseAmount = parseFloat(document.getElementById("expenseAmount").value) || 0;
    if (expenseAmount > 0) {
        addExpense(expenseAmount);
    }
});

// Reset data when shop closes
document.getElementById("closeShopBtn").addEventListener("click", function() {
    updateDailySummary();
    alert("Shop closed! Daily summary updated.");
});

// Initialize summary on page load
document.addEventListener("DOMContentLoaded", updateDailySummary);

    function calculateTotalSales() {
        let totalSales = 0;
        document.querySelectorAll('#productTable tbody tr').forEach(row => {
            const price = parseFloat(row.cells[1].textContent.replace('₹', ''));
            const initialQuantity = parseInt(row.getAttribute('data-initial-quantity')) || 0;
            const currentQuantity = parseInt(row.cells[2].textContent);
            totalSales += price * (initialQuantity - currentQuantity);
        });
        return totalSales;
    }

    function calculateTotalExpenses() {
        let totalExpenses = 0;
        document.querySelectorAll('#expenseTable tbody tr').forEach(row => {
            const amount = parseFloat(row.cells[1].textContent.replace('₹', ''));
            totalExpenses += amount;
        });
        return totalExpenses;
    }

    document.getElementById('closePopup').addEventListener('click', function() {
        document.getElementById('summaryPopup').style.display = 'none';
    });

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

    function addProductToTable(name, price, quantity) {
        const table = document.getElementById('productTable').querySelector('tbody');
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
        newRow.setAttribute('data-initial-quantity', quantity);

        newRow.querySelector('.sell-btn').addEventListener('click', function() {
            let currentQuantity = parseInt(newRow.cells[2].textContent);
            if (currentQuantity > 0) {
                newRow.cells[2].textContent = currentQuantity - 1;
                if (currentQuantity - 1 === 0) table.deleteRow(newRow.rowIndex);
            }
        });

        newRow.querySelector('.delete-btn').addEventListener('click', function() {
            table.deleteRow(newRow.rowIndex);
        });
    }

    function addExpenseToTable(name, price) {
        const table = document.getElementById('expenseTable').querySelector('tbody');
        const newRow = table.insertRow();
        newRow.innerHTML = `<td>${name}</td><td>₹${price}</td><td><button class="delete-btn">Delete</button></td>`;
        newRow.querySelector('.delete-btn').addEventListener('click', function() {
            table.deleteRow(newRow.rowIndex);
        });
    }

    document.getElementById('dayCounter').textContent = `Day: ${dayCounter}`;
});
