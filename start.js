const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const net = require('net');

// ANSI Terminal Colors
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
};

const rootDir = __dirname;
const mlDir = path.join(rootDir, 'ml_service');
const backendDir = path.join(rootDir, 'backend');
const frontendDir = path.join(rootDir, 'frontend');

// Locate viable Python 3 binary on Windows
function findPython() {
  const candidates = [
    process.env.PYTHON_PATH,
    path.join(mlDir, '.venv', 'Scripts', 'python.exe'),
    path.join(mlDir, 'venv', 'Scripts', 'python.exe'),
    path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Python', 'Python313', 'python.exe'),
    path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Python', 'Python312', 'python.exe'),
    path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Python', 'Python311', 'python.exe'),
    'C:\\Python313\\python.exe',
    'C:\\Python312\\python.exe',
    'C:\\Program Files\\Python313\\python.exe',
    'python',
    'py',
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    } catch (e) {}
  }
  return 'python';
}

// Check if a TCP port is in use
function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(true); // Port in use
      } else {
        resolve(false);
      }
    });
    server.once('listening', () => {
      server.close();
      resolve(false); // Port is free
    });
    server.listen(port, '127.0.0.1');
  });
}

async function main() {
  const pythonExe = findPython();

  console.clear();
  console.log(`${colors.bold}${colors.cyan}================================================================${colors.reset}`);
  console.log(`${colors.bold}  🚀 JOBPULSE — Unified Service Orchestrator ${colors.reset}`);
  console.log(`${colors.gray}  • Python ML Service  : http://127.0.0.1:8000 (Swagger: /docs)${colors.reset}`);
  console.log(`${colors.gray}  • Express REST API   : http://localhost:5000 (Health: /health)${colors.reset}`);
  console.log(`${colors.gray}  • React Frontend     : http://localhost:5173${colors.reset}`);
  console.log(`${colors.cyan}================================================================${colors.reset}\n`);

  // Check required directories
  if (!fs.existsSync(mlDir)) {
    console.error(`${colors.red}❌ Missing ml_service directory at ${mlDir}${colors.reset}`);
    process.exit(1);
  }
  if (!fs.existsSync(backendDir)) {
    console.error(`${colors.red}❌ Missing backend directory at ${backendDir}${colors.reset}`);
    process.exit(1);
  }
  if (!fs.existsSync(frontendDir)) {
    console.error(`${colors.red}❌ Missing frontend directory at ${frontendDir}${colors.reset}`);
    process.exit(1);
  }

  // Pre-flight port verification
  const [port8000Used, port5000Used, port5173Used] = await Promise.all([
    checkPort(8000),
    checkPort(5000),
    checkPort(5173),
  ]);

  if (port8000Used) {
    console.warn(`${colors.yellow}⚠️  Port 8000 is already in use. A Python ML service may already be running.${colors.reset}`);
  }
  if (port5000Used) {
    console.warn(`${colors.yellow}⚠️  Port 5000 is already in use. An Express backend may already be running.${colors.reset}`);
  }
  if (port5173Used) {
    console.warn(`${colors.yellow}⚠️  Port 5173 is already in use. Vite may choose another port or frontend is running.${colors.reset}`);
  }

  const processes = [];

  function prefixStream(stream, prefix, color) {
    let buffer = '';
    stream.on('data', (data) => {
      buffer += data.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep last incomplete line
      for (const line of lines) {
        if (line.trim()) {
          console.log(`${color}[${prefix}]${colors.reset} ${line}`);
        }
      }
    });
  }

  function startService(name, command, args, cwd, color) {
    const isWindows = process.platform === 'win32';
    const isBatchOrCmd = isWindows && (command.endsWith('.cmd') || command.endsWith('.bat'));
    const useShell = isWindows ? isBatchOrCmd : false;
    const finalCommand = (isWindows && useShell && command.includes(' ') && !command.startsWith('"')) ? `"${command}"` : command;
    const child = spawn(finalCommand, args, {
      cwd,
      shell: useShell,
      env: { ...process.env, FORCE_COLOR: 'true' },
    });

    processes.push({ name, process: child });

    prefixStream(child.stdout, name, color);
    prefixStream(child.stderr, name, color);

    child.on('error', (err) => {
      console.error(`${color}[${name}] ERROR:${colors.reset} ${err.message}`);
    });

    child.on('exit', (code, signal) => {
      if (signal !== 'SIGTERM' && signal !== 'SIGINT') {
        console.log(`${color}[${name}] exited with code ${code}${colors.reset}`);
      }
    });

    return child;
  }

  // 1. Launch ML Service
  console.log(`${colors.magenta}[ML-SERVICE] Launching FastAPI on port 8000 using ${pythonExe}...${colors.reset}`);
  startService('ML-SERVICE', pythonExe, ['-m', 'uvicorn', 'main:app', '--port', '8000', '--host', '127.0.0.1'], mlDir, colors.magenta);

  // 2. Launch Express Backend
  console.log(`${colors.cyan}[BACKEND]    Launching REST API on port 5000...${colors.reset}`);
  startService('BACKEND', 'node', ['src/server.js'], backendDir, colors.cyan);

  // 3. Launch React Frontend
  console.log(`${colors.green}[FRONTEND]   Launching Vite dev server on port 5173...${colors.reset}`);
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  startService('FRONTEND', npmCmd, ['run', 'dev', '--', '--host'], frontendDir, colors.green);

  // Clean exit on Ctrl+C
  function cleanup() {
    console.log(`\n${colors.yellow}Shutting down all JobPulse services cleanly...${colors.reset}`);
    for (const { name, process: p } of processes) {
      if (p && !p.killed) {
        try {
          if (process.platform === 'win32') {
            execSync(`taskkill /pid ${p.pid} /T /F 2>nul`);
          } else {
            p.kill('SIGTERM');
          }
        } catch (e) {}
      }
    }
    process.exit(0);
  }

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  process.on('exit', cleanup);
}

main().catch((err) => {
  console.error(`${colors.red}Fatal startup error: ${err.message}${colors.reset}`);
  process.exit(1);
});
