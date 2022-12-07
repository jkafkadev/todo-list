const express = require("express")
const session = require("express-session")
const db = require("./db")
const app = express()
const port = 3306

app.use(express.static("./resources"))
app.set("views", "templates")
app.set("view engine", "pug")
app.use(session({ secret: "abcdefg" }))
app.use(express.urlencoded({extended:true}));

app.get("/login", (req, res) => {
  if (!req.session.username) res.render("login.pug", { username: "Login" })
  else res.render("welcome.pug", { username: req.session.username })
})
app.post("/login", (req, res) => {
  if (!req.session.username) req.session.username = req.body.username
  res.redirect("/todoList")
})
app.post("/logout", (req, res) => {
  req.session.username = undefined
  res.redirect("/login")
})
app.get("/todoList", async (req, res) => {
  if (!req.session.username) res.redirect("/login")
  else {
    const rows = await db.getItemsForUser(req.session.username)
    res.render("todoList.pug", { username: req.session.username, rows: rows })
  }
})
app.post("/add", async (req, res) => {
  if (!req.session.username) res.redirect("/login")
  else {
    row = await db.addItem(req.session.username, req.body.item, req.body.done)
    res.send({ row: row })
  }
})
app.post("/complete", async (req, res) => {
  if (!req.session.username) res.redirect("/login")
  else {
    row = await db.markItemComplete(req.body.item)
    res.send({ row: row })
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
