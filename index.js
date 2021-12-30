const http = require("http");
const url = require("url");
const fs = require("fs");

http
  .createServer(function (req, res) {
    //? LEVANTA HTML
    if (req.url == "/") {
      res.writeHead(200, "Content-Type", "text.html");
      fs.readFile("index.html", "utf8", (err, registro) => {
        res.end(registro);
      });
    }

    //? MOSTRAR DATA
    if (req.url.startsWith("/deportes") && req.method == "GET") {
      const leerArchivoComoAsync = () => {
        new Promise((resolve, reject) => {
          fs.readFile("data.json", "utf8", (err, data) => {
            if (err) throw err;
            resolve(res.end(data));
          });
        });
      };

      const leer = async () => {
        await leerArchivoComoAsync();
      };

      leer();
    }

    //? AGREGAR DATA
    //! CAMBIAR LOS SYNCS
    if (req.url.startsWith("/agregar") && req.method == "POST") {
      const data = JSON.parse(fs.readFileSync("data.json", "utf8"));
      const deportes = data.deportes;

      let body = "";

      req.on("data", (payload) => {
        body = JSON.parse(payload);
      });

      req.on("end", () => {
        deporte = {
          nombre: body.nombre,
          precio: body.precio,
        };
        deportes.push(deporte);

        fs.writeFileSync("data.json", JSON.stringify(data), (err, data) => {
          err ? console.log(" oh oh...") : console.log(" OK ");
        });
        res.end("Deporte agregado exitosamente");
      });
    }

    //? EDITAR DATA
    if (req.url.startsWith("/editar") && req.method == "PUT") {
      /*const data = JSON.parse(fs.readFileSync("data.json", "utf8"));
      const deportes = data.deportes;
      */
      let body;

      req.on("data", (payload) => {
        body = JSON.parse(payload);
      });
      req.on("end", () => {
        const { nombre, precio } = body;

        fs.readFile("data.json", "utf8", (err, data) => {
          if (data) {
            const deportes = JSON.parse(data).deportes;

            deportes = deportes.map((sports) => {
              if (sports.nombre == nombre) {
                sports.precio = precio;
              }
              return sports;
            });

            //!ERROR
            fs.writeFile("data.json", JSON.stringify({ deportes }));
            res.end("Deporte editado exitosamente");
          }
        });
      });
    }

    //? ELIMINAR DATA
    //! CAMBIAR SYNC
    if (req.url.startsWith("/eliminar") && req.method == "DELETE") {
      const { nombre } = url.parse(req.url, true).query;
      const data = JSON.parse(fs.readFileSync("data.json", "utf8"));
      const deportes = data.deportes;

      data.deportes = deportes.filter(
        (filterData) => filterData.nombre !== nombre
      );

      fs.writeFileSync("data.json", JSON.stringify(data));
      res.end("Deporte eliminado exitosamente");
    }
  })
  .listen(3000, () => console.log("Server ON"));

//! FALTA TESTING
