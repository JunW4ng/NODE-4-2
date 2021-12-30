const http = require("http");
const url = require("url");
const fs = require("fs");

const server = http
  .createServer(function (req, res) {
    //? LEVANTA HTML
    if (req.url == "/") {
      res.writeHead(200, "Content-Type", "text.html");

      fs.readFile("index.html", "utf8", (err, registro) => {
        err ? console.log("Error al cargar pagina") : console.log("Pagina OK");
        res.end(registro);
      });
    }

    //? MOSTRAR DATA
    if (req.url.startsWith("/deportes") && req.method == "GET") {
      const leerArchivoComoAsync = () => {
        new Promise((resolve) => {
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
    if (req.url.startsWith("/agregar") && req.method == "POST") {
      let body;

      req.on("data", (payload) => {
        body = JSON.parse(payload);
      });

      req.on("end", () => {
        const { nombre, precio } = body;

        fs.readFile("data.json", "utf8", (err, data) => {
          deporte = {
            nombre: nombre,
            precio: precio,
          };

          let deportes = JSON.parse(data).deportes;
          deportes.push(deporte);

          fs.writeFile(
            "data.json",
            JSON.stringify({ deportes }),
            (err, data) => {
              err ? console.log(" oh oh...") : console.log(" OK ");
            }
          );
          res.end("Deporte agregado exitosamente");

          err
            ? console.log("Error al leer el archivo (POST)")
            : console.log("Archivo OK (POST)");
        });
      });
    }

    //? EDITAR DATA
    if (req.url.startsWith("/editar") && req.method == "PUT") {
      let body;

      req.on("data", (payload) => {
        body = JSON.parse(payload);
      });

      req.on("end", () => {
        const { nombre, precio } = body;

        fs.readFile("data.json", "utf8", (err, data) => {
          if (data) {
            let deportes = JSON.parse(data).deportes;

            deportes = deportes.map((sports) => {
              if (sports.nombre == nombre) {
                sports.precio = precio;
              }
              return sports;
            });

            fs.writeFile("data.json", JSON.stringify({ deportes }), (err) => {
              err ? console.log(" oh oh...") : console.log(" OK ");
              res.end("Deporte editado exitosamente");
            });

            err
              ? console.log("Error al leer el archivo (PUT)")
              : console.log("Archivo OK (PUT)");
          }
        });
      });
    }

    //? ELIMINAR DATA
    if (req.url.startsWith("/eliminar") && req.method == "DELETE") {
      const { nombre } = url.parse(req.url, true).query;

      fs.readFile("data.json", "utf8", (err, data) => {
        let deportes = JSON.parse(data).deportes;
        if (data) {
          deportes = deportes.filter(
            (filterData) => filterData.nombre !== nombre
          );
        }

        fs.writeFile("data.json", JSON.stringify({ deportes }), (err, data) => {
          err ? console.log(" oh oh...") : console.log(" OK ");
          res.end("Deporte eliminado exitosamente");
        });

        err
          ? console.log("Error al leer el archivo (DELETE)")
          : console.log("Archivo OK (DELETE)");
      });
    }
  })
  .listen(3000, () => console.log("Server ON"));

module.exports = server;
