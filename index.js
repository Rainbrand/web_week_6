import express from "express"
import bodyParser from 'body-parser'
import {createReadStream} from 'fs';
import * as crypto from "crypto";
import * as http from "http";
import server from "./app.js";
import {connect} from "mongoose";

const port = process.env.PORT || 3000

const app = server(express, bodyParser, createReadStream, crypto, http, connect);

app.listen(port);
