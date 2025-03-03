export interface Pattern {
	name: string;
	regex: RegExp;
	description: string;
}

export interface Config {
	patterns: Pattern[];
	exclude: string[];
}

export interface ScanOptions {
	paths: string[];
	patterns: Pattern[];
	exclude: string[];
	silent?: boolean;
	verbose?: boolean;
	staged?: boolean;
}

export interface Finding {
	pattern: Pattern;
	file: string;
	line: number;
	match: string;
	snippet: string;
}

export interface ScanResult {
	findings: Finding[];
	scannedFiles: number;
	duration: number;
}

export interface LoggerOptions {
	silent?: boolean;
	verbose?: boolean;
}

export interface ReporterOptions {
	colored?: boolean;
	format?: "text" | "json" | "csv";
	outputFile?: string;
}
