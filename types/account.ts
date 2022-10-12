export interface Account{
    firstname:string,
    lastname:string,
    middlename:string,
    email:string,
    phone:string,
    date_registered:Date,
    password:string
}
export interface Wallet{
    user_id:number,
    walletbalance:number,
    date_opened:Date
}

export interface Transaction{
    user_id:number,
    amount:number,
    walletbalance:number,
    type:string,
    source:string,
    destination:string,
    date_created:Date
}