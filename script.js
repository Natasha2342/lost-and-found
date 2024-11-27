// Function to load all items from the backend and display them
function loadItems() {
    fetch('http://localhost:5001/api/lost-items')
        .then(response => response.json())
        .then(items => {
            const itemList = document.getElementById('item-list');
            itemList.innerHTML = ''; // Clear the list before adding new items

            items.forEach(item => {
                const li = document.createElement('li');
                li.classList.add('item');
                li.innerHTML = `
                    <div class="item-info">
                        <strong>${item.name}</strong>
                        <p>${item.description}</p>
                        <p><span class="item-type ${item.type}">${item.type}</span></p>
                    </div>
                    <button class="delete-btn" data-id="${item._id}">Delete</button>
                `;
                itemList.appendChild(li);

                // Add click event to show item details
                li.addEventListener('click', (event) => {
                    // Prevent the click event from triggering on the Delete button
                    if (event.target.classList.contains('delete-btn')) return;
                    showItemDetails(item);
                });
            });

            // Attach delete event listeners to each delete button
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', deleteItem);
            });
        })
        .catch(error => console.error('Error fetching items:', error));
}

// Function to show the detailed information of the clicked item
function showItemDetails(item) {
    const itemDetail = document.getElementById('item-detail');
    const modalOverlay = document.getElementById('modal-overlay');
    const closeDetailButton = document.getElementById('close-detail');

    // Fill in item details
    itemDetail.innerHTML = `
        <h2>${item.name}</h2>
        <p><strong>Type:</strong> ${item.type}</p>
        <p><strong>Description:</strong> ${item.description}</p>
        <p><strong>Contact Info:</strong> ${item.contactInfo}</p>
        
    `;

    // Show the details section and overlay
    itemDetail.style.display = 'block';
    modalOverlay.style.display = 'block';

    // Close the item details when the close button or overlay is clicked
    modalOverlay.addEventListener('click', closeDetails);
     // Attach event listener for the close button
    closeDetailButton.addEventListener('click', closeDetails);
}

// Function to close the item details section
function closeDetails() {
    const itemDetail = document.getElementById('item-detail');
    const modalOverlay = document.getElementById('modal-overlay');
    
    itemDetail.style.display = 'none';
    modalOverlay.style.display = 'none';
}

// Function to delete an item
function deleteItem(event) {
    const itemId = event.target.getAttribute('data-id');

    fetch(`http://localhost:5001/api/lost-items/${itemId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        // Remove the item from the frontend list
        event.target.closest('li').remove();
    })
    .catch(error => console.error('Error deleting item:', error));
}

// Handle form submission for adding a new item
document.getElementById('item-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const newItem = {
        name: document.getElementById('item-name').value,
        type: document.getElementById('item-type').value,
        description: document.getElementById('item-description').value,
        contactInfo: document.getElementById('contact-info').value
    };

    fetch('http://localhost:5001/api/lost-items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
    })
    .then(response => response.json())
    .then(item => {
        // Add the new item to the list without reloading the page
        loadItems();
        // Clear the form
        document.getElementById('item-form').reset();
    })
    .catch(error => console.error('Error adding item:', error));
});

// Load items on page load
window.onload = loadItems;
