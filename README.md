# democredit

# in phpmyadmin, create database mpvwallet

# run the following sql statements

CREATE TABLE `mpvwallet` (
`walletid` bigint NOT NULL AUTO_INCREMENT,
`user_id` bigint NOT NULL,
`walletbalance` DECIMAL NOT NULL DEFAULT '0',
`date_opened` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (`walletid`)
);

CREATE TABLE `mpvaccount` (
`user_id` bigint NOT NULL AUTO_INCREMENT,
`firstname` varchar(50),
`lastname` varchar(50),
`middlename` varchar(50),
`email` varchar(50) NOT NULL,
`phone` varchar(50) NOT NULL,
`password` varchar(50) NOT NULL,
`date_registered` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (`user_id`)
);

CREATE TABLE `transaction` (
`transactionid` bigint NOT NULL AUTO_INCREMENT,
`user_id` bigint NOT NULL,
`amount` DECIMAL NOT NULL DEFAULT '0',
`walletbalance` DECIMAL NOT NULL DEFAULT '0',
`type` varchar(10) NOT NULL,
`source` varchar(100),
`date_created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
`destination` varchar(100),
PRIMARY KEY (`transactionid`)
);

CREATE TABLE `session` (
`token` varchar(100) NOT NULL,
`data` varchar(1000) NOT NULL,
`ip` varchar(30) NOT NULL,
`time` bigint NOT NULL,
PRIMARY KEY (`token`)
);

# endpoints:

1.  /wallet/login
    method: POST
    body: {
    "email":"ajib@gmail.com",
    "password":"12345"
    }
    header: ip
    reponse: return token on succesful login

2.  /walletusers/register
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
3.  /wallet/id
    method:GET
    header: token
    response: returns wallet object
4.  /wallet/viewwallet
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
