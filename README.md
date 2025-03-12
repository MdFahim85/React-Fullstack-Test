Throughout this project, I learned a lot about building full-stack applications. I started by creating a basic React app and using React hooks to manage components and state. I then connected the frontend to a FastAPI backend, using CORS middleware to allow smooth communication between the two. I also worked with a MySQL database, learning how to load data from a CSV file and connect it to FastAPI with the mysql-connector library. This setup let me fetch and manipulate data with CRUD operations on both the frontend and backend.

One of the highlights was using the recharts library to create interactive charts, including line and bar charts. To handle large datasets (15,000+ records), I added pagination to display 50 records per page. I also implemented a dropdown filter based on the trade_code column, letting users easily select and view data for specific trade codes.

While trying to deploy the project on Render, I ran into some issues. I couldn’t add payment methods to use a cloud SQL server, and when I tried to use my local server, the backend struggled to connect to the MySQL database. Unfortunately, I couldn’t find a solution, so the deployment didn’t work out.

Despite these challenges, I gained a lot of hands-on experience with React, FastAPI, MySQL, and handling large datasets. It was a valuable learning experience in full-stack development!
