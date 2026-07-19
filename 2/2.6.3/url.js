const url = require("url");

const { URL } = url;
const myURL = new URL(
  "https://www.gilbut.co.kr/book/view?bookcode=BN003588#bookCont3",
);
console.log("new URL():", myURL);
console.log("url.format():", url.format(myURL));
