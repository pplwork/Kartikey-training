import mocha from "mocha";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import server, { ISong } from "./index";

chai.use(chaiHttp);

describe("Testing CRUD Endpoints of music api", () => {
  /* 
    Testing Get Routes
  */
  describe("Testing Get Routes", () => {
    it("should return all songs", (done) => {
      chai
        .request(server)
        .get("/")
        .end((err, response) => {
          expect(response).status(200);
          expect(response.body).to.be.an("array");
          expect(response.body).to.have.length(4);
          done();
        });
    });
    it("should return single song with correct details", (done) => {
      const id = 1;
      chai
        .request(server)
        .get(`/${id}`)
        .end((err, response) => {
          expect(response).status(200);
          expect(response.body).to.be.an("object");
          expect(response.body).to.have.property("name", "Gul");
          done();
        });
    });
    it("should return 404 error", (done) => {
      const id = 99;
      chai
        .request(server)
        .get(`/${id}`)
        .end((err, response) => {
          expect(response).status(404);
          expect(response.body).to.be.an("object");
          expect(response.body).to.have.property("message");
          done();
        });
    });
  });
  /*
    Testing Post Route
  */
  describe("Testing Song Creation POST Route", () => {
    it("should create a new song entry", (done) => {
      const newSong: ISong = {
        name: "Random Song",
        artist: "Myself",
        genre: "Some Genre",
      };
      chai
        .request(server)
        .post(`/`)
        .send(newSong)
        .end((err, response) => {
          expect(response).status(201);
          expect(response.body).to.be.an("object");
          expect(response.body).to.have.property("name", "Random Song");
          done();
        });
    });
    it("should have recently added entry", (done) => {
      chai
        .request(server)
        .get("/")
        .end((err, response) => {
          expect(response).status(200);
          expect(response.body).to.deep.include.members([
            {
              name: "Random Song",
              artist: "Myself",
              genre: "Some Genre",
              id: 5,
            },
          ]);
          done();
        });
    });
    it("should not allow to create song with missing details", (done) => {
      const newSong: ISong = {
        name: "Random Song",
        artist: "Myself",
      };
      chai
        .request(server)
        .post("/")
        .send(newSong)
        .end((err, response) => {
          expect(response).status(400);
          done();
        });
    });
  });
  /*
    Testing Update Route 
  */
  describe("Testing Update Put Route", () => {
    it("Should update the song entry", (done) => {
      const updateSong: ISong = {
        id: 1,
        name: "Raju's Song",
      };
      chai
        .request(server)
        .put("/")
        .send(updateSong)
        .end((err, response) => {
          expect(response).status(200);
          expect(response.body).to.have.property("name", "Raju's Song");
          done();
        });
    });
  });

  /*
    Testing Delete Route
  */

  describe("Testing Delete Route", () => {
    it("Should delete the song with given id", () => {
      const id = 4;
      chai
        .request(server)
        .delete(`/${id}`)
        .end((err, response) => {
          expect(response).status(200);
          expect(response.body).to.be.a("object");
          expect(response.body).to.have.property("id", 4);
          expect(response.body).to.have.property("name", "Aoge Tum Kabhi");
        });
    });
  });
});
