#!/usr/bin/env node

const { spawnSync } = require('child_process');
const path = require('path');
const isWin = process.platform === 'win32';
const npmCmd = process.env.npm_execpath
  ? [process.env.npm_node_execpath || process.execPath, process.env.npm_execpath]
  : [isWin ? 'npm.cmd' : 'npm'];
const packageJson = require(path.join(__dirname, '..', 'package.json'));
const directDependencies = new Set([
  ...Object.keys(packageJson.dependencies || {}),
  ...Object.keys(packageJson.devDependencies || {}),
]);

function runNpmLs() {
  const [command, ...commandArgs] = npmCmd;
  const result = spawnSync(command, [...commandArgs, 'ls', '--json', '--long', '--all'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 1024 * 1024 * 20,
  });

  if (result.error) {
    console.error('[check-deprecated] Failed to run "npm ls":', result.error.message);
    process.exit(2);
  }

  const output = result.stdout?.trim();

  if (!output) {
    console.error('[check-deprecated] "npm ls" produced no output.');
    process.exit(2);
  }

  try {
    return JSON.parse(output);
  } catch (error) {
    console.error('[check-deprecated] Unable to parse "npm ls" JSON output:', error.message);
    process.exit(2);
  }
}

function collectDeprecated(root) {
  const stack = [{ name: root.name || 'root', node: root }];
  const visited = new Set();
  const deprecated = [];
  const recorded = new Set();

  while (stack.length > 0) {
    const { name, node } = stack.pop();
    const signature = node?.version ? `${name}@${node.version}` : name;
    if (visited.has(signature)) continue;
    visited.add(signature);

    if (node?.deprecated) {
      if (!recorded.has(signature)) {
        if (directDependencies.has(name)) {
          deprecated.push({ name, version: node.version, message: node.deprecated });
          recorded.add(signature);
        }
      }
    }

    if (node?.dependencies && typeof node.dependencies === 'object') {
      for (const [depName, depNode] of Object.entries(node.dependencies)) {
        if (depNode && typeof depNode === 'object') {
          stack.push({ name: depName, node: depNode });
        }
      }
    }
  }

  return deprecated;
}

const tree = runNpmLs();
const deprecated = collectDeprecated(tree);

if (deprecated.length > 0) {
  console.error('\nDeprecated packages detected:');
  for (const pkg of deprecated) {
    const label = pkg.version ? `${pkg.name}@${pkg.version}` : pkg.name;
    console.error(`  - ${label}: ${pkg.message || 'deprecated'}`);
  }
  console.error('\nPlease update or replace the packages above before continuing.\n');
  process.exit(1);
}

console.log('[check-deprecated] No deprecated packages found.');

