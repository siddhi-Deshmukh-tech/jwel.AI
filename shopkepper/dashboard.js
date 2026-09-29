// Initial sample inventory state stored in LocalStorage for persistence
let inventory = JSON.parse(localStorage.getItem('jewel_inventory')) || [
  {
    id: 1,
    name: "Diamond Solitaire Ring",
    category: "Rings",
    price: 1250,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300",
    description: "18k Gold band with 1ct Solitaire Diamond"
  },
  {
    id: 2,
    name: "Emerald Cut Necklace",
    category: "Necklaces",
    price: 2100,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300",
    description: "Pure Emerald gemstone set in white gold"
  }
];

// Initial sample customer requests
let customerRequests = JSON.parse(localStorage.getItem('jewel_requests')) || [
  { id: 101, name: "Anita Sharma", detail: "Wants custom 22k Gold Bangles (Size 2.4)", date: "2026-03-28", status: "Pending" },
  { id: 102, name: "Rahul Verma", detail: "Inquiry for Platinum Engagement Ring size 9", date: "2026-03-29", status: "Accepted" }
];

document.addEventListener('DOMContentLoaded', () => {
  renderInventory();
  renderRequests();
  updateBadge();

  // Handle Form Submission (Add / Edit)
  document.getElementById('jewelleryForm').addEventListener('submit', (e) => {
    e.preventDefault();
    saveJewellery();
  });
});

// Tab Navigation Switcher (0-15 min)
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));

  document.getElementById(tabId).classList.add('active');
  event.target.classList.add('active');
}

// Save or Update Jewellery Item (15-65 min)
function saveJewellery() {
  const editId = document.getElementById('editProductId').value;
  const name = document.getElementById('prodName').value;
  const category = document.getElementById('prodCategory').value;
  const price = document.getElementById('prodPrice').value;
  const image = document.getElementById('prodImage').value;
  const description = document.getElementById('prodDescription').value;

  if (editId) {
    // Edit existing item
    inventory = inventory.map(item => item.id == editId ? { id: Number(editId), name, category, price, image, description } : item);
  } else {
    // Add new item
    const newItem = {
      id: Date.now(),
      name, category, price, image, description
    };
    inventory.push(newItem);
  }

  saveToStorage();
  renderInventory();
  resetForm();
  alert(editId ? "Jewellery updated successfully!" : "Jewellery added successfully!");
}

// Render Inventory Table (65-90 min)
function renderInventory() {
  const tbody = document.getElementById('inventoryTableBody');
  tbody.innerHTML = '';

  if (inventory.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No items in inventory.</td></tr>';
    return;
  }

  inventory.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><img src="${item.image}" class="thumb-img" alt="${item.name}"></td>
      <td><strong>${item.name}</strong></td>
      <td>${item.category}</td>
      <td>$${item.price}</td>
      <td>
        <button class="btn btn-edit" onclick="editItem(${item.id})">Edit</button>
        <button class="btn btn-danger" onclick="deleteItem(${item.id})">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Edit Item Trigger
function editItem(id) {
  const item = inventory.find(i => i.id === id);
  if (!item) return;

  document.getElementById('editProductId').value = item.id;
  document.getElementById('prodName').value = item.name;
  document.getElementById('prodCategory').value = item.category;
  document.getElementById('prodPrice').value = item.price;
  document.getElementById('prodImage').value = item.image;
  document.getElementById('prodDescription').value = item.description;

  document.getElementById('formTitle').innerText = "Edit Jewellery Item";
  document.getElementById('saveBtn').innerText = "Update Item";
  document.getElementById('cancelBtn').style.display = "inline-block";

  // Switch to form tab automatically
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.getElementById('add-jewellery').classList.add('active');
}

// Delete Item (65-90 min)
function deleteItem(id) {
  if (confirm("Are you sure you want to delete this item?")) {
    inventory = inventory.filter(item => item.id !== id);
    saveToStorage();
    renderInventory();
  }
}

// Reset Form Controls
function resetForm() {
  document.getElementById('jewelleryForm').reset();
  document.getElementById('editProductId').value = '';
  document.getElementById('formTitle').innerText = "Add New Jewellery Item";
  document.getElementById('saveBtn').innerText = "Save Jewellery";
  document.getElementById('cancelBtn').style.display = "none";
}

// Render Customer Requests (90-130 min)
function renderRequests() {
  const tbody = document.getElementById('requestsTableBody');
  tbody.innerHTML = '';

  customerRequests.forEach(req => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${req.name}</strong></td>
      <td>${req.detail}</td>
      <td>${req.date}</td>
      <td><span class="status-badge status-${req.status.toLowerCase()}">${req.status}</span></td>
      <td>
        <select onchange="updateRequestStatus(${req.id}, this.value)">
          <option value="Pending" ${req.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="Accepted" ${req.status === 'Accepted' ? 'selected' : ''}>Accepted</option>
          <option value="Rejected" ${req.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
        </select>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Update Request Status (110-130 min)
function updateRequestStatus(id, newStatus) {
  customerRequests = customerRequests.map(req => req.id === id ? { ...req, status: newStatus } : req);
  localStorage.setItem('jewel_requests', JSON.stringify(customerRequests));
  renderRequests();
  updateBadge();
}

function updateBadge() {
  const pendingCount = customerRequests.filter(r => r.status === 'Pending').length;
  document.getElementById('requestBadge').innerText = pendingCount;
}

// Save to LocalStorage
function saveToStorage() {
  localStorage.setItem('jewel_inventory', JSON.stringify(inventory));
}