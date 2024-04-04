require("dotenv").config({ path: ".env.test" });

const chai = require("chai");
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../app");
const Status = require("../models/status");

const mongoose = require("mongoose");

chai.use(chaiHttp);

describe("Test", () => {
  it("should POST a valid status", (done) => {
    let status = {
      userProfileId: mongoose.Types.ObjectId(),
        content : "This is a test status",
        tags : ["test", "status"],
        likes : [],
        comments : []
    };
    chai
      .request(server)
      .post("/status")
      .send(status)
      .end((err, res) => {
        res.should.have.status(201);

        done();
      });
  });
});
