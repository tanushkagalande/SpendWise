
import "./App.css";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend
} from "recharts";
import "./App.css";

function App() {
  const [transactions, setTransactions] = useState(() => {
    
    try {
      const saved = localStorage.getItem("spendwise-transactions");

      return saved ? JSON.parse(saved) : [
        {
          id: 1,
          title: "Monthly Salary",
          category: "Salary",
          type: "Income",
          amount: 25000,
          date: "2026-11-01"
        },
        {
          id: 2,
          title: "Food",
          category: "Food",
          type: "Expense",
          amount: 1500,
          date: "2026-11-03"
        },
        {
          id: 3,
          title: "Travel",
          category: "Travel",
          type: "Expense",
          amount: 800,
          date: "2026-11-05"
        }
      ];
    } catch {
      return [];
    }
  });

  const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem("spendwise-dark-mode") === "true";
});
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(
  new Date().toISOString().split("T")[0]
);
  const [type, setType] = useState("Expense");
  const [category, setCategory] = useState("Food");
  const [isRecurring, setIsRecurring] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [budgets, setBudgets] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem("spendwise-budgets")) || {};
  } catch {
    return {};
  }
});
const [savingsGoals, setSavingsGoals] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem("spendwise-goals")) || [];
  } catch {
    return [];
  }
});
  const [goalTitle, setGoalTitle] = useState("");
const [goalTarget, setGoalTarget] = useState("");
const [goalSaved, setGoalSaved] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

    useEffect(() => {
  localStorage.setItem(
    "spendwise-transactions",
    JSON.stringify(transactions)
  );
}, [transactions]);

useEffect(() => {
  localStorage.setItem("spendwise-dark-mode", darkMode);
}, [darkMode]);

useEffect(() => {
  localStorage.setItem(
    "spendwise-budgets",
    JSON.stringify(budgets)
  );
}, [budgets]);
 
useEffect(() => {
  localStorage.setItem("spendwise-goals", JSON.stringify(savingsGoals));
}, [savingsGoals]);
  const income = transactions
    .filter(t => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;
  const totalTransactions = transactions.length;
  
  const currentMonth = new Date().toISOString().slice(0, 7);

const monthlyExpenses = transactions.filter(t =>
  t.type === "Expense" &&
  t.date.startsWith(currentMonth)
);

const categories = [
  "Food",
  "Travel",
  "Shopping",
  "Education",
  "Health",
  "Other"
];

function getCategorySpent(category) {
  return monthlyExpenses
    .filter(t => t.category === category)
    .reduce((sum, t) => sum + t.amount, 0);
}
const expenseChartData = categories
  .map(category => ({
    name: category,
    value: getCategorySpent(category)
  }))
  .filter(item => item.value > 0);

const incomeExpenseData = [
  { name: "Income", amount: income },
  { name: "Expenses", amount: expenses }
];

// Monthly Expense Summary

const totalMonthlyExpenses = monthlyExpenses.reduce(
  (sum, t) => sum + t.amount,
  0
);

// Monthly Expense Comparison

const [year, month] = currentMonth.split("-").map(Number);

const previousMonthDate = new Date(year, month - 2, 1);

const previousMonth = [
  previousMonthDate.getFullYear(),
  String(previousMonthDate.getMonth() + 1).padStart(2, "0")
].join("-");

const previousMonthExpenses = transactions
  .filter(t =>
    t.type === "Expense" &&
    t.date.startsWith(previousMonth)
  )
  .reduce((sum, t) => sum + t.amount, 0);

const expenseDifference =
  totalMonthlyExpenses - previousMonthExpenses;

const expenseChangePercentage =
  previousMonthExpenses > 0
    ? (expenseDifference / previousMonthExpenses) * 100
    : 0;

const highestSpendingCategory = categories
  .map(category => ({
    name: category,
    amount: getCategorySpent(category)
  }))
  .sort((a, b) => b.amount - a.amount)[0];

const averageDailySpending =
  totalMonthlyExpenses / new Date().getDate();

const savingsPercentage =
  income > 0
    ? ((income - expenses) / income) * 100
    : 0;
const chartColors = [
  "#6366f1",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4"
];
  const filteredTransactions = transactions
  .filter(t => {
    const matchesSearch = t.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesType =
      filterType === "All" || t.type === filterType;

    const matchesMonth =
      selectedMonth === "All" ||
      t.date.startsWith(selectedMonth);

    return matchesSearch && matchesType && matchesMonth;
  })
  .sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.date) - new Date(a.date);
    }

    if (sortOrder === "oldest") {
      return new Date(a.date) - new Date(b.date);
    }

    if (sortOrder === "highest") {
      return b.amount - a.amount;
    }

    if (sortOrder === "lowest") {
      return a.amount - b.amount;
    }

    return 0;
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (title.trim() === "") {
  alert("Please enter transaction name!");
  return;
}

