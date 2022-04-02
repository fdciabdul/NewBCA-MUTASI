const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const {
    compile
} = require('html-to-text');

const convert = compile({
    wordwrap: 130
});

puppeteer.use(StealthPlugin());



const konfigbrowser = {
    //defaultViewport: null,
    // devtools: true,
    headless: false,
    // set full screen
    viewport: {
        width: 0,
        height: 0
    },
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: [
        "--log-level=3", // fatal only

        "--no-default-browser-check",
        "--disable-infobars",
        "--disable-web-security",
        "--disable-site-isolation-trials",
        "--no-experiments",
        "--ignore-gpu-blacklist",
        "--ignore-certificate-errors",
        "--ignore-certificate-errors-spki-list",
        "--mute-audio",
        "--disable-extensions",
        "--no-sandbox",
    ],
    disablejavascript: true,
    ignoreHTTPSErrors: true,
    incognito: true,
    disablegpu: true,
    // unccoment ini jika ingin menggunakan save data

    // userDataDir: "iya",

};
async function getSettlement(user, pass,tglawal,blnawal,tglakhir,blnakhir) {
    const browser = await puppeteer.launch(konfigbrowser);
    const page = await browser.newPage();
    try {
        // LOGIN

        await page.goto('https://ibank.klikbca.com/', {
            waitUntil: 'networkidle0'
        });

        await page.setViewport({
            width: 1366,
            height: 635
        })

        await page.type("#user_id", user);
        await page.type("#pswd",pass);

        await page.keyboard.press("Enter");

        await page.waitForNavigation({
            setTimeout: 10000,
            waitUntil: 'networkidle0'
        });

        await page.goto('https://ibank.klikbca.com/nav_bar_indo/account_information_menu.htm', {
            waitUntil: 'networkidle0'
        })


        await page.waitForSelector('tbody > tr:nth-child(2) > td > font > a')
        await page.click('tbody > tr:nth-child(2) > td > font > a')

        const pageTarget = page.target();
        const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget);
        //get the new page object:
        const newPage = await newTarget.page();
        //  console.log(newTarget);
        // await page.close();
        await newPage.waitForTimeout(2000);
        console.log(tglawal)
        await newPage.select('#startDt', tglawal.padStart(2, "0"));
        await newPage.select('#startMt', blnawal.toString());
        await newPage.select('#endDt', tglakhir.padStart(2, "0"));
        await newPage.select('#endMt', blnakhir.toString());
        // await newPage.evaluate(() => {
        //     document.querySelector("#startDt").value = tglawal;
        // })
        // await newPage.evaluate(() => {
        //     document.querySelector("#startMt").value = blnawal;
        // })

        // await newPage.evaluate(() => {
        //     document.querySelector("#endDt").value = tglakhir;
        // })
        // await newPage.evaluate(() => {
        //     document.querySelector("#endMt").value = blnakhir;
        // })
        await newPage.waitForSelector('table:nth-child(4) > tbody > tr > td > input:nth-child(1)')
        await newPage.click('table:nth-child(4) > tbody > tr > td > input:nth-child(1)')
        // get html source
        await newPage.waitForTimeout(2000);
        const result = await newPage.evaluate(() => document.body.innerHTML);
        const data = await page.$$eval('table tr td', tds => tds.map((td) => {
            return td.innerText;
        }));
        // return mutasimMentah;
        const reg = result.split('Saldo')[1].split('</table>  </td></tr><tr>  <td colspan="2">    <table border="0" width="70%" cellpadding="0" cellspacing="0" bordercolor="#ffffff">')[0];
        const td = reg.split(/<\/tr>/);
        let res = [];
        td.forEach(element => {
            const potong = element.split('</td>');
            res.push({
                tanggal: potong[0],
                keterangan: potong[1],
                cab: potong[2],
                nominal: potong[3],
                mutasi: potong[4],
                saldoakhir: potong[5]
            })
        });
        let okey = [];
        for (i in res) {
            let str = convert(res[i].nominal, {
                wordwrap: 130
            });
            let saldo = convert(res[i].saldoakhir, {
                wordwrap: 130
            });
            str = str.substring(0, str.length - 3);
            saldo = saldo.substring(0, str.length - 3);
            okey.push({
                tanggal: convert(res[i].tanggal, {
                    wordwrap: 130
                }),
                keterangan: convert(res[i].keterangan, {
                    wordwrap: 130
                }),
                cab: convert(res[i].cab, {
                    wordwrap: 130
                }),
                nominal: str,
                mutasi: convert(res[i].mutasi, {
                    wordwrap: 130
                }),
                saldoakhir: saldo
            });
        }
        await page.goto('https://ibank.klikbca.com/authentication.do?value(actions)=logout', {
            waitUntil: 'networkidle0'
        }); // logout
        await browser.close();

        return okey.slice(1, -1);


    } catch (error) {

        console.log(error);
        await page.goto('https://ibank.klikbca.com/authentication.do?value(actions)=logout', {
            waitUntil: 'networkidle0'
        }); // logout
        await browser.close();


        return error;
    }
};
module.exports = {
    getSettlement
}