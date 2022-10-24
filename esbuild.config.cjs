const defaultDefine = {
  entryPoints: ["./src/index.ts"],
  bundle: true,
  minify: process.env.NODE_ENV === "production",
  outfile: "./scripts/module.js",
  external: ["node_modules/*"],
  platform: "browser",
};

const prodDefine = {
  ...defaultDefine,
  define: {
    "process.env.NODE_ENV": '"production"',
  },
};

const devDefine = {
  ...defaultDefine,
  define: {
    "process.env.NODE_ENV": '"development"',
  },
};

const args = process.argv.slice(2);
require("esbuild")
  .build(args.includes("production") ? prodDefine : devDefine)
  .catch(() => process.exit(1));
