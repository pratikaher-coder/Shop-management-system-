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
