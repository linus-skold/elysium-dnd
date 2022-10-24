export function oldinfo() {
  const args = Array.prototype.slice.call(arguments);
  args.forEach((arg) => console.log("Elysium | INFO | " + arg));
}

export function oldwarn() {
  const args = Array.prototype.slice.call(arguments);
  args.forEach((arg) => console.log("Elysium | WARNING | " + arg));
}

export function olderror() {
  const args = Array.prototype.slice.call(arguments);
  args.forEach((arg) => console.log("Elysium | ERROR | " + arg));
}


function logBase ( type: string, ...args: any[]) {
  args.forEach((arg: any) => console.log(`Elysium | ${type} | ` + arg));

}

export const info = (...args: any[]) => {
  logBase("INFO", args);
}
export const warn = (...args: any[]) => {
  logBase("WARNING", args);
}
export const error = (...args: any[]) => {
  logBase("ERROR", args);
}
