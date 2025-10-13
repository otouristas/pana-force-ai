export interface PitchEvent {
  x: number; // 0..100
  y: number; // 0..100
  outcome: 'success' | 'fail';
  type: 'pass' | 'carry' | 'shot' | 'cross';
}

export interface XTGridCell {
  row: number;
  col: number;
  xThreat: number;
}

export interface XThreatOptions {
  rows?: number;
  cols?: number;
}

export function computeXThreatGrid(events: ReadonlyArray<PitchEvent>, options: XThreatOptions = {}): ReadonlyArray<XTGridCell> {
  const rows = options.rows ?? 12;
  const cols = options.cols ?? 8;
  const grid: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));

  const cellFor = (x: number, y: number) => {
    const r = Math.min(rows - 1, Math.max(0, Math.floor((x / 100) * rows)));
    const c = Math.min(cols - 1, Math.max(0, Math.floor((y / 100) * cols)));
    return { r, c };
  };

  for (const e of events) {
    const { r, c } = cellFor(e.x, e.y);
    const base = e.type === 'shot' ? 1.0 : e.type === 'cross' ? 0.25 : e.type === 'pass' ? 0.15 : 0.1;
    const outcomeMult = e.outcome === 'success' ? 1.0 : 0.3;
    grid[r][c] += base * outcomeMult;
  }

  // Smooth slightly across neighbours (simple blur)
  const smoothed: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let sum = 0;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const rr = r + dr;
          const cc = c + dc;
          if (rr >= 0 && rr < rows && cc >= 0 && cc < cols) {
            sum += grid[rr][cc];
            count++;
          }
        }
      }
      smoothed[r][c] = count ? sum / count : 0;
    }
  }

  // Normalize to 0..1
  const max = smoothed.flat().reduce((m, v) => (v > m ? v : m), 0) || 1;
  const cells: XTGridCell[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({ row: r, col: c, xThreat: smoothed[r][c] / max });
    }
  }
  return cells;
}


