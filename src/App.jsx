import React, { useState, useEffect } from "react";
import { Plus, Trash2, Package, Receipt, Moon, Sun, DollarSign } from "lucide-react";

export default function App() {
  const load = (key, fallback) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const [products, setProducts] = useState(load("products", []));
  const [expenses, setExpenses] = useState(load("expenses", []));
  const [darkMode, setDarkMode] = useState(
    () => window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [activeTab, setActiveTab] = useState("add");

  const [pName, setPName] = useState("");
  const [pQty, setPQty] = useState(""); 
  const [pCost, setPCost] = useState(""); 
  const [pPrice, setPPrice] = useState(""); 
  const [eNote, setENote] = useState("");
  const [eAmount, setEAmount] = useState("");

  
  useEffect(() => localStorage.setItem("products", JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem("expenses", JSON.stringify(expenses)), [expenses]);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toNum = (v) => Number(v) || 0;
  const fmt = (v) => `${Math.round(v).toLocaleString()} UZS`;

  const revenue = products.reduce(
    (s, p) => s + toNum(p.sellPrice) * (Number(p.qty) || 1),
    0
  );
  const totalCost = products.reduce(
    (s, p) => s + toNum(p.buyPrice) * (Number(p.qty) || 1),
    0
  );
  const otherExpenses = expenses.reduce((s, e) => s + toNum(e.amount), 0);

  const profit = revenue - totalCost - otherExpenses;

  const addProduct = (ev) => {
    ev.preventDefault();
    if (!pName.trim() || !pPrice || Number(pPrice) <= 0) {
      alert("Enter the product name and selling price");
      return;
    }
    const qty = Number(pQty) || 1;
    const newP = {
      id: Date.now() + Math.random(),
      name: pName.trim(),
      qty: qty,
      buyPrice: toNum(pCost),
      sellPrice: toNum(pPrice),
      time: new Date().toISOString(),
    };
    setProducts([newP, ...products]);
    setPName("");
    setPQty("");
    setPCost("");
    setPPrice("");
  };

  const addExpense = (ev) => {
    ev.preventDefault();
    if (!eNote.trim() || !eAmount || Number(eAmount) <= 0) {
      alert("Enter the note and amount");
      return;
    }
    const newE = {
      id: Date.now() + Math.random(),
      note: eNote.trim(),
      amount: toNum(eAmount),
      time: new Date().toISOString(),
    };
    setExpenses([newE, ...expenses]);
    setENote("");
    setEAmount("");
  };

  const remove = (list, setList, id) => {
    if (confirm("Do you want to delete?")) {
      setList(list.filter((x) => x.id !== id));
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} pb-24`}>
      <div className="max-w-xl mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="w-7 h-7 text-blue-600" /> Store
          </h1>
          <button onClick={() => setDarkMode(!darkMode)} className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full">
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Key metrics: revenue, cost, profit */}
        <div className="grid grid-cols-3 gap-3 mb-6 text-center">
          <div className="bg-green-100 dark:bg-green-900 p-4 rounded-2xl">
            <p className="text-xs opacity-70">Sales</p>
            <p className="text-lg font-bold">{fmt(revenue)}</p>
            <p className="text-xs opacity-60">(Revenue from sales)</p>
          </div>

          <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-2xl">
            <p className="text-xs opacity-70">Cost</p>
            <p className="text-lg font-bold">{fmt(totalCost)}</p>
            <p className="text-xs opacity-60">(Spent on inventory)</p>
          </div>

          <div className={`p-4 rounded-2xl ${profit >= 0 ? "bg-blue-100 dark:bg-blue-900" : "bg-orange-100 dark:bg-orange-900"}`}>
            <p className="text-xs opacity-70">Profit</p>
            <p className="text-lg font-bold">{fmt(profit)}</p>
            <p className="text-xs opacity-60">({fmt(revenue)} − {fmt(totalCost)} − {fmt(otherExpenses)})</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-4">
          {["add", "sales", "expenses"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-center font-medium ${activeTab === tab ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400" : "text-gray-500"}`}
            >
              {tab === "add" && "Add"}
              {tab === "sales" && "Sales"}
              {tab === "expenses" && "Expenses"}
            </button>
          ))}
        </div>

        {/* Add */}
        {activeTab === "add" && (
          <div className="space-y-5">
            <form onSubmit={addProduct} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Package className="w-5 h-5" /> Add sale
              </h3>
              <input placeholder="Product name" value={pName} onChange={(e) => setPName(e.target.value)} className="w-full p-3 border rounded-lg mb-3" required />
              <div className="grid grid-cols-3 gap-2 mb-3">
                <input type="number" placeholder="Quantity" value={pQty} onChange={(e) => setPQty(e.target.value)} className="p-3 border rounded-lg" min="1" />
                <input type="number" placeholder="Buy price (UZS)" value={pCost} onChange={(e) => setPCost(e.target.value)} className="p-3 border rounded-lg" />
                <input type="number" placeholder="Sell price (UZS)" value={pPrice} onChange={(e) => setPPrice(e.target.value)} className="p-3 border rounded-lg" required />
              </div>
              <div className="flex gap-2">
                <div className="flex-1 p-3 border rounded-lg flex items-center justify-center">UZS</div>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" /> Add
                </button>
              </div>
            </form>

            <form onSubmit={addExpense} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Receipt className="w-5 h-5" /> Add expense
              </h3>
              <input placeholder="Note (e.g., rent)" value={eNote} onChange={(e) => setENote(e.target.value)} className="w-full p-3 border rounded-lg mb-3" required />
              <div className="flex gap-2 items-center">
                <input type="number" placeholder="Amount (UZS)" value={eAmount} onChange={(e) => setEAmount(e.target.value)} className="flex-1 p-3 border rounded-lg" required />
                <div className="p-3 border rounded-lg min-w-20 flex items-center">UZS</div>
                <button type="submit" className="bg-red-600 text-white p-3 rounded-lg flex items-center justify-center" style={{ minWidth: "48px" }}>
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Sales list */}
        {activeTab === "sales" && (
          <div className="space-y-3">
            {products.length === 0 ? (
              <p className="text-center text-gray-500 py-10">No sales yet</p>
            ) : (
              products.map((p) => (
                <div key={p.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow flex justify-between items-center">
                  <div>
                    <p className="font-bold">{p.name}</p>
                    <p className="text-sm opacity-70">
                      {p.qty} × {p.sellPrice} UZS (Buy: {p.buyPrice} UZS)
                    </p>
                    <p className="text-xs opacity-50">{new Date(p.time).toLocaleDateString("en-US")}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{fmt(toNum(p.sellPrice) * p.qty)}</p>
                    <button onClick={() => remove(products, setProducts, p.id)} className="text-red-600 mt-1">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Expenses list */}
        {activeTab === "expenses" && (
          <div className="space-y-3">
            {expenses.length === 0 ? (
              <p className="text-center text-gray-500 py-10">No expenses yet</p>
            ) : (
              expenses.map((e) => (
                <div key={e.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow flex justify-between items-center">
                  <div>
                    <p className="font-bold">{e.note}</p>
                    <p className="text-sm opacity-70">{e.amount} UZS</p>
                    <p className="text-xs opacity-50">{new Date(e.time).toLocaleDateString("en-US")}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{fmt(toNum(e.amount))}</p>
                    <button onClick={() => remove(expenses, setExpenses, e.id)} className="text-red-600 mt-1">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Floating add button */}
      <button onClick={() => setActiveTab("add")} className="fixed bottom-20 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg z-10">
        <Plus className="w-7 h-7" />
      </button>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t">
        <div className="flex justify-around py-2">
          <button onClick={() => setActiveTab("add")} className={`p-3 ${activeTab === "add" ? "text-blue-600" : "text-gray-500"}`}>
            <Plus className="w-6 h-6" />
            <p className="text-xs">Add</p>
          </button>
          <button onClick={() => setActiveTab("sales")} className={`p-3 ${activeTab === "sales" ? "text-blue-600" : "text-gray-500"}`}>
            <DollarSign className="w-6 h-6" />
            <p className="text-xs">Sales</p>
          </button>
          <button onClick={() => setActiveTab("expenses")} className={`p-3 ${activeTab === "expenses" ? "text-blue-600" : "text-gray-500"}`}>
            <Receipt className="w-6 h-6" />
            <p className="text-xs">Expenses</p>
          </button>
        </div>
      </div>
    </div>
  );
}
