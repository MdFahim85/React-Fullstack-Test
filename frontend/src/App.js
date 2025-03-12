import React, { useEffect, useState } from "react";
import "./App.css";
import {
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";

function App() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editStock, setEditStock] = useState(null);
  const [newStock, setNewStock] = useState(null);
  const [tradeCode, setTradeCode] = useState("");
  const [tradeCodes, setTradeCodes] = useState([]);
  const itemsPerPage = 50;

  useEffect(() => {
    fetchTradeCodes();
    fetchData();
  }, [page]);

  useEffect(() => {
    if (tradeCode) {
      fetchChartData();
    } else {
      fetchData();
    }
  }, [tradeCode, page]);

  const fetchTradeCodes = () => {
    fetch("https://react-fullstack-test.onrender.com/trade_codes")
      .then((response) => response.json())
      .then(({ trade_codes }) => setTradeCodes(trade_codes));
  };

  const fetchData = () => {
    const url = `https://react-fullstack-test.onrender.com/data?page=${page}&limit=${itemsPerPage}`;
    fetch(url)
      .then((response) => response.json())
      .then(({ total, data }) => {
        setData(data);
        setTotal(total);
      });
  };

  const fetchChartData = () => {
    const url = `https://react-fullstack-test.onrender.com/data?trade_code=${tradeCode}`;
    fetch(url)
      .then((response) => response.json())
      .then(({ total, data }) => {
        setData(data);
        setTotal(total);
      });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditStock({ ...editStock, [name]: value });
  };

  const handleNewStockChange = (e) => {
    const { name, value } = e.target;
    setNewStock({ ...newStock, [name]: value });
  };

  const handleEditClick = (item) => {
    setEditStock(item);
  };

  const handleSave = () => {
    fetch("https://react-fullstack-test.onrender.com/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editStock),
    })
      .then((response) => response.json())
      .then(() => {
        fetchData();
        setEditStock(null);
      })
      .catch((error) => console.error("Error updating stock:", error));
  };

  const handleDelete = (stock) => {
    fetch("https://react-fullstack-test.onrender.com/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stock),
    })
      .then((response) => response.json())
      .then(() => {
        fetchData();
      })
      .catch((error) => {
        console.error("Error deleting stock:", error);
        alert("Failed to delete stock.");
      });
  };

  const handleAddNewRow = () => {
    setNewStock({
      date: "",
      trade_code: "",
      high: "",
      low: "",
      open: "",
      close: "",
      volume: "",
    });
  };

  const handleAdd = () => {
    fetch("https://react-fullstack-test.onrender.com/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStock),
    })
      .then((response) => response.json())
      .then(() => {
        fetchData();
        setNewStock(null);
      })
      .catch((error) => console.error("Error adding stock:", error));
  };

  const handleTradeCodeChange = (e) => {
    setTradeCode(e.target.value);
  };

  const handleNextPage = () => {
    if (page * itemsPerPage < total) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleFirstPage = () => {
    setPage(1);
  };

  const handleLastPage = () => {
    setPage(Math.ceil(total / itemsPerPage));
  };

  return (
    <div className="App">
      <h1>Stock Market Data</h1>

      <select onChange={handleTradeCodeChange} value={tradeCode}>
        <option value="">Select Trade Code</option>
        {tradeCodes.map((tc, index) => (
          <option key={index} value={tc}>
            {tc}
          </option>
        ))}
      </select>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="right" dataKey="volume" fill="#82ca9d" />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="close"
            stroke="#8884d8"
          />
        </ComposedChart>
      </ResponsiveContainer>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Trade Code</th>
            <th>High</th>
            <th>Low</th>
            <th>Open</th>
            <th>Close</th>
            <th>Volume</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {editStock &&
              editStock.date === item.date &&
              editStock.trade_code === item.trade_code ? (
                <>
                  <td>
                    <input
                      type="date"
                      name="date"
                      value={editStock.date}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="trade_code"
                      value={editStock.trade_code}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="high"
                      value={editStock.high}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="low"
                      value={editStock.low}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="open"
                      value={editStock.open}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="close"
                      value={editStock.close}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="volume"
                      value={editStock.volume}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => setEditStock(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{item.date}</td>
                  <td>{item.trade_code}</td>
                  <td>{item.high}</td>
                  <td>{item.low}</td>
                  <td>{item.open}</td>
                  <td>{item.close}</td>
                  <td>{item.volume}</td>
                  <td>
                    <button onClick={() => handleEditClick(item)}>Edit</button>
                    <button onClick={() => handleDelete(item)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
          {newStock && (
            <tr>
              <td>New</td>
              <td>
                <input
                  type="date"
                  name="date"
                  value={newStock.date}
                  onChange={handleNewStockChange}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="trade_code"
                  value={newStock.trade_code}
                  onChange={handleNewStockChange}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="high"
                  value={newStock.high}
                  onChange={handleNewStockChange}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="low"
                  value={newStock.low}
                  onChange={handleNewStockChange}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="open"
                  value={newStock.open}
                  onChange={handleNewStockChange}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="close"
                  value={newStock.close}
                  onChange={handleNewStockChange}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="volume"
                  value={newStock.volume}
                  onChange={handleNewStockChange}
                />
              </td>
              <td>
                <button onClick={handleAdd}>Add</button>
                <button onClick={() => setNewStock(null)}>Cancel</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <button onClick={handleAddNewRow}>Add New Stock</button>

      {!tradeCode && (
        <div className="pagination">
          <button onClick={handleFirstPage}>First</button>
          <button onClick={handlePreviousPage}>Previous</button>
          <span>
            Page {page} of {Math.ceil(total / itemsPerPage)}
          </span>
          <button onClick={handleNextPage}>Next</button>
          <button onClick={handleLastPage}>Last</button>
        </div>
      )}
    </div>
  );
}

export default App;
