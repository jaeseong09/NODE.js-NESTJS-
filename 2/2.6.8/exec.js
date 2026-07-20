const { exec } = require("child_process");

const process = exec("ls");

process.stdout.on("data", function (data) {
  console.log(data.toString());
}); // 실행 결과

process.stdout.on("data", function (data) {
  console.error(data.toString());
}); // 실행 에러
