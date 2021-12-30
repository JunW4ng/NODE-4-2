var fs = require("fs");

const readFileAsSync = () => {
  new Promise((resolve, reject) => {
    fs.readFile(filename, "utf8", (err, data) => {
      if (err) throw err;
      resolve(data);
    });
  });
};

const callRead = async () => {
  let data = await readFileAsSync();
  console.log(data);
};

callRead();
