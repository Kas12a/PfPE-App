#!/usr/bin/env node

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const localExpoCli = path.join(projectRoot, 'node_modules', 'expo', 'bin', 'cli');

function ensureExpoCliAvailable() {
  if (!fs.existsSync(localExpoCli)) {
    throw new Error('Expo CLI is not installed locally');
  }
}

function runExpoExport() {
  ensureExpoCliAvailable();

  const result = spawnSync(
    process.execPath,
    [localExpoCli, 'export', '--platform', 'web'],
    {
      stdio: 'inherit',
      env: {
        ...process.env,
      },
    }
  );

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
  try {
    runExpoExport();
  } catch (error) {
    runOfflineFallback(error.message || 'Unknown error');
  }
}

main();
