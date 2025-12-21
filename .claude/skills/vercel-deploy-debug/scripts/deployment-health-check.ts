#!/usr/bin/env npx tsx
/**
 * Vercel Deployment Health Check for CoinSite
 *
 * Checks the latest deployment status, scans logs for errors,
 * and validates key pages on the production site.
 *
 * Usage: npx tsx deployment-health-check.ts [deployment-url]
 *        If no URL provided, uses the latest deployment.
 */

import { execSync } from "child_process";

const PRODUCTION_DOMAIN = "lordmarcovan.com";

const PAGES_TO_CHECK = [
  "/",
  "/coins",
  "/collections",
  "/blog",
  "/about",
];

// ANSI colors
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
};

interface HealthCheckResult {
  step: string;
  status: "pass" | "warn" | "fail";
  message: string;
  details?: string[];
}

function log(color: keyof typeof colors, symbol: string, message: string) {
  console.log(`${colors[color]}${symbol}${colors.reset} ${message}`);
}

function runCommand(command: string): string {
  try {
    return execSync(command, { encoding: "utf-8", timeout: 30000 });
  } catch (error) {
    if (error instanceof Error && "stdout" in error) {
      return (error as { stdout: string }).stdout || "";
    }
    return "";
  }
}

async function getLatestDeployment(providedUrl?: string): Promise<string> {
  if (providedUrl) {
    return providedUrl;
  }

  const output = runCommand("vercel ls 2>&1");
  const lines = output.trim().split("\n");

  // Find the first line with a deployment URL (skip headers)
  for (const line of lines) {
    // Match URLs like https://coin-site-xxx-yyy.vercel.app
    const match = line.match(/(https:\/\/[a-z0-9-]+\.vercel\.app)/i);
    if (match) {
      return match[1];
    }
  }

  throw new Error("Could not find latest deployment. Are you logged in to Vercel?");
}

function checkDeploymentStatus(deploymentUrl: string): HealthCheckResult {
  const output = runCommand(`vercel inspect "${deploymentUrl}" 2>&1`);

  if (output.includes("Ready")) {
    return { step: "Deployment Status", status: "pass", message: "Ready" };
  } else if (output.includes("Error")) {
    const errorLines = output.split("\n").filter((l) => l.toLowerCase().includes("error"));
    return {
      step: "Deployment Status",
      status: "fail",
      message: "Error",
      details: errorLines.slice(0, 5),
    };
  } else if (output.includes("Building")) {
    return { step: "Deployment Status", status: "warn", message: "Still building..." };
  }

  return { step: "Deployment Status", status: "warn", message: "Unknown status" };
}

function scanBuildLogs(deploymentUrl: string): HealthCheckResult {
  const output = runCommand(`vercel logs "${deploymentUrl}" 2>&1 | head -100`);

  const errorPatterns = /error|failed|exception/gi;
  const warnPatterns = /warn/gi;

  const errors = output.match(errorPatterns) || [];
  const warnings = output.match(warnPatterns) || [];

  const errorLines = output
    .split("\n")
    .filter((line) => /error|failed|exception/i.test(line))
    .slice(0, 5);

  if (errors.length > 0) {
    return {
      step: "Build Logs",
      status: "fail",
      message: `Found ${errors.length} error(s)`,
      details: errorLines,
    };
  } else if (warnings.length > 0) {
    return {
      step: "Build Logs",
      status: "warn",
      message: `Found ${warnings.length} warning(s), no errors`,
    };
  }

  return { step: "Build Logs", status: "pass", message: "No errors found" };
}

function scanRuntimeLogs(deploymentUrl: string): HealthCheckResult {
  const output = runCommand(`vercel logs "${deploymentUrl}" --output raw 2>&1 | tail -50`);

  const runtimeErrorPatterns = /error|500|exception|crash|ENOENT|ECONNREFUSED/gi;
  const errors = output.match(runtimeErrorPatterns) || [];

  const errorLines = output
    .split("\n")
    .filter((line) => runtimeErrorPatterns.test(line))
    .slice(0, 5);

  if (errors.length > 0) {
    return {
      step: "Runtime Logs",
      status: "fail",
      message: `Found ${errors.length} potential runtime error(s)`,
      details: errorLines,
    };
  }

  return { step: "Runtime Logs", status: "pass", message: "No runtime errors detected" };
}

interface PageCheckResult {
  page: string;
  status: number;
  responseTimeMs: number;
  error?: string;
}

