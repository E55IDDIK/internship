// Simple cross-platform dev runner for frontend + backend
// Spawns both processes and forwards signals
import { spawn } from 'node:child_process';

function run(cmd, args, options = {}) {
  const child = spawn(cmd, args, { stdio: 'inherit', shell: true, ...options });
  child.on('exit', (code) => {
    // If either process exits, kill the rest
    if (code !== 0) process.exitCode = code ?? 1;
  });
  return child;
}

const fe = run('npm', ['run', 'dev:frontend']);
const be = run('npm', ['run', 'dev:backend']);

function shutdown() {
  if (fe?.pid) try { process.kill(fe.pid); } catch {}
  if (be?.pid) try { process.kill(be.pid); } catch {}
}

process.on('SIGINT', () => { shutdown(); process.exit(); });
process.on('SIGTERM', () => { shutdown(); process.exit(); });

