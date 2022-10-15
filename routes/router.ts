import express, {Request, Response, NextFunction} from 'express';
import * as walletService from '../services/walletservice';
import { OkPacket, RowDataPacket  } from 'mysql2';
import { Account, Wallet} from '../types/account';
import {db} from '../db/db';
import bcrypt from 'bcrypt';
import {v4 as uuid} from 'uuid';
const router = express.Router();

function loggedIn(req:Request, res:Response, next:NextFunction){
    const token:string =String(req.headers['token']);
const sql ="select time from session where token =?";
db.query(sql, [token],(err, results)=>{
    if (err) {
        throw err;
        console.log(err);
      }
      const row = <RowDataPacket[]> results;
      if (row.length!=0) {
        let currenTime = Math.floor(Date.now() / 1000);
        let lastTime = row[0].time;
       // console.log(row);
        console.log("Currnt" + currenTime);
        console.log("Last" + lastTime);
        //if no activities for 5 mins
        if (currenTime - lastTime < 600) {
            db.query("update session set time =? where token =?", [
              currenTime,
              token,
            ]);
            next();
          } else {
            res.status(404).json({
              error: "Token expired",
              response: "Please Login",
            });
          }
      }
      else
      {
        res.status(404).json({
            error: "Token expired",
            response: "Please Login",
          });
      }
})
};
router.post("/register",async (req:Request, res:Response)=>{
    const account:Account = req.body;
    //check email and phone
  const check_sql ="select * from mpvaccount where email =? or phone =?";
  db.query(check_sql,[account.email,account.phone], (err,results)=>{
  if(err){
     res.status(500).json({error: err.message, response:null});
     return
  }
   const check_result = <RowDataPacket[]>results;
   if(check_result.length>0)
   {
   res.status(403).json({error:"Account already exists",response:null});
    return;
   }
   else
   {
    walletService.create(account,(err:Error, account:Account)=>{
      if(err){
           res.status(500).json({error: err.message, response:null});
           return;
      }
      res.status(200).json({error:null,response: account});
  })
   }
  });
})


router.get("/",(req:Request, res:Response)=>{
walletService.accounts((err:Error,results:RowDataPacket)=>{
if(err){
    return res.status(500).json({error: err.message,response:null});
}
res.status(200).json({error:null,response: results});
})
})

let viewwallet = function (id:number) {
    return new Promise((resolve, reject) => {
      let sql = "select * from mpvwallet where user_id = '" + id + "'";
      db.query(sql, (err, results) => {
        if (err) {
          resolve({});
          throw err;
        }
        const row = <RowDataPacket[]>results;
        resolve(row[0]);
      });
    });
  };
router.get("/:id",loggedIn, async (req:Request, res:Response)=>{
    const user_id:number = Number.parseInt(req.params.id);
    /*walletService.useraccounts(user_id,(err:Error,results:RowDataPacket)=>{
    if(err){
        return res.status(404).json({"message": err.message});
    }
    res.status(200).json({"accounts":results});
    })*/
    let walletrow = await viewwallet(user_id);
    if(walletrow==null)
    {
      res.status(404).json({error:"User not found",response:null});
      return;
    }
    res.status(200).json({error:null,response:walletrow});
    })
    router.post("/viewwallet", loggedIn, async (req:Request, res:Response) => {
        let walletrow = await viewwallet(req.body.id);
        //console.log(results);
        if (walletrow != null) {
          res.status(200).json({ error: null, response: walletrow });
        } else {
          res.status(404).json({
            error: "User wallet not found",
            response: null,
          });
        }
      });

