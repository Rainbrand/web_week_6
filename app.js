const initServer = (express, bodyParser, createReadStream, crypto, http ) => {
    const app = express()
    let sha = crypto.createHash('sha1')
    app.use(bodyParser.raw({type: "text/plain"}));
    app.use(bodyParser.text({ type: 'text/html' }))
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get("/code/", ((req, res) => {
        res.set("Content-Type", "text/plain; charset=UTF-8")
            .set("Access-Control-Allow-Origin", "*")
            .set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,OPTIONS,DELETE")
        const fileStream = createReadStream(import.meta.url.substring(7));
        fileStream.on('open', () => {
            fileStream.pipe(res)
        })
    }))

    app.get("/sha/:input/", ((req, res) => {
        res.set("Content-Type", "text/plain; charset=UTF-8")
            .set("Access-Control-Allow-Origin", "*")
            .set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,OPTIONS,DELETE")
            .send(sha.update(req.params.input).digest("hex"))
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
                    .send(str)
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
                    .send(str)
            })
        });
    }))

    app.all('/*/', (req, res) => {
        res.set("Content-Type", "text/plain; charset=UTF-8")
            .set("Access-Control-Allow-Origin", "*")
            .set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,OPTIONS,DELETE")
            .send("itmo313243")
    })

    return app;
}

export default initServer;
