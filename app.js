import mongoose from 'mongoose';
import axios from 'axios';

const initServer = (express, bodyParser, createReadStream, crypto, http, CORS, writeFileSync ) => {
    const app = express()
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(CORS());
    const schema = new mongoose.Schema({ login: 'string', password: 'string' });
    const users = mongoose.model('users', schema);


    app.set('view engine', 'pug')
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

    app.get('/wordpress/', async (req, res) => {
        res.redirect('http://164.90.209.222:8000/')
    })

    app.post('/render/', async (req, res) => {
        const addr = req.query.addr;
        const { random2, random3 } = req.body
        const template = await axios.get(addr).then(data => data.data);
        writeFileSync('views/random.pug', template);
        try {
            res.set('Content-Type', 'text/html; charset=UTF-8')
              .set('Access-Control-Allow-Origin', '*')
              .set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,OPTIONS,DELETE')
              .render('random', { random2, random3 })
              .status(200)
              .end()
        } catch (e) {
            console.error(e)
            res.set('Content-Type', 'text/html; charset=UTF-8')
              .set('Access-Control-Allow-Origin', '*')
              .set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,OPTIONS,DELETE')
              .status(500)
        }
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
