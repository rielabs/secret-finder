import chalk from "chalk";

export enum LogLevel {
	DEBUG,
	INFO,
	WARN,
	ERROR,
}

interface LoggerOptions {
	silent?: boolean;
	verbose?: boolean;
}

export class Logger {
	private silent: boolean;
	private verbose: boolean;

	constructor(options: LoggerOptions = {}) {
		this.silent = options.silent || false;
		this.verbose = options.verbose || false;
	}

	debug(message: string): void {
		if (this.verbose && !this.silent) {
			console.log(chalk.gray(message));
		}
	}

	info(message: string): void {
		if (!this.silent) {
			console.log(chalk.blue(message));
		}
	}

	warn(message: string): void {
		if (!this.silent) {
			console.log(chalk.yellow(message));
		}
	}

	error(message: string): void {
		console.error(chalk.red(message));
	}

	success(message: string): void {
		if (!this.silent) {
			console.log(chalk.green(message));
		}
	}

	finding(finding: any): void {
		console.log(chalk.yellow(`\n[${finding.pattern.name}] in ${finding.file}:${finding.line}`));
		console.log(chalk.gray(finding.snippet));
	}
}

export const createLogger = (options?: LoggerOptions): Logger => new Logger(options);
