const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
const server = require("../app");
const Status = require("../models/status");
const mongoose = require("mongoose");

chai.use(chaiHttp);

describe("Test", () => {
  

  it("should POST a valid status", (done) => {
    let status = {
      userProfileId: new mongoose.Types.ObjectId(), // Corrected userProfileId generation
      content: "This is a test status",
      tags: ["test", "status"],
      likes: [],
      comments: [],
    };
    chai
      .request(server)
      .post("/status")
      .send(status)
      .end((err, res) => {
        expect(res).to.have.status(201); // Expecting status code 201 for created

        // Checking if the response body contains the created status object
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("_id"); // Expecting the created status to have an _id
        expect(res.body)
          .to.have.property("userProfileId")
          .eql(status.userProfileId.toString()); // Expecting userProfileId to match
        expect(res.body).to.have.property("content").eql(status.content); // Expecting content to match
        expect(res.body).to.have.property("tags").eql(status.tags); // Expecting tags to match
        expect(res.body).to.have.property("likes").eql(status.likes); // Expecting likes to match
        expect(res.body).to.have.property("comments").eql(status.comments); // Expecting comments to match

        done();
      });
  });
});
