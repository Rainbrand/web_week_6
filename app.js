import mongoose from 'mongoose';
import puppeteer from "puppeteer/lib/esm/puppeteer/node-puppeteer-core.js";

const initServer = (express, bodyParser, createReadStream, crypto, http ) => {
    const app = express()
    app.use(bodyParser.urlencoded({ extended: true }));
    const schema = new mongoose.Schema({ login: 'string', password: 'string' });
    const users = mongoose.model('users', schema);

    app.get("/code/", ((req, res) => {
        res.set("Content-Type", "text/plain; charset=UTF-8")
            .set("Access-Control-Allow-Origin", "*")
            .set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,OPTIONS,DELETE")
        const fileStream = createReadStream(import.meta.url.substring(7));
        fileStream.on('open', () => {
            fileStream.pipe(res).status(200)
        })
    }))

    app.get("/sha1/:input/", ((req, res) => {
        let sha = crypto.createHash('sha1')
        res.set("Content-Type", "text/plain; charset=UTF-8")
            .set("Access-Control-Allow-Origin", "*")
            .set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,OPTIONS,DELETE")
            .send(sha.update(req.params.input).digest("hex")).status(400)
    }))

    app.get("/req/", ((req, res) => {
        http.get(req.query.addr, response => {
            let str = '';
            response.on('data', (chunk) => {
                str += chunk;
            }).on('end', () => {
                res.set("Content-Type", "text/plain; charset=UTF-8")
                    .set("Access-Control-Allow-Origin", "*")
                    .set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,OPTIONS,DELETE")
                    .send(str).status(200)
            })
        });
    }))

    app.post("/req/", ((req, res) => {
        const addr = req.body.addr;
        http.get(addr, response => {
            let str = '';
            response.on('data', (chunk) => {
                str += chunk;
            }).on('end', () => {
                res.set("Content-Type", "text/plain; charset=UTF-8")
                    .set("Access-Control-Allow-Origin", "*")
                    .set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,OPTIONS,DELETE")
                    .send(str).status(200)
            })
        });
    }))

    app.post('/insert/', async (req, res) => {
        try {
            const {login, password, URL} = req.body;
            await mongoose.connect(URL, { useNewUrlParser: true }).then(() => {users.insertMany({"login": login, "password": password})})
            res.send().status(200)
        } catch (e) {
            console.error(e)
        }
    })

    app.get('/test/', async (req, res) => {
        const URL = req.body.URL;
        const browser = await puppeteer.launch({headless: true, args: ["--no-sandbox"]});
        const page = await browser.newPage();
        await page.goto(URL);
        await page.waitForSelector('#bt');
        await page.click('#bt')
        const input = await page.waitForSelector('#inp')
        res.set("Content-Type", "text/plain; charset=UTF-8")
            .set("Access-Control-Allow-Origin", "*")
            .set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,OPTIONS,DELETE")
            .send(input.value).code(200)
        await page.close();
    })

    app.all('/*/', (req, res) => {
        res.set("Content-Type", "text/plain; charset=UTF-8")
            .set("Access-Control-Allow-Origin", "*")
            .set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,OPTIONS,DELETE")
            .send("itmo313243").status(200)
    })

    return app;
}

export default initServer;
