import {db} from '../db/db';
import { OkPacket, RowDataPacket  } from 'mysql2';
import {Account, Wallet,Transaction} from '../types/account';
import bcrypt from 'bcrypt';
export const create =async (mpvaccount:Account, callback: Function) => {
    const sql = "insert into mpvaccount(firstname, lastname, middlename, email, phone, password) values(?,?,?,?,?,?)"
  const passwordHash =await bcrypt.hash(mpvaccount.password,10);
    db.query(
      sql,
      [mpvaccount.firstname,mpvaccount.lastname,mpvaccount.middlename,mpvaccount.email,mpvaccount.phone,passwordHash],
      (err, result) => {
        if (err) {callback(err);
        };
       // console.log(result);
        const insertId = (<OkPacket> result).insertId;
        //create account wallet
        const sql ="insert into mpvwallet (user_id, walletbalance) values(?,?)";
        db.query(sql, [insertId,0], (err,results)=>{});
        callback(null,mpvaccount);
      }
    );
  };

  export const accounts = (callback:Function)=>{
const sql ="select * from mpvaccount";
db.query(sql, (err,results)=>{
if(err){
    callback(err);
}
    callback(null, results);
});
  };

  export const useraccounts = (user_id:number,callback:Function)=>{
    const sql ="select * from mpvaccount where user_id =?";
    db.query(sql, [user_id], (err,results)=>{
    if(err){
        callback(err);
    }
        callback(null, results);
    });
      };