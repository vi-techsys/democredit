"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const walletService = __importStar(require("../services/walletservice"));
const db_1 = require("../db/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const router = express_1.default.Router();
exports.router = router;
function loggedIn(req, res, next) {
    const token = String(req.headers['token']);
    const sql = "select time from session where token =?";
    db_1.db.query(sql, [token], (err, results) => {
        if (err) {
            throw err;
            console.log(err);
        }
        const row = results;
        if (row.length != 0) {
            let currenTime = Math.floor(Date.now() / 1000);
            let lastTime = row[0].time;
            console.log(row);
            console.log("Currnt" + currenTime);
            console.log("Last" + lastTime);
            //if no activities for 5 mins
            if (currenTime - lastTime < 600) {
                db_1.db.query("update session set time =? where token =?", [
                    currenTime,
                    token,
                ]);
                next();
            }
            else {
                res.status(404).json({
                    error: "Token expired",
                    response: "Please Login",
                });
            }
        }
        else {
            res.status(404).json({
                error: "Token expired",
                response: "Please Login",
            });
        }
    });
}
;
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const account = req.body;
    walletService.create(account, (err, account) => {
        if (err) {
            return res.status(500).json({ error: err.message, response: null });
        }
        res.status(200).json({ error: null, response: account });
    });
}));
router.get("/", (req, res) => {
    walletService.accounts((err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message, response: null });
        }
        res.status(200).json({ error: null, response: results });
    });
});
let viewwallet = function (id) {
    return new Promise((resolve, reject) => {
        let sql = "select * from mpvwallet where user_id = '" + id + "'";
        db_1.db.query(sql, (err, results) => {
            if (err) {
                resolve({});
                throw err;
            }
            const row = results;
            resolve(row[0]);
        });
    });
};
router.get("/:id", loggedIn, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = Number.parseInt(req.params.id);
    /*walletService.useraccounts(user_id,(err:Error,results:RowDataPacket)=>{
    if(err){
        return res.status(404).json({"message": err.message});
    }
    res.status(200).json({"accounts":results});
    })*/
    let walletrow = yield viewwallet(user_id);
    res.status(200).json({ error: null, response: walletrow });
}));
router.post("/viewwallet", loggedIn, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let walletrow = yield viewwallet(req.body.id);
    //console.log(results);
    if (walletrow != null) {
        res.status(200).json({ error: null, response: walletrow });
    }
    else {
        res.status(200).json({
            error: "User wallet not found",
            response: null,
        });
    }
}));
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    db_1.db.query("select * from mpvaccount where email=?", [email], (err, results) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            throw err;
            console.log(err);
        }
        else {
            const row = results;
            if (row.length != 0) {
                const check = yield bcrypt_1.default.compare(password, row[0].password);
                if (check) {
                    //create session for user
                    const uid = (0, uuid_1.v4)();
                    const t = Date.now();
                    let timestamp_ = Math.floor(t / 1000);
                    let ip = req.headers["ip"];
                    db_1.db.query("insert into session values(?,?,?,?)", [uid, JSON.stringify(row[0]), ip, timestamp_], (err, results_) => {
                        if (err) {
                            throw err;
                            console.log(err);
                        }
                    });
                    res.status(200).json({
                        error: null,
                        response: uid,
                    });
                }
                else {
                    res.status(404).json({
                        error: "User not found",
                        response: [],
                    });
                }
            }
            else {
                res.status(404).json({ error: "User not found", response: results });
            }
        }
    }));
});
router.post("/fundwallet", loggedIn, (req, res) => {
    const { id, amount, source } = req.body;
    db_1.db.beginTransaction((err) => {
        let sql = "select a.*, w.* from mpvaccount a inner join mpvwallet w on a.user_id =w.user_id where a.user_id = '" +
            id +
            "'";
        //let sql = "select * from mpvwallet where user_id = '" + id + "'";
        db_1.db.query(sql, (err, results) => {
            if (err) {
                db_1.db.rollback(() => {
                    res.status(404).json({
                        error: "Process terminated. Fetch user",
                        response: [],
                    });
                    throw err;
                });
            }
            const rowwallet = results;
            console.log(rowwallet);
            if (rowwallet.length != 0) {
                let balance = Number(amount) + Number(rowwallet[0].walletbalance);
                db_1.db.query("update mpvwallet set walletbalance = ? where user_id=?", [balance, id], (err, result) => {
                    if (err) {
                        db_1.db.rollback(() => {
                            res.status(404).json({
                                error: "Process terminated. Update wallet",
                                response: [],
                            });
                            throw err;
                        });
                    }
                    db_1.db.query("insert into transactions(user_id,amount,walletbalance,type,source) values(?,?,?,?,?)", [id, amount, balance, "fund", source], (err, result) => {
                        if (err) {
                            db_1.db.rollback(() => {
                                res.status(404).json({
                                    error: "Process terminated. Save transaction",
                                    response: [],
                                });
                                throw err;
                            });
                        }
                        db_1.db.commit((err) => {
                            if (err) {
                                db_1.db.rollback(() => {
                                    res.status(404).json({
                                        error: "Process terminated. Try again",
                                        response: [],
                                    });
                                    throw err;
                                });
                            }
                            res.status(404).json({ error: null, response: balance });
                        });
                    });
                });
            }
            else {
                res.status(404).json({
                    error: "User wallet not found",
                    response: [],
                });
            }
        });
    });
});
router.post("/funduserwallet", loggedIn, (req, res) => {
    const { id, amount, user_id } = req.body;
    db_1.db.beginTransaction((err) => {
        if (err) {
            db_1.db.rollback(() => {
                res.status(404).json({
                    error: "Process terminated. Fetch user",
                    response: [],
                });
                throw err;
            });
        }
        let sql = "select a.*, w.* from mpvaccount a inner join mpvwallet w on a.user_id =w.user_id where a.user_id = '" +
            id +
            "'";
        //let sql = "select * from mpvwallet where user_id = '" + id + "'";
        db_1.db.query(sql, (err, results) => {
            if (err) {
                db_1.db.rollback(() => {
                    res.status(500).json({
                        error: "Process terminated. Fetch user",
                        response: [],
                    });
                    throw err;
                });
            }
            const rowwallet = results;
            if (rowwallet.length == 0) {
                res.status(404).json({
                    error: "User wallet not found",
                    response: [],
                });
                return;
            }
            if (rowwallet[0].walletbalance < amount) {
                res.status(401).json({
                    error: "Wallet Balance is not sufficient",
                    response: [],
                });
                //throw "Wallet balance is not sufficient";
                return;
            }
            let balance = Number(rowwallet[0].walletbalance) - Number(amount);
            db_1.db.query("update mpvwallet set walletbalance = ? where user_id=?", [balance, id], (err, result) => {
                if (err) {
                    db_1.db.rollback(() => {
                        res.status(401).json({
                            error: "Process terminated. Update wallet",
                            response: [],
                        });
                        throw err;
                    });
                }
                db_1.db.query("insert into transactions(user_id,amount,walletbalance,type,destination) values(?,?,?,?,?)", [id, amount, balance, "transfer", user_id], (err, result) => {
                    if (err) {
                        db_1.db.rollback(() => {
                            res.status(401).json({
                                error: "Process terminated. Saving fun transact",
                                response: [],
                            });
                            throw err;
                        });
                    }
                    db_1.db.query("update mpvwallet set walletbalance = ? + walletbalance where user_id=?", [amount, user_id], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
                        if (err) {
                            db_1.db.rollback(() => {
                                res.status(401).json({
                                    error: "Process terminated. Update wallet",
                                    response: [],
                                });
                                throw err;
                            });
                        }
                        let userWallet = yield viewwallet(user_id);
                        db_1.db.query("insert into transactions(user_id,amount,walletbalance,type,source) values(?,?,?,?,?)", [user_id, amount, userWallet.walletbalance, "receive", id], (err, result) => {
                            if (err) {
                                db_1.db.rollback(() => {
                                    res.status(400).json({
                                        error: "Process terminated. Saving receive",
                                        response: [],
                                    });
                                    throw err;
                                });
                            }
                            db_1.db.commit((err) => {
                                if (err) {
                                    db_1.db.rollback(() => {
                                        res.status(401).json({
                                            error: "Process terminated. commit",
                                            response: [],
                                        });
                                        throw err;
                                    });
                                }
                                res.status(200).json({
                                    error: null,
                                    response: balance,
                                });
                            }); //commit
                        }); //insert
                    })); //update wallet
                }); //insert
            }); //update wallet
        });
    });
});
router.post("/withdraw", loggedIn, (req, res) => {
    const { id, amount, destination } = req.body;
    db_1.db.beginTransaction((err) => {
        let sql = "select a.*, w.* from mpvaccount a inner join mpvwallet w on a.user_id =w.user_id where a.user_id = '" +
            id +
            "'";
        //let sql = "select * from mpvwallet where user_id = '" + id + "'";
        db_1.db.query(sql, (err, results) => {
            if (err) {
                db_1.db.rollback(() => {
                    res.status(404).json({
                        error: "Process terminated. Fetch user",
                        response: [],
                    });
                    throw err;
                });
            }
            const rowwallet = results;
            console.log(rowwallet);
            if (rowwallet.length != 0) {
                if (Number(rowwallet[0].walletbalance) < Number(amount)) {
                    db_1.db.rollback(() => {
                        res.status(404).json({
                            error: "Insufficient balance in wallet",
                            response: [],
                        });
                    });
                    return;
                }
                let balance = Number(rowwallet[0].walletbalance) - Number(amount);
                db_1.db.query("update mpvwallet set walletbalance = ? where user_id=?", [balance, id], (err, result) => {
                    if (err) {
                        db_1.db.rollback(() => {
                            res.status(404).json({
                                error: "Process terminated. Update wallet",
                                response: [],
                            });
                            throw err;
                        });
                    }
                    db_1.db.query("insert into transactions(user_id,amount,walletbalance,type,destination) values(?,?,?,?,?)", [id, amount, balance, "withdraw", destination], (err, result) => {
                        if (err) {
                            db_1.db.rollback(() => {
                                res.status(404).json({
                                    error: "Process terminated. Save transaction",
                                    response: [],
                                });
                                throw err;
                            });
                        }
                        db_1.db.commit((err) => {
                            if (err) {
                                db_1.db.rollback(() => {
                                    res.status(404).json({
                                        error: "Process terminated. Try again",
                                        response: [],
                                    });
                                    throw err;
                                });
                            }
                            res.status(404).json({ error: null, response: balance });
                        });
                    });
                });
            }
            else {
                res.status(404).json({
                    error: "User wallet not found",
                    response: [],
                });
            }
        });
    });
});
