// const request = require("request");
// const Iconv = require("iconv-lite");
const cheerio = require("cheerio");
const superagent = require("superagent");
const fs = require("fs");

// 页面url
const pageUrl =
  "https://escapefromtarkov.fandom.com/zh/wiki/%E6%88%98%E5%88%A9%E5%93%81";
// 爬取结果
const result = [];
// 发起请求
superagent.get(pageUrl).end(function (err, pres) {
  // cheerio
  var $ = cheerio.load(pres.text);
  // wikitable表格
  const wikitable = $(".wikitable");
  // 表格tr
  const wikitable_tr = wikitable.find("tr");
  // 遍历表格行
  wikitable_tr.each(function (index, element) {
    // 行数据
    const info = [];
    // 行 子元素
    const wikitable_tr_child = $(element).children();
    // 遍历 行 子元素
    wikitable_tr_child.each((itd, td) => {
      if (itd === 0) {
        // 第1格取链接
        info.push($(td)?.find("img")?.[0]?.attribs["data-src"]);
      } else {
        // 第2，3格去除'\n'
        if (itd === 1 || itd === 2) {
          info.push($(td).text().replace("\n", ""));
        }
        // 第4格
        if (itd === 3) info.push($(td).text());
      }
    });
    result.push(info);
  });

  // 写入文件
  fs.writeFile("result.js", JSON.stringify(result), (err) => {
    if (err) {
      return console.error(err);
    }
    console.log("数据写入成功!");
  });
});
