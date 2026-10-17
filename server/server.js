
import "dotenv/config";

import express from "express";
import cors from "cors";

import processRoutes from "./routes/process.routes.js";
import sensorRoutes from "./routes/sensor.routes.js";

const app = express();
const PORT = 3001;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Process Monitoring API is running",
    });
});

app.use("/api/processes", processRoutes);
app.use("/api/sensors", sensorRoutes);

app.listen(PORT, "127.0.0.1", () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
});
