import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Package,
  Receipt,
  Moon,
  Sun,
  DollarSign,
} from "lucide-react";

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
  const [exchangeRate, setExchangeRate] = useState(load("rate", 12700));
  const [showUSD, setShowUSD] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [activeTab, setActiveTab] = useState("add");

  // Formalar — Bo'sh qoldiriladi
  const [pName, setPName] = useState("");
  const [pQty, setPQty] = useState(""); // BO'SH
  const [pCost, setPCost] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pCurrency, setPCurrency] = useState("UZS");

  const [eNote, setENote] = useState("");
  const [eAmount, setEAmount] = useState("");
  const [eCurrency, setECurrency] = useState("UZS");

  // Saqlash
  useEffect(
    () => localStorage.setItem("products", JSON.stringify(products)),
    [products]
  );
  useEffect(
    () => localStorage.setItem("expenses", JSON.stringify(expenses)),
    [expenses]
  );
  useEffect(() => localStorage.setItem("rate", exchangeRate), [exchangeRate]);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Hisoblash
  const toUZS = (amount, currency) => {
    const num = Number(amount) || 0;
    return currency === "UZS" ? num : num * exchangeRate;
  };

  const format = (uzs) => {
    const num = Number(uzs) || 0;
    if (showUSD) return `$${(num / exchangeRate).toFixed(2)}`;
    return `${Math.round(num).toLocaleString()} so'm`;
  };

  // Jami
  const income = products.reduce(
    (sum, p) => sum + toUZS(p.sellPrice, p.currency) * (Number(p.qty) || 1),
    0
  );
  const expense = expenses.reduce(
    (sum, e) => sum + toUZS(e.amount, e.currency),
    0
  );
  const profit = income - expense;

  // Mahsulot qo'shish
  const addProduct = (e) => {
    e.preventDefault();
    if (!pName.trim() || !pPrice || Number(pPrice) <= 0) {
      alert("Mahsulot nomi va sotish narxini kiriting");
      return;
    }
    const qty = Number(pQty) || 1; // Agar bo'sh bo'lsa — 1
    const newP = {
      id: Date.now() + Math.random(), // Unikal ID
      name: pName.trim(),
      qty: qty,
      buyPrice: Number(pCost) || 0,
      sellPrice: Number(pPrice) || 0,
      currency: pCurrency,
      time: new Date().toISOString(),
    };
    setProducts([newP, ...products]);
    // FORM TOZLASH — pQty BO'SH QOLADI
    setPName("");
    setPQty(""); // BO'SH
    setPCost("");
    setPPrice("");
    setPCurrency("UZS");
  };

  // Xarajat qo'shish
  const addExpense = (e) => {
    e.preventDefault();
    if (!eNote.trim() || !eAmount || Number(eAmount) <= 0) {
      alert("Izoh va summasini kiriting");
      return;
    }
    const newE = {
      id: Date.now() + Math.random(),
      note: eNote.trim(),
      amount: Number(eAmount) || 0,
      currency: eCurrency,
      time: new Date().toISOString(),
    };
    setExpenses([newE, ...expenses]);
    setENote("");
    setEAmount("");
    setECurrency("UZS");
  };

  const remove = (list, setList, id) => {
    if (confirm("O'chirishni xohlaysizmi?")) {
      setList(list.filter((x) => x.id !== id));
    }
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } pb-24`}
    >
      <div className="max-w-xl mx-auto p-4">
        {/* Sarlavha */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="w-7 h-7 text-blue-600" /> Do'kon
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full"
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Jami ko'rsatkichlar */}
        <div className="grid grid-cols-3 gap-3 mb-6 text-center">
          <div className="bg-green-100 dark:bg-green-900 p-4 rounded-2xl">
            <p className="text-xs opacity-70">Daromad</p>
            <p className="text-lg font-bold">{format(income)}</p>
          </div>
          <div className="bg-red-100 dark:bg-red-900 p-4 rounded-2xl">
            <p className="text-xs opacity-70">Xarajat</p>
            <p className="text-lg font-bold">{format(expense)}</p>
          </div>
          <div
            className={`p-4 rounded-2xl ${
              profit >= 0
                ? "bg-blue-100 dark:bg-blue-900"
                : "bg-orange-100 dark:bg-orange-900"
            }`}
          >
            <p className="text-xs opacity-70">Foyda</p>
            <p className="text-lg font-bold">{format(profit)}</p>
          </div>
        </div>

        {/* Valyuta */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setShowUSD(false)}
            className={`flex-1 py-2 rounded-lg font-medium ${
              !showUSD
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            so'm
          </button>
          <button
            onClick={() => setShowUSD(true)}
            className={`flex-1 py-2 rounded-lg font-medium ${
              showUSD
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            $
          </button>
          <input
            type="number"
            value={exchangeRate}
            onChange={(e) =>
              setExchangeRate(Math.max(1, Number(e.target.value) || 1))
            }
            placeholder="Kurs"
            className="w-24 px-3 py-2 bg-white dark:bg-gray-800 border rounded-lg text-sm"
          />
        </div>

        {/* Tablar */}
        <div className="flex border-b mb-4">
          {["add", "sales", "expenses"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-center font-medium ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                  : "text-gray-500"
              }`}
            >
              {tab === "add" && "Qo'shish"}
              {tab === "sales" && "Sotuvlar"}
              {tab === "expenses" && "Xarajatlar"}
            </button>
          ))}
        </div>

        {/* Qo'shish sahifasi */}
        {activeTab === "add" && (
          <div className="space-y-5">
            {/* Sotuv qo'shish */}
            <form
              onSubmit={addProduct}
              className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow"
            >
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Package className="w-5 h-5" /> Sotuv qo'shish
              </h3>
              <input
                placeholder="Mahsulot nomi"
                value={pName}
                onChange={(e) => setPName(e.target.value)}
                className="w-full p-3 border rounded-lg mb-3"
                required
              />
              <div className="grid grid-cols-3 gap-2 mb-3">
                <input
                  type="number"
                  placeholder="Soni"
                  value={pQty}
                  onChange={(e) => setPQty(e.target.value)} // HECH QANDAY "|| 1"
                  className="p-3 border rounded-lg"
                  min="1"
                />
                <input
                  type="number"
                  placeholder="Olish narxi"
                  value={pCost}
                  onChange={(e) => setPCost(e.target.value)}
                  className="p-3 border rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Sotish narxi"
                  value={pPrice}
                  onChange={(e) => setPPrice(e.target.value)}
                  className="p-3 border rounded-lg"
                  required
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={pCurrency}
                  onChange={(e) => setPCurrency(e.target.value)}
                  className="flex-1 p-3 border rounded-lg"
                >
                  <option>so'm</option>
                  <option>$</option>
                </select>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" /> Qo'shish
                </button>
              </div>
            </form>
            {/* Xarajat qo'shish */}
            <form onSubmit={addExpense} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Receipt className="w-5 h-5" /> Xarajat qo'shish
              </h3>
              <input
                placeholder="Izoh (masalan, ijara)"
                value={eNote}
                onChange={(e) => setENote(e.target.value)}
                className="w-full p-3 border rounded-lg mb-3"
                required
              />
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Summa"
                  value={eAmount}
                  onChange={(e) => setEAmount(e.target.value)}
                  className="flex-1 p-3 border rounded-lg"
                  required
                />
                <select
                  value={eCurrency}
                  onChange={(e) => setECurrency(e.target.value)}
                  className="p-3 border rounded-lg min-w-20"
                >
                  <option>so'm</option>
                  <option>$</option>
                </select>
                <button
                  type="submit"
                  className="bg-red-600 text-white p-3 rounded-lg flex items-center justify-center"
                  style={{ minWidth: '48px' }}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Sotuvlar */}
        {activeTab === "sales" && (
          <div className="space-y-3">
            {products.length === 0 ? (
              <p className="text-center text-gray-500 py-10">
                Hozircha sotuv yo'q
              </p>
            ) : (
              products.map((p) => (
                <div
                  key={p.id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold">{p.name}</p>
                    <p className="text-sm opacity-70">
                      {p.qty} × {p.sellPrice}{" "}
                      {p.currency === "UZS" ? "so'm" : "$"}
                    </p>
                    <p className="text-xs opacity-50">
                      {new Date(p.time).toLocaleDateString("uz-UZ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {format(toUZS(p.sellPrice, p.currency) * p.qty)}
                    </p>
                    <button
                      onClick={() => remove(products, setProducts, p.id)}
                      className="text-red-600 mt-1"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Xarajatlar */}
        {activeTab === "expenses" && (
          <div className="space-y-3">
            {expenses.length === 0 ? (
              <p className="text-center text-gray-500 py-10">
                Hozircha xarajat yo'q
              </p>
            ) : (
              expenses.map((e) => (
                <div
                  key={e.id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold">{e.note}</p>
                    <p className="text-sm opacity-70">
                      {e.amount} {e.currency === "UZS" ? "so'm" : "$"}
                    </p>
                    <p className="text-xs opacity-50">
                      {new Date(e.time).toLocaleDateString("uz-UZ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {format(toUZS(e.amount, e.currency))}
                    </p>
                    <button
                      onClick={() => remove(expenses, setExpenses, e.id)}
                      className="text-red-600 mt-1"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Qo'shish tugmasi */}
      <button
        onClick={() => setActiveTab("add")}
        className="fixed bottom-20 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg z-10"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Pastki navigatsiya */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t">
        <div className="flex justify-around py-2">
          <button
            onClick={() => setActiveTab("add")}
            className={`p-3 ${
              activeTab === "add" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <Plus className="w-6 h-6" />
            <p className="text-xs">Qo'shish</p>
          </button>
          <button
            onClick={() => setActiveTab("sales")}
            className={`p-3 ${
              activeTab === "sales" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <DollarSign className="w-6 h-6" />
            <p className="text-xs">Sotuv</p>
          </button>
          <button
            onClick={() => setActiveTab("expenses")}
            className={`p-3 ${
              activeTab === "expenses" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <Receipt className="w-6 h-6" />
            <p className="text-xs">Xarajat</p>
          </button>
        </div>
      </div>
    </div>
  );
}
