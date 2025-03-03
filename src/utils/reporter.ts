import { ScanResult } from "../types";
import { Logger } from "./logger";

export class Reporter {
	private logger: Logger;

	constructor(logger: Logger) {
		this.logger = logger;
	}

	reportScanStart(paths: string[], exclude: string[]): void {
		this.logger.info(`Scanning paths: ${paths.join(", ")}`);
		if (exclude.length > 0) {
			this.logger.info(`Excluding: ${exclude.join(", ")}`);
		}
	}

	reportFileCount(count: number): void {
		this.logger.info(`Scanning ${count} files...`);
	}

	reportFindings(result: ScanResult): void {
		if (result.findings.length > 0) {
			this.logger.error(`Found ${result.findings.length} potential secrets!`);
			result.findings.forEach((finding) => this.logger.finding(finding));
		} else {
			this.logger.success("No secrets found! 🎉");
		}

		this.logger.info(`Scanned ${result.scannedFiles} files in ${result.duration}ms`);
	}

	reportError(error: unknown): void {
		if (error instanceof Error) {
			this.logger.error(`Error: ${error.message}`);
		} else {
			this.logger.error("An unknown error occurred");
		}
	}
}

export const createReporter = (logger: Logger): Reporter => new Reporter(logger);
