import express from "express"
import bodyParser from 'body-parser'
import {createReadStream, writeFileSync} from 'fs';
import * as crypto from "crypto";
import * as http from "http";
import server from "./app.js";
import CORS from "cors";


const port = process.env.PORT || 3000

const app = server(express, bodyParser, createReadStream, crypto, http, CORS, writeFileSync);

app.listen(port, () => console.log("Listening"));
