import express, { Response } from "express";
import routes from "./routes";
import { errorHandler } from "./middlewares";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Healthcheck
app.get("/", (_, res: Response) => {
    res.status(200).send({ status: "OK" });
});

// Routes setup
app.use("/api/v1", routes);

app.use(errorHandler);

export default app;
