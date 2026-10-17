
import express from "express";
import os from "node:os";
import si from "systeminformation";

import {
    saveSensorReading,
    getRecentSensorReadings,
} from "../services/firestore.service.js";

const router = express.Router();

const toNumber = (value) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
};

async function respondWithReading(res, type, data) {
    try {
        await saveSensorReading(type, data);
    } catch (error) {
        console.error(
            `Firestore save failed for ${type}:`,
            error.message
        );
    }

    return res.json(data);
}

router.get("/cpu", async (req, res) => {
    try {
        const [cpu, load, speed, temperature, time] =
            await Promise.all([
                si.cpu(),
                si.currentLoad(),
                si.cpuCurrentSpeed(),
                si.cpuTemperature(),
                si.time(),
            ]);

        const cores = (load.cpus || []).map((core, index) => ({
            id: index,
            label: `C${index}`,
            usage: Math.round(toNumber(core.load)),
            temp: toNumber(temperature.main),
            freqGhz: toNumber(
                speed.cores?.[index] ?? speed.avg ?? cpu.speed
            ),
        }));

        const data = {
            model: cpu.brand || "Unknown CPU",
            baseFreqGhz: toNumber(cpu.speed),
            totalUsage: Math.round(toNumber(load.currentLoad)),
            cores,
            loadAvg: os.loadavg().map(toNumber),
            uptimeSeconds: toNumber(time.uptime),
        };

        return await respondWithReading(res, "cpu", data);
    } catch (error) {
        console.error("CPU sensor error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to read CPU sensors",
        });
    }
});

router.get("/gpu", async (req, res) => {
    try {
        const graphics = await si.graphics();
        const gpu = graphics.controllers?.[0];

        const data = {
            name: gpu?.model || "GPU information unavailable",
            usage: 0,
            temp: toNumber(gpu?.temperatureGpu),
            memoryUsedMb: 0,
            memoryTotalMb: toNumber(gpu?.vram),
        };

        return await respondWithReading(res, "gpu", data);
    } catch (error) {
        console.error("GPU sensor error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to read GPU information",
        });
    }
});

router.get("/memory", async (req, res) => {
    try {
        const memory = await si.mem();

        const data = {
            totalBytes: toNumber(memory.total),
            usedBytes: toNumber(memory.used),
            availableBytes: toNumber(memory.available),
            cachedBytes: toNumber(
                memory.buffcache ?? memory.cached
            ),
            committedBytes: toNumber(memory.used),
            gpuSharedTotalBytes: 0,
            gpuSharedUsedBytes: 0,
            pageVirtTotalBytes: toNumber(memory.swaptotal),
            pageVirtUsedBytes: toNumber(memory.swapused),
        };

        return await respondWithReading(res, "memory", data);
    } catch (error) {
        console.error("Memory sensor error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to read memory sensors",
        });
    }
});

router.get("/disk", async (req, res) => {
    try {
        const [filesystems, io] = await Promise.all([
            si.fsSize(),
            si.disksIO(),
        ]);

        const disk =
            filesystems.find((item) => /^C:/i.test(item.mount)) ||
            filesystems[0];

        const data = {
            mount: disk?.mount || "Unknown",
            label: disk?.fs || "Disk",
            totalBytes: toNumber(disk?.size),
            usedBytes: toNumber(disk?.used),
            freeBytes: toNumber(disk?.available),
            readSpeedBytes: toNumber(io?.rIO_sec),
            writeSpeedBytes: toNumber(io?.wIO_sec),
            ioPercent: 0,
        };

        return await respondWithReading(res, "disk", data);
    } catch (error) {
        console.error("Disk sensor error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to read disk sensors",
        });
    }
});

router.get("/network", async (req, res) => {
    try {
        const interfaces = await si.networkInterfaces();

        const networkInterface =
            interfaces.find((item) => item.default) ||
            interfaces.find((item) => item.operstate === "up");

        if (!networkInterface) {
            const emptyData = {
                interfaceName: "Unavailable",
                ipAddress: "",
                downloadSpeedBytes: 0,
                uploadSpeedBytes: 0,
                totalDownloadedBytes: 0,
                totalUploadedBytes: 0,
                syncMode: "system",
            };

            return await respondWithReading(
                res,
                "network",
                emptyData
            );
        }

        const stats = await si.networkStats(
            networkInterface.iface
        );

        const current = Array.isArray(stats) ? stats[0] : stats;

        const data = {
            interfaceName: networkInterface.iface || "Unknown",
            ipAddress: networkInterface.ip4 || "",
            downloadSpeedBytes: toNumber(current?.rx_sec),
            uploadSpeedBytes: toNumber(current?.tx_sec),
            totalDownloadedBytes: toNumber(current?.rx_bytes),
            totalUploadedBytes: toNumber(current?.tx_bytes),
            syncMode: "system",
        };

        return await respondWithReading(res, "network", data);
    } catch (error) {
        console.error("Network sensor error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to read network sensors",
        });
    }
});

router.get("/history/:type", async (req, res) => {
    try {
        const readings = await getRecentSensorReadings(
            req.params.type,
            req.query.limit
        );

        return res.json({
            success: true,
            total: readings.length,
            readings,
        });
    } catch (error) {
        console.error("Sensor history error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch sensor history",
        });
    }
});

export default router;
