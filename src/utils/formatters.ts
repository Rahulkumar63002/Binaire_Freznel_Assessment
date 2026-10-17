
export class MetricFormatters {
  public static formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Byte';
    const k = 1024;
    const sizes = ['Byte', 'KiB', 'MiB', 'GiB', 'TiB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const val = parseFloat((bytes / Math.pow(k, i)).toFixed(decimals));
    return `${val} ${sizes[i]}`;
  }

  public static formatProcessMem(bytes: number): string {
    if (bytes >= 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024 * 1024)).toFixed(1) + 'G';
    }
    if (bytes >= 1024 * 1024) {
      return Math.round(bytes / (1024 * 1024)) + 'M';
    }
    if (bytes >= 1024) {
      return Math.round(bytes / 1024) + 'K';
    }
    return bytes + 'B';
  }

  public static formatSpeedWithBits(bytesPerSec: number): { bytesStr: string; bitsStr: string } {
    const bytesStr = this.formatBytes(bytesPerSec, 0) + '/s';
    const bits = bytesPerSec * 8;
    let bitsStr = '';
    if (bits >= 1000000000) {
      bitsStr = `(${ (bits / 1000000000).toFixed(1) } Gibps)`;
    } else if (bits >= 1000000) {
      bitsStr = `(${ (bits / 1000000).toFixed(1) } Mibps)`;
    } else if (bits >= 1000) {
      bitsStr = `(${ Math.round(bits / 1000) } kibps)`;
    } else {
      bitsStr = `(${ Math.round(bits) } bitps)`;
    }
    return { bytesStr, bitsStr };
  }

  public static formatUptime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `up ${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }

  
  public static formatTime(date: Date = new Date()): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  
  public static truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - 1) + '…';
  }
}





