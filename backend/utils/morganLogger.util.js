import fs from "fs";
import path from "path";
import chalk from "chalk";
import morgan from "morgan";
import { createStream } from "rotating-file-stream";

// Create logs directory if not exists
const logDirectory = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Weekly rotating file stream (auto delete after 7 days)
const accessLogStream = createStream("access.log", {
  interval: "7d", // rotate weekly
  path: logDirectory,
  maxFiles: 1, // keep only latest file (auto delete old)
});

morgan.token("timestamp", () => {
  const now = new Date();

  const pad = (n) => n.toString().padStart(2, "0");

  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate(),
  )} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
});

// Custom Morgan format with color
const customFormat = (tokens, req, res) => {
  const date = tokens.timestamp(req, res);
  const method = tokens.method(req, res);
  const url = tokens.url(req, res);
  const status = Number(tokens.status(req, res));
  const responseTime = Number(tokens["response-time"](req, res));

  // Status color
  let statusColor = chalk.green(status);
  if (status >= 500) {
    statusColor = chalk.red(status);
  } else if (status >= 400) {
    statusColor = chalk.yellow(status);
  }

  // Response time color
  let timeColor = chalk.green(`${responseTime} ms`);
  if (responseTime > 2000) {
    timeColor = chalk.red(`${responseTime} ms SLOW`);
  } else if (responseTime > 1000) {
    timeColor = chalk.yellow(`${responseTime} ms ⚠`);
  }

  return [
    chalk.gray(date),
    chalk.cyan(method),
    url,
    statusColor,
    timeColor,
  ].join(" ");
};

// Console logger (colored)
export const consoleLogger = morgan(customFormat);

// File logger (plain text)
export const fileLogger = morgan(
  ":timestamp --> :method --> :url --> :status --> :response-time ms",
  {
    stream: accessLogStream,
  },
);
