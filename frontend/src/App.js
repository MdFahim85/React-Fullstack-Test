import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/data")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  return (
    <div className="App">
      <h1>Stock Market Data</h1>
      <table>
        <thead>
          <tr>
            <th>SL No.</th>
            <th>Date</th>
            <th>Trade Code</th>
            <th>High</th>
            <th>Low</th>
            <th>Open</th>
            <th>Close</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.date}</td>
              <td>{item.trade_code}</td>
              <td>{item.high}</td>
              <td>{item.low}</td>
              <td>{item.open}</td>
              <td>{item.close}</td>
              <td>{item.volume}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
