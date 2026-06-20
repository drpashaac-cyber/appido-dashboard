// wrapText
export function wrapText(ctx: any, text: string, x: number, y: number, maxW: number, lh: number) {
  const words = String(text || "").split(" ");
  let line = "", yy = y;
  for (const wd of words) {
    const test = line ? line + " " + wd : wd;
    if (ctx.measureText(test).width > maxW && line) { ctx.fillText(line, x, yy); line = wd; yy += lh; }
    else line = test;
  }
  if (line) ctx.fillText(line, x, yy);
  return yy;
}
