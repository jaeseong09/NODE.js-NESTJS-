const { odd, even } = require("./var");
const checkNumber = require("./func");

function checkStringOddOrEvev(str) {
  if (str.length % 2) {
    return odd;
  }
  return even;
}

console.log(checkNumber(10));
console.log(checkStringOddOrEvev("hello"));
