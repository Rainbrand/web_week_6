import pkg from 'mongoose';
const {connect} = pkg;

const initServer = (express, bodyParser, createReadStream, crypto, http ) => {
    const app = express()
    app.use(bodyParser.urlencoded({ extended: true }));

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
        const {login, password, URL} = req.body;
        console.log(URL)
        const db = await connect(URL)
        console.log(db)
        db.users.insertOne({login, password})
        res.status(200)
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
