"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useraccounts = exports.accounts = exports.create = void 0;
const db_1 = require("../db/db");
const create = (mpvaccount, callback) => {
    const sql = "insert into mpvaccount(firstname, lastname, middlename, email, phone, password) values(?,?,?,?,?,?)";
    const passwordHash = db_1.db.query(sql, [mpvaccount.firstname, mpvaccount.lastname, mpvaccount.middlename, mpvaccount.email, mpvaccount.phone,], (err, result) => {
        if (err) {
            callback(err);
        }
        ;
        const insertId = result.insertId;
        callback(null, mpvaccount);
    });
};
exports.create = create;
const accounts = (callback) => {
    const sql = "select * from mpvaccount";
    db_1.db.query(sql, (err, results) => {
        if (err) {
            callback(err);
        }
        callback(null, results);
    });
};
exports.accounts = accounts;
const useraccounts = (user_id, callback) => {
    const sql = "select * from mpvaccount where user_id =?";
    db_1.db.query(sql, [user_id], (err, results) => {
        if (err) {
            callback(err);
        }
        callback(null, results);
    });
};
exports.useraccounts = useraccounts;
