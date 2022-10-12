import {db} from '../db/db';
import { OkPacket, RowDataPacket  } from 'mysql2';
import {Account, Wallet,Transaction} from '../types/account';
import bcrypt from 'bcrypt';
export const create = (mpvaccount:Account, callback: Function) => {
    const sql = "insert into mpvaccount(firstname, lastname, middlename, email, phone, password) values(?,?,?,?,?,?)"
  const passwordHash = 
    db.query(
      sql,
      [mpvaccount.firstname,mpvaccount.lastname,mpvaccount.middlename,mpvaccount.email,mpvaccount.phone,],
      (err, result) => {
        if (err) {callback(err)};
        const insertId = (<OkPacket> result).insertId;
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