async function checkPage(page: string): Promise<PageCheckResult> {
  const url = `https://${PRODUCTION_DOMAIN}${page}`;
  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: { "User-Agent": "CoinSite-HealthCheck/1.0" },
    });

    clearTimeout(timeout);
    const responseTimeMs = Date.now() - startTime;

    return {
      page,
      status: response.status,
      responseTimeMs,
    };
  } catch (error) {
    return {
      page,
      status: 0,
      responseTimeMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function checkAllPages(): Promise<{
  results: PageCheckResult[];
  summary: HealthCheckResult;
}> {
  const results = await Promise.all(PAGES_TO_CHECK.map(checkPage));

  const failures = results.filter((r) => r.status === 0 || r.status >= 500);
  const warnings = results.filter((r) => r.status >= 400 && r.status < 500);

  let summary: HealthCheckResult;
  if (failures.length > 0) {
    summary = {
      step: "Page Checks",
      status: "fail",
      message: `${failures.length} page(s) failing`,
      details: failures.map((f) => `${f.page}: ${f.error || `HTTP ${f.status}`}`),
    };
  } else if (warnings.length > 0) {
    summary = {
      step: "Page Checks",
      status: "warn",
      message: `${warnings.length} page(s) with warnings`,
    };
  } else {
    summary = {
      step: "Page Checks",
      status: "pass",
      message: "All pages responding correctly",
    };
  }

  return { results, summary };
}

function printResult(result: HealthCheckResult) {
  const symbols = { pass: "✓", warn: "⚠", fail: "✗" };
  const colorMap = { pass: "green", warn: "yellow", fail: "red" } as const;

  log(colorMap[result.status], symbols[result.status], `${result.step}: ${result.message}`);

  if (result.details && result.details.length > 0) {
    result.details.forEach((detail) => {
      console.log(`    ${detail}`);
    });
  }
}

function printPageResult(result: PageCheckResult) {
  const statusColor = result.status === 200 ? "green" : result.status >= 500 || result.status === 0 ? "red" : "yellow";
  const symbol = result.status === 200 ? "✓" : result.status >= 500 || result.status === 0 ? "✗" : "⚠";
  const statusText = result.status === 0 ? "Connection failed" : `${result.status}`;

  log(statusColor, symbol, `${result.page} - ${statusText} (${result.responseTimeMs}ms)`);
}

async function main() {
  const providedUrl = process.argv[2];

  console.log(`${colors.blue}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║         Vercel Deployment Health Check - CoinSite          ║${colors.reset}`);
  console.log(`${colors.blue}╚════════════════════════════════════════════════════════════╝${colors.reset}`);
  console.log();

  // Step 1: Get deployment URL
  console.log(`${colors.blue}[1/5] Fetching deployment...${colors.reset}`);
  let deploymentUrl: string;
  try {
    deploymentUrl = await getLatestDeployment(providedUrl);
    console.log(`Deployment: ${deploymentUrl}`);
  } catch (error) {
    log("red", "✗", error instanceof Error ? error.message : "Failed to get deployment");
    process.exit(1);
  }
  console.log();

  const results: HealthCheckResult[] = [];

  // Step 2: Check deployment status
  console.log(`${colors.blue}[2/5] Checking deployment status...${colors.reset}`);
  const statusResult = checkDeploymentStatus(deploymentUrl);
  printResult(statusResult);
  results.push(statusResult);
  console.log();

  // Step 3: Scan build logs
  console.log(`${colors.blue}[3/5] Scanning build logs...${colors.reset}`);
  const buildResult = scanBuildLogs(deploymentUrl);
  printResult(buildResult);
  results.push(buildResult);
  console.log();

  // Step 4: Check runtime logs
  console.log(`${colors.blue}[4/5] Checking runtime logs...${colors.reset}`);
  const runtimeResult = scanRuntimeLogs(deploymentUrl);
  printResult(runtimeResult);
  results.push(runtimeResult);
  console.log();

  // Step 5: Check production pages
  console.log(`${colors.blue}[5/5] Checking pages on https://${PRODUCTION_DOMAIN}...${colors.reset}`);
  const { results: pageResults, summary: pageSummary } = await checkAllPages();
  pageResults.forEach(printPageResult);
  results.push(pageSummary);
  console.log();

  // Summary
  console.log(`${colors.blue}════════════════════════════════════════════════════════════${colors.reset}`);

  const hasFailures = results.some((r) => r.status === "fail");
  const hasWarnings = results.some((r) => r.status === "warn");

  if (!hasFailures && !hasWarnings) {
    log("green", "✓", "All checks passed - Deployment looks healthy!");
    process.exit(0);
  } else if (hasFailures) {
    log("red", "✗", "Some checks failed - Review the output above");
    process.exit(1);
  } else {
    log("yellow", "⚠", "Some warnings detected - Review the output above");
    process.exit(0);
  }
}

main().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
