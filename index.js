import express from "express"
import bodyParser from 'body-parser'
import {createReadStream} from 'fs';
import * as crypto from "crypto";
import * as http from "http";
import server from "./app.js";

const port = process.env.PORT || 3000

const app = server(express, bodyParser, createReadStream, crypto, http);

app.listen(port, () => console.log('Listening'));
