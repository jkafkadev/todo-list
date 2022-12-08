const mysql = require("mysql")
const dbconfig = require("./db-config.json")

let connPool = mysql.createPool(dbconfig)
module.exports = {
    addItem: (user, item, done) => {
        return new Promise((resolve, reject) => {
            const sql = `insert into todoList 
            (user, item, done) values (?, ?, ?)`
            connPool.query(sql, [user, item, done], (err, rows) => {
                if (err) reject(err)
                else if (rows.length > 0) resolve(rows[0])
                else resolve(undefined)
            })
        })
    },
    deleteItem: (item) => {
        return new Promise((resolve, reject) => {
            const sql = 'delete from todoList where item = ?'
            connPool.query(sql, [item], (err, rows) => {
                if (err) reject(err)
                else if (rows.length > 0) resolve(rows[0])
                else resolve(undefined)
            })
        })
    },
    getItem: (item) => {
        return new Promise((resolve, reject) => {
            const sql = 'select * from todoList where item = ?'
            connPool.query(sql, [item], (err, rows) => {
                if (err) reject(err)
                else if (rows.length > 0) resolve(rows[0])
                else resolve(undefined)
            })
        })
    },
    getAllItems: () => {
        return new Promise((resolve, reject) => {
            const sql = 'select * from todoList'
            connPool.query(sql, (err, rows) => {
                if (err) reject(err)
                else resolve(rows)
            })
        })
    },
    getItemsForUser: (user) => {
        return new Promise((resolve, reject) => {
            const sql = 'select * from todoList where user = ?'
            connPool.query(sql, [user], (err, rows) => {
                if (err) reject(err)
                else resolve(rows)
            })
        })
    },
    getCompleteItemsForUser: (user) => {
        return new Promise((resolve, reject) => {
            const sql = 'select * from todoList where user = ? and done = 1'
            connPool.query(sql, [user], (err, rows) => {
                if (err) reject(err)
                else resolve(rows)
            })
        })
    },
    getIncompleteItemsForUser: (user) => {
        return new Promise((resolve, reject) => {
            const sql = 'select * from todoList where user = ? and done = 0'
            connPool.query(sql, [user], (err, rows) => {
                if (err) reject(err)
                else resolve(rows)
            })
        })
    },
    toggleCompletion: (item) => {
        return new Promise((resolve, reject) => {
            const sql = 'update todoList set done = 1 - done where item = ?'
            connPool.query(sql, [item], (err, rows) => {
                if (err) reject(err)
                else if (rows.length > 0) resolve(rows[0])
                else resolve(undefined)
            })
        })
    }
}