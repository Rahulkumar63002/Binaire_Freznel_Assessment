
import { ProcessItemData } from "../types";

interface ProcessApiResponse {
  success: boolean;
  total: number;
  processes: ProcessItemData[];
}

export class SystemTaskApi {
  private readonly baseUrl = "http://127.0.0.1:3001/api/processes";
  private totalProcessesCount = 0;

  public async fetchProcesses(): Promise<ProcessItemData[]> {
    const response = await fetch(this.baseUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch processes: ${response.status}`);
    }

    const data: ProcessApiResponse = await response.json();

    if (!data.success || !Array.isArray(data.processes)) {
      throw new Error("Invalid response received from process API");
    }

    this.totalProcessesCount = data.total;

    return data.processes;
  }

  public async terminateProcess(
    pid: number,
    signal: "SIGTERM" | "SIGKILL" = "SIGTERM"
  ): Promise<boolean> {
    // The backend currently supports SIGTERM only.
    // Do not silently treat SIGKILL as supported.
    if (signal !== "SIGTERM") {
      throw new Error("Only SIGTERM is supported by this API");
    }

    const response = await fetch(`${this.baseUrl}/${pid}`, {
      method: "DELETE",
    });

    if (response.status === 404) {
      return false;
    }

    if (!response.ok) {
      throw new Error(`Failed to terminate process: ${response.status}`);
    }

    this.totalProcessesCount = Math.max(
      0,
      this.totalProcessesCount - 1
    );

    return true;
  }

  public getTotalCount(): number {
    return this.totalProcessesCount;
  }
}
