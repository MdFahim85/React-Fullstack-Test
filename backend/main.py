from fastapi import FastAPI, Query
import mysql.connector
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "stock_market_db",
}

def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)

class StockData(BaseModel):
    date: str
    trade_code: str
    high: float
    low: float
    open: float
    close: float
    volume: int

@app.get("/data")
def get_data(page: int = Query(1, alias="page"), limit: int = Query(50, alias="limit"), trade_code: str = Query(None, alias="trade_code")):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("SELECT COUNT(*) as total FROM stock_data")
    total_records = cursor.fetchone()["total"]
    
    offset = (page - 1) * limit
    
    query = "SELECT date, trade_code, high, low, open, close, volume FROM stock_data"
    if trade_code:
        query += f" WHERE trade_code = '{trade_code}'"
    query += f" LIMIT {limit} OFFSET {offset}"
    
    cursor.execute(query)
    rows = cursor.fetchall()
    
    conn.close()
    for row in rows:
        row["date"] = row["date"].strftime("%Y-%m-%d")
    
    return {"total": total_records, "data": rows}

@app.post("/update")
def update_data(stock: StockData):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        UPDATE stock_data
        SET open = %s, close = %s, high = %s, low = %s, volume = %s, date = %s, trade_code = %s
        WHERE date = %s AND trade_code = %s
        """,
        (stock.open, stock.close, stock.high, stock.low, stock.volume, stock.date, stock.trade_code)
    )
    conn.commit()
    conn.close()
    return {"message": "Record updated successfully"}

@app.post("/add")
def add_data(stock: StockData):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO stock_data (date, trade_code, high, low, open, close, volume)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """,
        (stock.date, stock.trade_code, stock.high, stock.low, stock.open, stock.close, stock.volume)
    )
    conn.commit()
    conn.close()
    return {"message": "New stock added successfully"}

@app.delete("/delete")
def delete_data(stock: StockData):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM stock_data WHERE date = %s AND trade_code = %s",
        (stock.date, stock.trade_code)
    )
    conn.commit()
    conn.close()
    return {"message": f"Stock with date {stock.date} and trade code {stock.trade_code} deleted successfully"}

@app.get("/trade_codes")
def get_trade_codes():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT DISTINCT trade_code FROM stock_data")
    trade_codes = cursor.fetchall()
    conn.close()
    return {"trade_codes": [tc["trade_code"] for tc in trade_codes]}
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
