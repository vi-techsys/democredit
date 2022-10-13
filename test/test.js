const supertest = require("supertest");
const should = require("should");
const mocha = require("mocha");
const express = require("express");
const server = supertest.agent("http:localhost:3000");

describe("Demo credit test", (done) => {
  it("should return all accounts", () => {
    server
      .get("/wallet")
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        res.status.should.equal(200);
        console.log("accounts endpoint");
        console.log(res.body);
      });
  });

  it("should return registered object", (done) => {
    server
      .post("/wallet/register")
      .send({
        firstname: "Rock",
        lastname: "Bella",
        middlename: "Olusola",
        password: "12345",
        email: "rockbell@gmail.com",
        phone: "08830122221",
      })
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        //console.log(err);
        console.log(res);
        res.status.should.equal(200);
      });
    console.log("register endpoint");
    //  console.log(res.body);
  });
});
