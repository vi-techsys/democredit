"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useraccounts = exports.accounts = exports.create = void 0;
const db_1 = require("../db/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const create = (mpvaccount, callback) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = "insert into mpvaccount(firstname, lastname, middlename, email, phone, password) values(?,?,?,?,?,?)";
    const passwordHash = yield bcrypt_1.default.hash(mpvaccount.password, 10);
    db_1.db.query(sql, [mpvaccount.firstname, mpvaccount.lastname, mpvaccount.middlename, mpvaccount.email, mpvaccount.phone, passwordHash], (err, result) => {
        if (err) {
            callback(err);
        }
        ;
        // console.log(result);
        const insertId = result.insertId;
        //create account wallet
        const sql = "insert into mpvwallet (user_id, walletbalance) values(?,?)";
        db_1.db.query(sql, [insertId, 0], (err, results) => { });
        callback(null, mpvaccount);
    });
});
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
