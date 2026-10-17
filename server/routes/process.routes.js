
import express from "express";
import si from "systeminformation";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const result = await si.processes();

        const processes = result.list.map((proc) => ({
            pid: Number(proc.pid),
            name: proc.name || "Unknown",
            command:
                [proc.command, proc.params].filter(Boolean).join(" ") ||
                proc.name ||
                "Unknown",
            threads: Number(proc.threads) || 0,
            user: proc.user || "Unknown",
            memBytes: Math.round((Number(proc.memRss) || 0) * 1024 * 1024),
            cpuPercent: Number(proc.cpu) || 0,
            status: String(proc.state || "unknown").toLowerCase(),
            startTime: proc.started || "",
        }));

        res.json({
            success: true,
            total: processes.length,
            processes,
        });
    } catch (error) {
        console.error("Failed to fetch processes:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch local processes",
        });
    }
});

router.delete("/:pid", async (req, res) => {
    const pid = Number(req.params.pid);

    if (!Number.isSafeInteger(pid) || pid <= 1) {
        return res.status(400).json({
            success: false,
            message: "Invalid process ID",
        });
    }

    try {
        if (pid === process.pid) {
            return res.status(400).json({
                success: false,
                message: "Cannot terminate the monitoring server",
            });
        }

        const result = await si.processes();
        const target = result.list.find((proc) => Number(proc.pid) === pid);

        if (!target) {
            return res.status(404).json({
                success: false,
                message: "Process not found",
            });
        }

        process.kill(pid, "SIGTERM");

        return res.json({
            success: true,
            message: "Termination signal sent",
            pid,
        });
    } catch (error) {
        console.error(`Failed to terminate PID ${pid}:`, error);

        return res.status(500).json({
            success: false,
            message:
                "Could not terminate process. It may require elevated permissions or may have exited.",
        });
    }
});

export default router;
