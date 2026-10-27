const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const output = path.join(root, "_site");
const eleventyCli = path.join(root, "node_modules", "@11ty", "eleventy", "cmd.cjs");

fs.rmSync(output, { recursive: true, force: true });

const result = spawnSync(process.execPath, [eleventyCli], {
  cwd: root,
  stdio: "inherit",
});

if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
