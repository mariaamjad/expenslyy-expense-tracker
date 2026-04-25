const toggleButton = document.getElementById("themeToggle");
const modeText = document.getElementById("modeText");
const img = document.getElementById("img");
const totalDiv = document.getElementById("total")

function toggleTheme() {
  if (modeText.innerText === "Light Mode") {
    img.src = "icon-night-mode.png";

    modeText.innerText = "Dark Mode";

    toggleButton.style.borderColor = "white";
    toggleButton.style.backgroundColor = "black";
    modeText.style.color = "white";

    document.body.style.backgroundColor = "black";
    document.body.style.color = "white";

    totalDiv.style.color = "black";
  } else {
    img.src =
      "https://img.icons8.com/external-linear-outline-icons-papa-vector/78/external-Light-Mode-interface-linear-outline-icons-papa-vector.png";

    modeText.innerText = "Light Mode";
    modeText.style.color = "black";

    toggleButton.style.borderColor = "#bcbbbb";
    toggleButton.style.backgroundColor = "white";

    document.body.style.backgroundColor = "white";
    document.body.style.color = "black";
  }
}

// Expense Tracker Logic
let expenses = [];

const savedExpenses = localStorage.getItem("expenses");

if (savedExpenses) {
  expenses = JSON.parse(savedExpenses);
  renderExpenses();
  updateSummary();

  // const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  // document.getElementById('totalAmount').innerText = `$${total.toFixed(2)}`;
  // document.getElementById('totalItems').innerText = `Total ${expenses.length} expense(s)`;
}

// persisting data in local storage
function saveToLocalStorage() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function updateSummary() {
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  document.getElementById("totalAmount").innerText = `$${total.toFixed(2)}`;

  document.getElementById("totalItems").innerText =
    `Total ${expenses.length} expense(s)`;
}


// randering expenses
function renderExpenses() {
  const tableBody = document.getElementById('expenseTableBody');

  tableBody.innerHTML = '';

  let filteredExpenses = [...expenses];

  const selectedCategory = document.getElementById('filter').value;

  if (selectedCategory !== "all") {
    filteredExpenses = filteredExpenses.filter(exp => exp.category === selectedCategory);
  }

  const sortValue = document.getElementById('sort').value;
  if (sortValue === "latest") {
    filteredExpenses.reverse();
  }

  filteredExpenses.forEach((exp, index) => {
    const row = `<tr>
      <td>${index+1}</td>
      <td>${exp.description}</td>
      <td>${exp.category}</td>
      <td>$${Number(exp.amount).toFixed(2)}</td>
      <td>${exp.date}</td>
      <td>
        <button class="delBtn" onclick="deleteExpense(${exp.id})">
          <i class="fa-regular fa-trash-can"></i></button>
      </td>
    </tr>`;

    tableBody.innerHTML += row;
  });

}

// add expenses
function addExpense(){
  const amount = document.getElementById('amount');
  const description = document.getElementById('description');
  const category = document.getElementById('category');

  if (!amount.value || !description.value || !category.value) {
    alert("Please fill all fields");
    return;
  }

  const today = new Date();

  const newExpense = {
    id: expenses.length + 1,
    description: description.value,
    category: category.value,
    amount: Number(amount.value) || 0,
    date: today.toLocaleDateString('en-GB').replace(/\//g, '-')
  };

  expenses.push(newExpense);
  saveToLocalStorage();

  amount.value = '';
  description.value = '';
  category.value = '';

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const tot = document.getElementById('totalAmount');
  tot.innerText = `$${total}`;

  renderExpenses();
  updateSummary();

  // const items = document.getElementById('totalItems');
  // items.innerText = `Total ${expenses.length} expense(s)`;
}

// delete all expenses
function clearAllExpenses() {
  // 1. Ask for confirmation
  if (confirm("Are you sure you want to delete all expenses? This cannot be undone.")) {
    
    // 2. Empty the array
    expenses = [];
    saveToLocalStorage();

    // 3. Reset the Total display to zero
    updateSummary();

    // 4. Refresh the table (it will now show as empty)
    renderExpenses();
  }
}

// delete by Id
function deleteExpense(id){

  // 1. Filter out the item with the matching ID
  expenses = expenses.filter(exp => exp.id !== id);
  saveToLocalStorage();


  // 2. Recalculate the total
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  document.getElementById('totalAmount').innerText = `$${total.toFixed(2)}`;

  // 3. Refresh the table
  renderExpenses();
  updateSummary();
}