router.post("/login", (req:Request, res:Response) => {
        const { email, password } = req.body;
        db.query(
          "select * from mpvaccount where email=?",
          [email],
          async (err, results) => {
            if (err) {
              throw err;
              console.log(err);
            } else {
                const row = <RowDataPacket[]>results;
              if (row.length != 0) {
                const check = await bcrypt.compare(password, row[0].password);
                if (check) {
                  //create session for user
                  const uid:string = uuid();
                  const t:number = Date.now();
                  let timestamp_ = Math.floor(t / 1000);
                  let ip = req.headers["ip"];
                  db.query(
                    "insert into session values(?,?,?,?)",
                    [uid, JSON.stringify(row[0]), ip, timestamp_],
                    (err, results_) => {
                      if (err) {
                        throw err;
                        console.log(err);
                      }
                    }
                  );
                  res.status(200).json({
                    error: null,
                    response: uid,
                  });
                } else {
                  res.status(404).json({
                    error: "User not found",
                    response: [],
                  });
                }
              } else {
                res.status(404).json({error: "User not found", response: results });
              }
            }
          }
        );
});

router.post("/fundwallet", loggedIn, (req:Request, res:Response) => {
    const { id, amount, source } = req.body;
    db.beginTransaction((err) => {
      let sql =
        "select a.*, w.* from mpvaccount a inner join mpvwallet w on a.user_id =w.user_id where a.user_id = '" +
        id +
        "'";
      //let sql = "select * from mpvwallet where user_id = '" + id + "'";
      db.query(sql, (err, results) => {
        if (err) {
          db.rollback(() => {
            res.status(404).json({
              error: "Process terminated. Transaction rolled back",
              response: [],
            });
            throw err;
          });
        }
        const rowwallet = <RowDataPacket[]>results;
       // console.log(rowwallet);
        if (rowwallet.length != 0) {
          let balance:number = Number(amount) + Number(rowwallet[0].walletbalance);
          db.query(
            "update mpvwallet set walletbalance = ? where user_id=?",
            [balance, id],
            (err, result) => {
              if (err) {
                db.rollback(() => {
                  res.status(404).json({
                    error: "Process terminated. Transaction rolled back",
                    response: [],
                  });
                  throw err;
                });
              }
              db.query(
                "insert into transactions(user_id,amount,walletbalance,type,source) values(?,?,?,?,?)",
                [id, amount, balance, "fund", source],
                (err, result) => {
                  if (err) {
                    db.rollback(() => {
                      res.status(404).json({
                        error: "Process terminated. Transaction rolled back",
                        response: [],
                      });
                      throw err;
                    });
                  }
                  db.commit((err) => {
                    if (err) {
                      db.rollback(() => {
                        res.status(404).json({
                          error: "Process terminated. Try again",
                          response: [],
                        });
                        throw err;
                      });
                    }
                    res.status(404).json({error: null, response: balance });
                  });
                }
              );
            }
          );
        } else {
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
    db.beginTransaction((err) => {
      if (err) {
        db.rollback(() => {
          res.status(500).json({
            error: "Process terminated. Transaction rolled back",
            response: [],
          });
          throw err;
        });
      }
      let sql =
        "select a.*, w.* from mpvaccount a inner join mpvwallet w on a.user_id =w.user_id where a.user_id = '" +
        id +
        "'";
      //let sql = "select * from mpvwallet where user_id = '" + id + "'";
      db.query(sql, (err, results) => {
        if (err) {
          db.rollback(() => {
            res.status(500).json({
              error: "Process terminated. Transaction rolled back",
              response: [],
            });
            throw err;
          });
        }
        const rowwallet = <RowDataPacket[]>results;
        if (rowwallet.length == 0) {
          res.status(404).json({
            error: "User wallet not found",
            response: [],
          });
          return;
        }
        if (rowwallet[0].walletbalance < amount) {
          res.status(400).json({
            error: "Wallet Balance is not sufficient",
            response: [],
          });
          //throw "Wallet balance is not sufficient";
          return;
        }
        let balance:number = Number(rowwallet[0].walletbalance) - Number(amount);
        db.query(
          "update mpvwallet set walletbalance = ? where user_id=?",
          [balance, id],
          (err, result) => {
            if (err) {
              db.rollback(() => {
                res.status(500).json({
                  error: "Process terminated. Transaction rolled back",
                  response: [],
                });
                throw err;
              });
            }
            db.query(
              "insert into transactions(user_id,amount,walletbalance,type,destination,source) values(?,?,?,?,?,?)",
              [id, amount, balance, "transfer", user_id,"wallet"],
              (err, result) => {
                if (err) {
                  db.rollback(() => {
                    res.status(500).json({
                      error: "Process terminated. Transaction rolled back",
                      response: [],
                    });
                    throw err;
                  });
                }
                db.query(
                  "update mpvwallet set walletbalance = ? + walletbalance where user_id=?",
                  [amount, user_id],
                  async (err, result) => {
                    if (err) {
                      db.rollback(() => {
                        res.status(500).json({
                          error: "Process terminated. Transaction rolled back",
                          response: [],
                        });
                        throw err;
                      });
                    }
                    let userWallet = await viewwallet(user_id) as Wallet;
                    db.query(
                      "insert into transactions(user_id,amount,walletbalance,type,source) values(?,?,?,?,?)",
                      [user_id, amount, userWallet.walletbalance, "receive", id,],
                      (err, result) => {
                        if (err) {
                          db.rollback(() => {
                            res.status(500).json({
                              error: "Process terminated. Transaction rolled back",
                              response: [],
                            });
                            throw err;
                          });
                        }
                        db.commit((err) => {
                          if (err) {
                            db.rollback(() => {
                              res.status(500).json({
                                error: "Process terminated. Transaction rolled back",
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
                      }
                    ); //insert
                  }
                ); //update wallet
              }
            ); //insert
          }
        ); //update wallet
      });
    });
  });

  router.post("/withdraw", loggedIn, (req:Request, res:Response) => {
    const { id, amount, destination } = req.body;
    db.beginTransaction((err) => {
      let sql =
        "select a.*, w.* from mpvaccount a inner join mpvwallet w on a.user_id =w.user_id where a.user_id = '" +
        id +
        "'";
      //let sql = "select * from mpvwallet where user_id = '" + id + "'";
      db.query(sql, (err, results) => {
        if (err) {
          db.rollback(() => {
            res.status(500).json({
              error: "Process terminated. Transaction rolled back",
              response: [],
            });
            throw err;
          });
        }
        const rowwallet = <RowDataPacket[]>results;
       // console.log(rowwallet);
        if (rowwallet.length != 0) {
            if(Number(rowwallet[0].walletbalance)<Number(amount))
            {
                db.rollback(() => {
                    res.status(400).json({
                      error: "Insufficient balance in wallet",
                      response: [],
                    });
                  });
                  return;   
            }
          let balance:number = Number(rowwallet[0].walletbalance)-Number(amount);
          db.query(
            "update mpvwallet set walletbalance = ? where user_id=?",
            [balance, id],
            (err, result) => {
              if (err) {
                db.rollback(() => {
                  res.status(500).json({
                    error: "Process terminated. Transaction rolled back",
                    response: [],
                  });
                  throw err;
                });
              }
              db.query(
                "insert into transactions(user_id,amount,walletbalance,type,destination) values(?,?,?,?,?)",
                [id, amount, balance, "withdraw", destination],
                (err, result) => {
                  if (err) {
                    db.rollback(() => {
                      res.status(500).json({
                        error: "Process terminated. Transaction rolled back",
                        response: [],
                      });
                      throw err;
                    });
                  }
                  db.commit((err) => {
                    if (err) {
                      db.rollback(() => {
                        res.status(500).json({
                          error: "Process terminated. Try again",
                          response: [],
                        });
                        throw err;
                      });
                    }
                    res.status(404).json({error: null, response: balance });
                  });
                }
              );
            }
          );
        } else {
          res.status(404).json({
            error: "User wallet not found",
            response: [],
          });
        }
      });
    });
  });
export {router};