if (amount === "" || Number(amount) <= 0) {
  alert("Please enter a valid amount!");
  return;
}

    if (!title.trim() || !amount || Number(amount) <= 0) {
      alert("Please enter valid details");
      return;
    }

    if (editingId !== null) {
      setTransactions(transactions.map(t =>
        t.id === editingId
          ? {
              ...t,
             title: title.trim(),
amount: Number(amount),
type,
category,
date,
isRecurring
  
          }
          : t
      ));
      alert("Transaction updated successfully!");
      setEditingId(null);
    } else {
      
        const newTransaction = {
  id: Date.now(),
  title: title.trim(),
  amount: Number(amount),
  type,
  category,
  date: date,
  isRecurring: isRecurring
};
      setTransactions([newTransaction, ...transactions]);
      alert("Transaction added successfully!");
    }

    setTitle("");
    setAmount("");
    setDate(new Date().toISOString().split("T")[0]);
    setType("Expense");
    setCategory("Food");
    setIsRecurring(false);
  }
  
  function addSavingsGoal(e) {
  e.preventDefault();

  if (!goalTitle.trim() || Number(goalTarget) <= 0 || Number(goalSaved) < 0) {
    alert("Please enter valid savings goal details.");
    return;
  }

  if (Number(goalSaved) > Number(goalTarget)) {
    alert("Saved amount cannot be greater than target amount.");
    return;
  }

  const newGoal = {
    id: Date.now(),
    title: goalTitle.trim(),
    target: Number(goalTarget),
    saved: Number(goalSaved)
  };

  setSavingsGoals([...savingsGoals, newGoal]);

  setGoalTitle("");
  setGoalTarget("");
  setGoalSaved("");
}

