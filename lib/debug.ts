const { DEBUG } = process.env;

export function debug(...args: any[]) {
  if (DEBUG) {
    console.log(...args);
  }
}
