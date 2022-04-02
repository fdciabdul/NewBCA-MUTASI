const mysql = require("mysql2/promise");
var format = require("date-format");
// OOP Javascript Function by Abdul Muttaqin
function kode(length) {
  var result = "";
  var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function foreach(arr, func) {
  for (var i in arr) {
    // await delay(2000);

    func(i, arr[i]);
  }
}
const createConnection = async () => {
  return await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mutasi",
  });
};

const masukanakun = async (user, pass) => {
  const connection = await createConnection();

  const login = connection.query(
    "SELECT * FROM akun WHERE username = ? AND password = ?",
    [user, pass],
    function (error, results, fields) {
      console.log(results);
    }
  );
  return info;
};

const mutasiakun = async (mutasi) => {
  const connection = await createConnection();
  try {

    const [info] = await connection.execute('INSERT INTO mutasi VALUES (NULL,?)',
      [connection.escape(mutasi)],
      (error, results) => {
        if (error) return res.json({ error: error });

      });



    return true;
  } catch (error) {
    return false;
  }
};

const userlink = async (username) => {
  const connection = await createConnection();
  try {
    const login = connection.query(
      `SELECT * FROM mutasi WHERE idakun LIKE '${username}'`
    );
    return login;
  } catch (error) {
    return false;
  }
};

const checklink = async (link) => {
  const connection = await createConnection();

  const [info] = await connection.execute(
    `SELECT * FROM akun WHERE link LIKE '${link}'`
  );

  try {
    return info;
  } catch (error) {
    return false;
  }
};

const cekakun = async (user) => {
  const connection = await createConnection();

  const [info] = await connection.execute(
    `SELECT * FROM akun WHERE username='${user}'`
  );
console.log(info);
// check if the user is already in the database
try{
 if (info.length > 0) {
  return true;
 } else {
  return false;
 }
}catch(error){
  return error;
}

};

const insertakun = async (username,
  password,link,tglawal,blnawal,tglakhir,blnakhir) => {
  const connection = await createConnection();
try {
  

  const [info] = await connection.execute(`INSERT INTO akun 
  (id,username,password,link,tglawal,blnawal,tglakhir,blnakhir) 
  VALUES (NULL, '${username}', '${password}','${link}',${tglawal},${blnawal},${tglakhir},${blnakhir});`);
  return info;
} catch (error) {
 return false; 
}
};

const getakun = async (link) => {
  const connection = await createConnection();

  const [info] = await connection.execute(
    `SELECT * FROM akun WHERE username='${link}'`
  );

  try {
    return info;
  } catch (error) {
    return false;
  }
};
const newdate = async (user,tglawal,blnaawal,tglakhir,blnakhir) => {
  const connection = await createConnection();

  const [info] = await connection.execute(
    `UPDATE akun SET tglawal= '${tglawal}',blnawal= '${blnaawal}',tglakhir= '${tglakhir}',blnakhir= '${blnakhir}' WHERE akun.username='${user}'`
  );

  try {
    return info;
  } catch (error) {
    return false;
  }
};

module.exports = {
  createConnection,
  masukanakun,
  mutasiakun,
  userlink,
  checklink,
  insertakun,
  getakun,
  cekakun,
  newdate
};

