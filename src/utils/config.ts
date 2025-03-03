import fs from "fs";
import { Config, Pattern } from "../types";
import { DEFAULT_EXCLUSIONS, DEFAULT_PATTERNS } from "../constants";

interface UserConfigPattern {
	name: string;
	regex: string | RegExp;
	description: string;
}

interface UserConfig {
	patterns?: UserConfigPattern[];
	exclude?: string[];
}

/**
 * Loads and merges configuration from the specified file
 */
export async function loadConfig(configPath: string): Promise<Config> {
	// Start with default configuration
	const config: Config = {
		patterns: [...DEFAULT_PATTERNS],
		exclude: [...DEFAULT_EXCLUSIONS],
	};

	// Try to read the config file
	try {
		if (fs.existsSync(configPath)) {
			const fileContent = fs.readFileSync(configPath, "utf-8");
			const userConfig = parseConfig(fileContent);
			mergeConfig(config, userConfig);
		}
	} catch (error) {
		// Improve error message based on error type
		if (error instanceof SyntaxError) {
			console.warn(`Warning: Invalid JSON in config file ${configPath}`);
		} else if (error instanceof Error) {
			console.warn(`Warning: Could not load config from ${configPath}: ${error.message}`);
		} else {
			console.warn(`Warning: Could not load config from ${configPath}`);
		}
	}

	return config;
}

function parseConfig(fileContent: string): UserConfig {
	try {
		return JSON.parse(fileContent);
	} catch (error) {
		throw new SyntaxError(`Invalid JSON: ${error}`);
	}
}

function mergeConfig(config: Config, userConfig: UserConfig): void {
	// Merge patterns
	if (userConfig.patterns && Array.isArray(userConfig.patterns)) {
		userConfig.patterns.forEach((pattern) => {
			if (isValidPattern(pattern)) {
				config.patterns.push({
					name: pattern.name,
					regex: convertToRegExp(pattern.regex),
					description: pattern.description,
				});
			}
		});
	}

	// Add user exclusions
	if (userConfig.exclude && Array.isArray(userConfig.exclude)) {
		config.exclude.push(...userConfig.exclude);
	}
}

function isValidPattern(pattern: any): pattern is UserConfigPattern {
	return (
		pattern &&
		typeof pattern.name === "string" &&
		(typeof pattern.regex === "string" || pattern.regex instanceof RegExp) &&
		typeof pattern.description === "string"
	);
}

function convertToRegExp(regex: string | RegExp): RegExp {
	if (regex instanceof RegExp) {
		return regex;
	}

	// Extract flags if present (like /pattern/g)
	let flags = "";
	let regexStr = regex;

	// Check if the string regex has flags format
	const regexMatch = regex.match(/^\/(.+)\/([gimsuy]*)$/);
	if (regexMatch) {
		regexStr = regexMatch[1];
		flags = regexMatch[2];
	}

	return new RegExp(regexStr, flags);
}
