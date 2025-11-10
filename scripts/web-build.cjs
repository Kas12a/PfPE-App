#!/usr/bin/env node

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function hasLocalExpoBinary() {
  const expoPath = path.join(process.cwd(), 'node_modules', '.bin', process.platform === 'win32' ? 'expo.cmd' : 'expo');
  return fs.existsSync(expoPath);
}

function runExpoExport() {
  const result = spawnSync('npx', ['expo', 'export', '--platform', 'web'], {
    stdio: 'inherit',
    env: {
      ...process.env,
    },
  });

  if (result.error) {
    throw result.error;
  }

  if (typeof result.status === 'number' && result.status !== 0) {
    throw new Error(`Expo export exited with status ${result.status}`);
  }
}

function runOfflineFallback(reason) {
  console.warn(
    `⚠️  Falling back to offline placeholder build because Expo export failed: ${reason}`
  );
  require(path.join(__dirname, 'offline-web-build.cjs'));
}

function main() {
  if (hasLocalExpoBinary()) {
    try {
      runExpoExport();
      return;
    } catch (error) {
      runOfflineFallback(error.message || 'Unknown error');
      return;
    }
  }

  runOfflineFallback('Expo CLI is not installed locally');
}

main();
