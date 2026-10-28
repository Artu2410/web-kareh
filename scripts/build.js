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
if (result.status === 0) {
  const CleanCSS = require("clean-css");
  const stylesheet = path.join(output, "styles.css");
  const source = fs.readFileSync(stylesheet, "utf8");
  const minified = new CleanCSS({ level: 1 }).minify(source);

  if (minified.errors.length > 0) {
    throw new Error(`CSS minification failed: ${minified.errors.join("; ")}`);
  }

  fs.writeFileSync(stylesheet, minified.styles);
}

process.exitCode = result.status ?? 1;
