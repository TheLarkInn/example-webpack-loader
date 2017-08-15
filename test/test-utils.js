import webpack from 'webpack';
import Promise from 'bluebird';
import MemoryFs from 'memory-fs';

const fs = new MemoryFs();


function getExampleConfig(exampleName) {
  return require(`../examples/${exampleName}/webpack.config.js`); //eslint-disable-line
}

async function runWebpackExampleInMemory(exampleName) {
  const webpackConfig = getExampleConfig(exampleName);
  const compiler = webpack(webpackConfig);

  compiler.outputFileSystem = fs;

  const run = Promise.promisify(compiler.run, { context: compiler });
  const stats = await run();


  const { compilation } = stats;
  const { errors, warnings, assets, entrypoints, chunks, modules } = compilation;
  const statsJson = stats.toJson();

  return {
    assets,
    entrypoints,
    errors,
    warnings,
    stats,
    chunks,
    modules,
    statsJson,
  };
}

export { getExampleConfig, runWebpackExampleInMemory, fs };
