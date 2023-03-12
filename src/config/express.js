import express from "express";

const app = express();

const router = express.Router({ mergeParams: true });

export { app, router };
