const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
chai.use(chaiHttp);

describe("Respuesta JSON de la ruta '/deportes'", () => {
  it("Probando ruta", () => {
    chai
      .request(server)
      .get("/deportes")
      .end((err, res) => {
        let data = JSON.parse(res.text);
        chai.expect(data).to.have.property('deportes');
        chai.expect(data.deportes).to.be.an("array");
      });
  });
});
