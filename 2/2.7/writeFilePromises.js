const fs = require("fs").promises;

fs.writeFile("./writeme2.txt", "글이 입력됩니다")
  .then(() => fs.readFile("./writeme2.txt"))
  .then((data) => {
    console.log(data.toString());
  })
  .catch((err) => {
    console.error(err);
  });
