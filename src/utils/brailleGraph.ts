export class BrailleGraphRenderer {
  private static readonly BRAILLE_OFFSET = 0x2800;

  private static readonly DOT_MAP = [
    [0x01, 0x08],
    [0x02, 0x10], 
    [0x04, 0x20], 
    [0x40, 0x80],
  ];

  public static getBrailleChar(leftValPercent: number, rightValPercent: number): string {
    let code = 0;
  
    const leftDots = Math.min(4, Math.max(0, Math.round((leftValPercent / 100) * 4)));
    const rightDots = Math.min(4, Math.max(0, Math.round((rightValPercent / 100) * 4)));

    for (let r = 0; r < 4; r++) {
      const fromBottom = 3 - r;
      if (leftDots > fromBottom) {
        code |= this.DOT_MAP[r][0];
      }
      if (rightDots > fromBottom) {
        code |= this.DOT_MAP[r][1];
      }
    }

    if (code === 0) return ' ';
    return String.fromCharCode(this.BRAILLE_OFFSET + code);
  }

  public static renderBrailleSeries(series: number[], length: number = 60): string {
    const padded = [...series];
    while (padded.length < length * 2) {
      padded.unshift(0);
    }
    const recent = padded.slice(-(length * 2));
    let str = '';
    for (let i = 0; i < recent.length; i += 2) {
      str += this.getBrailleChar(recent[i], recent[i + 1] ?? recent[i]);
    }
    return str;
  }

  public static getCpuBarColor(percent: number): {
    color: string;
    bgStyle: string;
    level: 'low' | 'mid' | 'high' | 'peak';
  } {
    if (percent >= 80) {
      return { color: '#ef4444', bgStyle: 'bg-red-500', level: 'peak' };
    }
    if (percent >= 60) {
      return { color: '#f97316', bgStyle: 'bg-orange-500', level: 'high' };
    }
    if (percent >= 35) {
      return { color: '#eab308', bgStyle: 'bg-yellow-500', level: 'mid' };
    }
    return { color: '#4ade80', bgStyle: 'bg-green-400', level: 'low' };
  }

  public static renderBlockBar(percent: number, totalChars: number = 10): string {
    const filledChars = Math.round((percent / 100) * totalChars);
    const emptyChars = Math.max(0, totalChars - filledChars);
    return '■'.repeat(filledChars) + ' '.repeat(emptyChars);
  }
}
