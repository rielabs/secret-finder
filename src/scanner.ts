import { Finding, Pattern, ScanOptions, ScanResult } from "./types";
import { getFilesToScan } from "./utils/fileSystem";
import { Logger, createLogger } from "./utils/logger";
import { Reporter, createReporter } from "./utils/reporter";
import fs from "fs";
import chalk from "chalk";

export async function scan(options: ScanOptions): Promise<ScanResult> {
	const logger = createLogger(options);
	const reporter = createReporter(logger);
	const startTime = Date.now();
	const findings: Finding[] = [];

	reporter.reportScanStart(options.paths, options.exclude);

	try {
		// Get all files to scan
		const files = await getFilesToScan(options.paths, options.exclude);
		reporter.reportFileCount(files.length);

		// Process each file
		for (const file of files) {
			logger.debug(`Scanning ${file}...`);
			try {
				const content = fs.readFileSync(file, "utf-8");
				const lines = content.split("\n");

				// Check each pattern
				for (const pattern of options.patterns) {
					const fileFindings = scanFileWithPattern(file, lines, pattern);
					findings.push(...fileFindings);
				}
			} catch (error) {
				logger.warn(`Couldn't read file ${file}: ${error}`);
			}
		}

		return {
			findings,
			scannedFiles: files.length,
			duration: Date.now() - startTime,
		};
	} catch (error) {
		logger.error(`Scan failed: ${error}`);
		throw error;
	}
}

function scanFileWithPattern(file: string, lines: string[], pattern: Pattern): Finding[] {
	const findings: Finding[] = [];

	lines.forEach((line, index) => {
		// Reset regex lastIndex to avoid issues with global flag
		pattern.regex.lastIndex = 0;

		let match: RegExpExecArray | null;
		while ((match = pattern.regex.exec(line)) !== null) {
			findings.push(createFinding(file, lines, index, match, pattern));
		}
	});

	return findings;
}

function createFinding(
	file: string,
	lines: string[],
	lineIndex: number,
	match: RegExpExecArray,
	pattern: Pattern,
): Finding {
	// Get context for the finding (few lines before and after)
	const startLine = Math.max(0, lineIndex - 2);
	const endLine = Math.min(lines.length - 1, lineIndex + 2);
	const contextLines = getContextLines(lines, startLine, endLine, lineIndex, match);

	return {
		pattern,
		file,
		line: lineIndex + 1,
		match: match[0],
		snippet: contextLines.join("\n"),
	};
}

function getContextLines(
	lines: string[],
	startLine: number,
	endLine: number,
	matchLineIndex: number,
	match: RegExpExecArray,
): string[] {
	return lines.slice(startLine, endLine + 1).map((contextLine, i) => {
		const lineNumber = startLine + i + 1;
		if (lineNumber === matchLineIndex + 1) {
			// Highlight the line with the finding
			return highlightMatch(contextLine, match, lineNumber);
		}
		return `${lineNumber}: ${contextLine}`;
	});
}

function highlightMatch(line: string, match: RegExpExecArray, lineNumber: number): string {
	const before = line.substring(0, match.index);
	const matched = line.substring(match.index, match.index + match[0].length);
	const after = line.substring(match.index + match[0].length);
	return `${lineNumber}: ${before}${chalk.red(matched)}${after}`;
}
