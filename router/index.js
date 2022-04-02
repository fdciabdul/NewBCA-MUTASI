const bca = require("../lib/bca");
const db = require("../lib/db");
const fs = require("fs");
const moment = require('moment');
const now = moment();
var format = require("date-format");

function makeid(length) {
  var result = "";
  var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = async function (app) {
  app.get("/", function (req, res) {
    res.render("index", {
      inputdate: now.format('DD-MM-YYYY')
    });
  });

  app.post("/check", async function (req, res) {

    const cekakun = await db.cekakun(req.body.user);
    console.log(cekakun)
    var id = makeid(5);
    if (cekakun) {
      const get = await db.getakun(req.body.user);
 
      res.redirect("/get/" + get[0].link);
    } else {

      // 


      var tanggalawal = req.body.date_begin.split(/-/g)[0].toString();
      var bulanawal = req.body.date_begin.split(/-/g)[1].toString();
      var tanggalakhir = req.body.date_end.split(/-/g)[0].toString();
      var bulanakhir = req.body.date_end.split(/-/g)[1].toString();
      console.log(tanggalawal, bulanawal, tanggalakhir, bulanakhir);
      await db.insertakun(req.body.user, req.body.pass, id, tanggalawal, bulanawal, tanggalakhir, bulanakhir);

      res.redirect("/get/" + id);
    }




  });
};