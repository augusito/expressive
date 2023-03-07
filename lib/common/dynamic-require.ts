export function dynamicRequire(request: string) {
  const mod = require(request);
  return mod.__esModule && mod.default ? mod.default : mod;
}
