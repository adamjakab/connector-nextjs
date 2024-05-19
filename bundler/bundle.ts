import * as esbuild from "esbuild";
import esbuildPluginTsc from "esbuild-plugin-tsc";

// Esbuild configuration
const getEsbuildOptions = (): esbuild.BuildOptions => {
  return {
    entryPoints: ["src/middleware-queueit-connector.ts"],
    outfile: "dist/middleware-queueit-connector.js",
    bundle: false,
    minify: false,
    platform: "node",
    target: ["node20"],
    format: "esm",
    treeShaking: true,
    keepNames: true,
    legalComments: "none",
    plugins: [
      esbuildPluginTsc({
        tsconfigPath: "tsconfig.json",
      }),
    ],
    /** Only the src files will be bundled (not the dependencies)*/
    // external: ["./node_modules/*"],
    metafile: true,
    sourcemap: true,
  };
};

// Esbuild run
const runEsbuild = async (): Promise<esbuild.BuildResult> => {
  const options = getEsbuildOptions();
  return await esbuild.build(options);
};

console.log("Bundling...");
runEsbuild().then((res) => {
  console.log("Done...");
});