function addMoneyToGoal(goalId) {
  const amount = Number(prompt("Enter amount to add to your savings:"));

  if (!Number.isFinite(amount) || amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  setSavingsGoals(savingsGoals.map(goal =>
    goal.id === goalId
      ? {
          ...goal,
          saved: Math.min(goal.saved + amount, goal.target)
        }
      : goal
  ));
}
  function editTransaction(t) {
    setEditingId(t.id);
    setTitle(t.title);
    setAmount(String(t.amount));
    setDate(t.date || new Date().toISOString().split("T")[0]);
    setType(t.type);
    setCategory(t.category);
    setIsRecurring(t.isRecurring || false);
  }

  function cancelEdit() {
    setEditingId(null);
    setTitle("");
    setAmount("");
    setType("Expense");
    setCategory("Food");
  }

  function deleteTransaction(id) {
    if (editingId === id) {
      cancelEdit();
    }

    setTransactions(transactions.filter(t => t.id !== id));
  }

 function exportCSV() {
  if (transactions.length === 0) {
    alert("No transactions available to export!");
    return;
  }

  const headers = [
    "Transaction Name",
    "Category",
    "Type",
    "Amount",
    "Date"
  ];

  const rows = transactions.map(t => [
    t.title,
    t.category,
    t.type,
    t.amount,
    t.date
  ]);

  const csvContent = [
    headers,
    ...rows
  ]
    .map(row =>
      row.map(value =>
        `"${String(value).replace(/"/g, '""')}"`
      ).join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "SpendWise-Transactions.csv";
  link.click();

  URL.revokeObjectURL(url);
} return (
  <div className={darkMode ? "app dark-mode" : "app"}>

  <button
    className="theme-toggle"
    onClick={() => setDarkMode(!darkMode)}
  >
    {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
  </button>
    

      <aside className="sidebar">
        <h2>💰 SpendWise</h2>

        <nav>
          <p className="active">Dashboard</p>
          <p>Transactions</p>
          <p>Budgets</p>
          <p>Analytics</p>
          <p>Reports</p>
        </nav>

        <div className="sidebar-bottom">
          Personal Expense Tracker
        </div>
      </aside>

      <main className="main">

        <header>
          <h1>Dashboard</h1>
          <p>Welcome to your personal finance tracker!</p>
        </header>

        <section className="cards">

          <div className="card">
            <p>Total Balance</p>
            <h2>₹{balance.toLocaleString("en-IN")}</h2>
          </div>

          <div className="card income">
            <p>Total Income</p>
            <h2>₹{income.toLocaleString("en-IN")}</h2>
          </div>

          <div className="card expense">
            <p>Total Expenses</p>
            <h2>₹{expenses.toLocaleString("en-IN")}</h2>
          </div>

        </section>

        <section className="content">

          <div className="form-box">
            <h2>
              {editingId !== null
                ? "Edit Transaction"
                : "Add Transaction"}
            </h2>

            <form onSubmit={handleSubmit}>

              <label>Transaction Name</label>
              <input
                type="text"
                placeholder="Enter transaction name"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />

              <label>Amount (₹)</label>
              <input
                type="number"
                placeholder="Enter amount"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
              />
              <div className="date-field">
                <label htmlFor="transaction-date">Date</label>
              <input
                id="transaction-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
             />
            </div>
        <label>Transaction Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
              >
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>

              <label>Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option>Food</option>
                <option>Travel</option>
                <option>Shopping</option>
                <option>Education</option>
                <option>Health</option>
                <option>Salary</option>
                <option>Other</option>
                
              </select>

              <label className="recurring-option">
              <input
                type="checkbox"
               checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              />
               Recurring Transaction
              </label>
              <button type="submit">
                {editingId !== null
                  ? "Update Transaction"
                  : "+ Add Transaction"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  className="cancel"
                  onClick={cancelEdit}
                >
                  Cancel Editing
                </button>
              )}

            </form>
          </div>
          
          <div className="transactions">
  <h2>Recent Transactions</h2>

  <button
  className="export-btn"
  onClick={exportCSV}
>
  ↓ Download CSV Report
</button>

  <div className="transaction-filters">
    <input
      type="text"
      placeholder="Search transactions..."
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
    />

    <select
      value={filterType}
      onChange={e => setFilterType(e.target.value)}
    >
      <option value="All">All Transactions</option>
      <option value="Income">Income Only</option>
      <option value="Expense">Expenses Only</option>
    </select>
    <select
  value={sortOrder}
  onChange={(e) => setSortOrder(e.target.value)}
>
  <option value="newest">Newest to Oldest</option>
  <option value="oldest">Oldest to Newest</option>
  <option value="highest">Highest Amount</option>
  <option value="lowest">Lowest Amount</option>
</select>
    <select
  value={selectedMonth}
  onChange={(e) => setSelectedMonth(e.target.value)}
>
  <option value="All">All Months</option>

  {Array.from(
    new Set(transactions.map(t => t.date.slice(0, 7)))
  ).sort().reverse().map(month => (
    <option key={month} value={month}>
      {new Date(month + "-01").toLocaleString("en-IN", {
        month: "long",
        year: "numeric"
      })}
    </option>
  ))}
</select>
<button
  type="button"
  onClick={() => {
    setSearchTerm("");
    setFilterType("All");
    setSelectedMonth("All");
    setSortOrder("newest");
  }}
>
  Clear Filters
</button>

</div>


            {transactions.length === 0 && (
  <p>No transactions yet. Add your first transaction!</p>
)}

{transactions.length > 0 && filteredTransactions.length === 0 && (
  <p>No matching transactions found.</p>
)}

{filteredTransactions.map(t => (
              <div className="transaction" key={t.id}>

                <div>
                  <strong>{t.title}</strong>
                  {t.isRecurring && (
  <span className="recurring-badge"> 🔁 Recurring</span>
)}
                  <p>{t.category} • {t.date}</p>
                </div>

                <div className="transaction-actions">

                  <strong className={
                    t.type === "Income" ? "green" : "red"
                  }>
                    {t.type === "Income" ? "+" : "-"}
                    ₹{t.amount.toLocaleString("en-IN")}
                  </strong>

                  <button
                    className="edit"
                    onClick={() => editTransaction(t)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete"
                    onClick={() => deleteTransaction(t.id)}
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>

        </section>
<section className="budget-section">
  <h2>Monthly Budgets</h2>
  <p>Set spending limits for each category.</p>

  <div className="budget-grid">
    {categories.map(category => {
      const spent = getCategorySpent(category);
      const limit = Number(budgets[category]) || 0;
      const rawPercentage = limit > 0
  ? (spent / limit) * 100
  : 0;

const percentage = Math.min(rawPercentage, 100);

const budgetStatus =
  limit === 0
    ? "no-budget"
    : rawPercentage >= 100
    ? "exceeded"
    : rawPercentage >= 80
    ? "warning"
    : "safe";

      return (
        <div className="budget-card" key={category}>
          <h3>{category}</h3>

          <label>Monthly Limit (₹)</label>

          <input
            type="number"
            min="0"
            placeholder="Enter budget"
            value={budgets[category] || ""}
            onChange={e =>
              setBudgets({
                ...budgets,
                [category]: e.target.value
              })
            }
          />

          <p>Spent: ₹{spent.toLocaleString("en-IN")}</p>
          <p>Limit: ₹{limit.toLocaleString("en-IN")}</p>

          <div className="budget-progress">
            <div
              
                className={`budget-progress-fill ${budgetStatus}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          {budgetStatus === "safe" && (
  <p className="budget-alert safe">
    Remaining: ₹{(limit - spent).toLocaleString("en-IN")}
  </p>
)}

{budgetStatus === "warning" && (
  <p className="budget-alert warning">
    ⚠️ Warning! You have used {rawPercentage.toFixed(1)}% of your budget.
  </p>
)}

{budgetStatus === "exceeded" && (
  <p className="budget-alert exceeded">
    🚨 Budget exceeded by ₹{(spent - limit).toLocaleString("en-IN")}!
  </p>
)}

{budgetStatus === "no-budget" && (
  <p className="budget-alert">
    Set a budget to track your spending.
  </p>
)}
        </div>
      );
    })}
  </div>
</section>

<section className="savings-section">
  <h2>🎯 Savings Goals</h2>
  <p>Set your financial goals and track your savings progress.</p>

  <form className="savings-form" onSubmit={addSavingsGoal}>
    <input
      type="text"
      placeholder="Goal name (e.g. Buy a Laptop)"
      value={goalTitle}
      onChange={e => setGoalTitle(e.target.value)}
      required
    />

    <input
      type="number"
      placeholder="Target amount (₹)"
      min="1"
      value={goalTarget}
      onChange={e => setGoalTarget(e.target.value)}
      required
    />

    <input
      type="number"
      placeholder="Already saved (₹)"
      min="0"
      value={goalSaved}
      onChange={e => setGoalSaved(e.target.value)}
      required
    />

    <button type="submit">+ Add Savings Goal</button>
  </form>

  <div className="savings-grid">
    {savingsGoals.map(goal => {
      const percentage = Math.min(
        (goal.saved / goal.target) * 100,
        100
      );

      return (
        <div className="savings-card" key={goal.id}>
          <h3>{goal.title}</h3>

          <h2>{percentage.toFixed(1)}%</h2>

          <div className="savings-progress">
            <div
              className="savings-progress-fill"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          <p>
            Saved: ₹{goal.saved.toLocaleString("en-IN")}
          </p>

          <p>
            Target: ₹{goal.target.toLocaleString("en-IN")}
          </p>

          <p>
            Remaining: ₹{Math.max(goal.target - goal.saved, 0).toLocaleString("en-IN")}
          </p>

          <button
            type="button"
            className="delete"
            onClick={() =>
              setSavingsGoals(savingsGoals.filter(g => g.id !== goal.id))
            }
          >
            <button
  type="button"
  className="add-money-btn"
  onClick={() => addMoneyToGoal(goal.id)}
>
  + Add Money
</button>
            Delete Goal
          </button>
        </div>
      );
    })}
  </div>

  {savingsGoals.length === 0 && (
    <p>No savings goals yet. Create your first goal!</p>
  )}
</section>
<section className="comparison-section">

  <h2>Monthly Expense Comparison</h2>

  <p>Compare your spending with the previous month.</p>

  <div className="comparison-grid">

    <div className="comparison-card">
      <h3>Current Month</h3>
      <h2>
        ₹{totalMonthlyExpenses.toLocaleString("en-IN")}
      </h2>
    </div>

    <div className="comparison-card">
      <h3>Previous Month</h3>
      <h2>
        ₹{previousMonthExpenses.toLocaleString("en-IN")}
      </h2>
    </div>

    <div className="comparison-card">
      <h3>Spending Difference</h3>
      <h2>
        ₹{Math.abs(expenseDifference).toLocaleString("en-IN")}
      </h2>
    </div>

  </div>

  <div className="comparison-message">

    {previousMonthExpenses === 0 ? (
      <p>
        No previous-month expenses available for comparison.
      </p>
    ) : expenseDifference > 0 ? (
      <p className="comparison-increase">
        ⚠️ Spending increased by {expenseChangePercentage.toFixed(1)}%
        compared with last month.
      </p>
    ) : expenseDifference < 0 ? (
      <p className="comparison-decrease">
        🎉 Great! Spending decreased by {Math.abs(expenseChangePercentage).toFixed(1)}%
        compared with last month.
      </p>
    ) : (
      <p>Your spending is unchanged from last month.</p>
    )}

  </div>


  <section className="summary-section">
  <h2>Monthly Expense Summary</h2>
  <p>Your financial overview for this month.</p>

  <div className="summary-grid">

    <div className="summary-card">
      <h3>Total Monthly Expenses</h3>
      <h2>₹{totalMonthlyExpenses.toFixed(2)}</h2>
    </div>

    <div className="summary-card">
      <h3>Highest Spending Category</h3>
      <h2>
        {highestSpendingCategory?.amount > 0
          ? highestSpendingCategory.name
          : "No expenses"}
      </h2>
    </div>

    <div className="summary-card">
      <h3>Average Daily Spending</h3>
      <h2>₹{averageDailySpending.toFixed(2)}</h2>
    </div>

    <div className="summary-card">
      <h3>Savings Percentage</h3>
      <h2>{savingsPercentage.toFixed(1)}%</h2>
    </div>

  </div>
</section>

  <h2>Expense Analytics</h2>
  <p>Understand your spending patterns.</p>

  <div className="analytics-grid">

    <div className="analytics-card">
      <h3>Expenses by Category</h3>

      {expenseChartData.length === 0 ? (
        <p>No expense data available yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={expenseChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              
                {expenseChartData.map((entry, index) => (
  <Cell
    key={entry.name}
    fill={chartColors[index % chartColors.length]}
  />
))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>

    <div className="analytics-card">
      <h3>Income vs Expenses</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={incomeExpenseData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount">
  <Cell fill="#A8DCC5" />
  <Cell fill="#F5B8B8" />
</Bar>
          <Legend />
          
        </BarChart>
      </ResponsiveContainer>
    </div>

  </div>
</section>
      </main>
      </div>
    
  );
}

export default App;
