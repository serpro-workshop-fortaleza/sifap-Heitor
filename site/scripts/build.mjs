import { execFileSync } from "node:child_process";

const env = { ...process.env, ASTRO_TELEMETRY_DISABLED: "1" };
function run(command, args) {
  execFileSync(command, args, { stdio: "inherit", env });
}
run(process.execPath, ["scripts/build-content.mjs"]);
run(process.execPath, ["node_modules/astro/bin/astro.mjs", "check"]);
run(process.execPath, ["node_modules/astro/bin/astro.mjs", "build"]);
run(process.execPath, ["node_modules/pagefind/lib/runner/bin.cjs", "--site", "dist"]);
run(process.execPath, ["scripts/audit-built-site.mjs"]);
