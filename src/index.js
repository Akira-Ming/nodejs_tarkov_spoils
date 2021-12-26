// const request = require("request");
const Iconv = require("iconv-lite");
const cheerio = require("cheerio");
const superagent = require("superagent");
const fs = require("fs");

const pageUrl =
  "https://escapefromtarkov.fandom.com/zh/wiki/%E6%88%98%E5%88%A9%E5%93%81";

const result = [];
superagent.get(pageUrl).end(function (err, pres) {
  var $ = cheerio.load(pres.text);
  // let ii = 0;
  $(".wikitable")
    .find("tr")
    .each(function (index, element) {
      const info = [];
      $(element)
        .children()
        .each((itd, td) => {
          if (itd === 0) {
            info.push($(td)?.find("img")?.[0]?.attribs["data-src"]);
          } else {
            if (itd === 1 || itd === 2) {
              info.push($(td).text().replace("\n", ""));
            }
            if (itd === 3) info.push($(td).text());
          }
        });
      // console.log(info);
      result.push(info);
      // ii++;
      // if (ii === 5) return false;
    });
  // console.log(result);
  fs.writeFile("result.js", JSON.stringify(result), (err) => {
    if (err) {
      return console.error(err);
    }
    console.log("数据写入成功！");
  });
});
