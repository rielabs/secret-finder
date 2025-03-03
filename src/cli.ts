#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { scan } from "./scanner";
import { loadConfig } from "./utils/config";
import { DEFAULT_CONFIG_PATH } from "./constants";
import { createLogger } from "./utils/logger";
import { createReporter } from "./utils/reporter";
import { getStagedFiles } from "./utils/git";

const cli = yargs(hideBin(process.argv))
	.scriptName("secret-finder")
	.usage("$0 [options] [paths..]")
	.option("config", {
		alias: "c",
		type: "string",
		description: "Path to config file",
		default: DEFAULT_CONFIG_PATH,
	})
	.option("exclude", {
		alias: "e",
		type: "array",
		description: "Patterns to exclude from scanning",
		default: [],
	})
	.option("silent", {
		alias: "s",
		type: "boolean",
		description: "Only show findings, no progress information",
		default: false,
	})
	.option("verbose", {
		alias: "v",
		type: "boolean",
		description: "Show detailed information during scan",
		default: false,
	})
	.option("staged", {
		alias: "g",
		type: "boolean",
		description: "Only scan git staged files",
		default: false,
	})
	.help()
	.alias("help", "h")
	.example("$0", "Scan the current directory")
	.example('$0 --exclude "*.log" "node_modules" src/', "Scan src/ excluding node_modules and .log files")
	.example("$0 -c custom-config.json", "Use a custom config file")
	.example("$0 --staged", "Scan only git staged files");

async function main() {
	const argv = await cli.argv;

	try {
		const config = await loadConfig(argv.config as string);

		// Combine exclusions from CLI and config
		const exclusions = [...(config.exclude || []), ...((argv.exclude as string[]) || [])];

		const logger = createLogger({
			silent: argv.silent as boolean,
			verbose: argv.verbose as boolean,
		});

		const reporter = createReporter(logger);

		let paths: string[];
		
		if (argv.staged as boolean) {
			logger.info("Getting git staged files...");
			paths = await getStagedFiles();
			if (paths.length === 0) {
				logger.info("No staged files found.");
				process.exit(0);
			}
			logger.info(`Found ${paths.length} staged files to scan.`);
		} else {
			paths = argv._.length > 0 ? argv._.map((p) => p.toString()) : ["./"];
		}

		logger.info("Starting secret scan...");

		const result = await scan({
			paths,
			patterns: config.patterns,
			exclude: exclusions,
			silent: argv.silent as boolean,
			verbose: argv.verbose as boolean,
			staged: argv.staged as boolean,
		});

		reporter.reportFindings(result);

		if (result.findings.length > 0) {
			process.exit(1);
		} else {
			process.exit(0);
		}
	} catch (error) {
		const logger = createLogger();
		const reporter = createReporter(logger);
		reporter.reportError(error);
		process.exit(1);
	}
}

main();
