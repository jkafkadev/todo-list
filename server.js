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
app.use(express.json())

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
    const obj = {}
    obj.username = req.session.username
    if (!req.query.filter || req.query.filter == 'All') {
      obj.rows = await db.getItemsForUser(req.session.username)
    }
    else if (req.query.filter == "Complete") {
      console.log("filter complete")
      obj.rows = await db.getCompleteItemsForUser(req.session.username)
    }
    else {
      console.log("filter incomplete")
      obj.rows = await db.getIncompleteItemsForUser(req.session.username)
    }
    res.render("todoList.pug", obj)
  }
})
app.post("/add", async (req, res) => {
  if (!req.session.username) res.redirect("/login")
  else {
    await db.addItem(req.session.username, req.body.item, 0)
    res.redirect("/todoList")
  }
})
app.post("/api/toggleComplete", async (req, res) => {
  await db.toggleCompletion(req.body.item)
  const row = await db.getItem(req.body.item)
  res.send(row)
})
app.delete("/api/item", async (req, res) => {
  const row = await db.deleteItem(req.body.item)
  res.send(row)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
