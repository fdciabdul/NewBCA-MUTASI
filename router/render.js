const bca = require("../lib/bca");
const db = require("../lib/db");
const moment = require('moment');
const now = moment();
module.exports = async function (app) {
  app.get("/get/:id", async(req, res, next) => {
    try {
    
      const akun = await db.checklink(req.params["id"]);
      console.log(akun);
      var datenya = now.format('YYYY');
   

      const result = await bca.getSettlement(
        akun[0].username,
        akun[0].password,
        akun[0].tglawal,
        akun[0].blnawal,
        akun[0].tglakhir,
        akun[0].blnakhir
      );
     
     console.log(akun);
      res.render("render", {
        username:akun[0].username,
        result: result,
        akun: akun[0],
        inputdate: now.format('DD-MM-YYYY')
      });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  });
 
  app.post("/update-tgl", async(req,res) =>{
    let dateskarang = now.format('DD');
    var datestart = req.body.date.toString().split(/-/g);
    var dateend = req.body.date1.toString().split(/-/g);

    await db.newdate(req.body.user ,   datestart[0].padStart(2, "0"), datestart[1].replace(/0/g, '') ,dateend[0].padStart(2, "0"),dateend[1].replace(/0/g, ''));
    res.redirect("/get/"+ req.body.link)

  })
};
