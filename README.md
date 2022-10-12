# democredit
# in phpmyadmin, create database mpvwallet
# import mpvwallet.sql
# endpoints:
# 1. /wallet/login
  method: POST
  body: {
    "email":"ajib@gmail.com",
    "password":"12345"
   }
  header: ip
  reponse: return token on succesful login
  
 2. /walletusers/register
    method: POST
    body: {
    "firstname":"Biodun",
    "lastname":"Wales",
    "middlename":"Tom",
    "password": "12345",
    "email":"tom@gmail.com",
    "phone" : "088309851884"
     }
     response: returns account object after successulf register
     
 3. /wallet/id
      method:GET
      header: token
      response: returns wallet object
 4. /wallet/viewwallet
     method: POST
     body: {
    "id":8
     }
     header: token
     response: returns wallet object
 5.  /wallet/fundwallet
     method: POST
     body: {
    "id":5,
    "amount":5,
    "source": "card"
     }
     header: token
     response: return wallet balance after funding
 6.  /wallet/funduserwallet
     method: POST
     body: {
    "id":8,
    "amount":50,
    "user_id":5
     }
     header: token
     response: returns wallet balance after sending from wallet to other user
 7.  /wallet/withdraw
     method: POST
     body: {
    "id":5,
    "amount":500,
    "destination": "bank"
    }
    header: token
    response: return wallet balance after successful withdraw
