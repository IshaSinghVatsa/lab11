const express = require("express");
var cors = require("cors");
const fs = require("fs");
var mysql = require('mysql2');

// connecting to database
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'khalispur@1',
  database: 'ticketmang'
});


connection.connect((err) => {
  if (err) { console.log("DB Connection Failed."); return }

  // Initializing Express Server
  const app = express();
  app.use(cors({
    origin: "*",
  }));


  //Routes/Apis
  app.use("/readFile", async (req, res) => {
    res.end(await fs.readFileSync("./data.json"))
  });


  // display
  app.get("/ticketmang", (req, res) => {
    connection.query("SELECT * FROM tickets;", (err, results, fields) => {
      if (err) return res.json({ error: err.message })
      res.json(results)
    })
  })

  // search
  app.get("/ticketmang/:ticket_id", (req, res) => {
    if (!req.params.ticket_id) {
      res.json({ error: "Id required" })
      return
    }
    var tnro = req.params.ticket_id
    connection.query("SELECT * FROM tickets WHERE ticket_id = " + tnro, (err, results, fields) => {
      if (err) return res.json({ error: err.message })
      res.json(results)
    })
  })

  // // add 
  app.get("/newticket", (req, res) => {
    if (!req.query.ticket_id) {
      res.json({ error: "ticket id is required" })
      return
    }

    if (!req.query.price) {
      res.json({ error: "price required" })
      return
    }
    if (!req.query.seat_num) {
      res.json({ error: "seat number required" })
      return
    }
    if (!req.query.match_date) {
      res.json({ error: "match date required" })
      return
    }
    if (!req.query.row_id) {
      res.json({ error: "Row id is required" })
      return
    }

    connection.query(`INSERT INTO tickets(ticket_id,price,seat_num,match_date,row_id) ` +
      `VALUES(${req.query.ticket_id},'${req.query.price}','${req.query.seat_num}','${req.query.match_date}','${req.query.row_id}')`,
      (err, results, fields) => {
        if (err) return res.json({ error: err.message })
        res.json(results)
      })
  })

  // // update
  app.get("/updateticket", (req, res) => {
    if (!req.query.price) {
      res.json({ error: "price required" })
      return
    }
    if (!req.query.seat_num) {
      res.json({ error: "seat number required" })
      return
    }
    var price = req.query.price
    var seat_num = req.query.seat_num
    connection.query(`UPDATE ticket SET price = '${price}' WHERE seat_num = ${seat_num}`, (err, results, fields) => {
      if (err) return res.json({ error: err.message })
      res.json(results)
    })
  })

  // delete
  app.get("/deleteticket", (req, res) => {
    if (!req.query.ticket_id) {
      res.json({ error: "ticket id required" })
      return
    }

    var fno = req.query.ticket_id
    connection.query(`DELETE FROM tickets WHERE ticket_id = ${ticket_id}`, (err, results, fields) => {
      if (err) return res.json({ error: err.message })
      res.json(results)
    })
  })


  //Port
  const port = 8000;

  //Starting a server
  app.listen(port, () => {
    console.log(`* SERVER STARTED AT PORT ${port} *`);
  });

})