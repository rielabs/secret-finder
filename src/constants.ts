export const DEFAULT_CONFIG_PATH = ".secret-finder.json";

export const DEFAULT_PATTERNS = [
	{
		name: "AWS Access Key",
		regex: /(?<![A-Za-z0-9_])AKIA[0-9A-Z]{16}(?![A-Za-z0-9_])/g,
		description: "AWS Access Key ID",
	},
	{
		name: "AWS Secret Key",
		regex: /(?<![A-Za-z0-9_])[A-Za-z0-9/+=]{40}(?![A-Za-z0-9_])/g,
		description: "AWS Secret Access Key",
	},
	{
		name: "Private Key",
		regex: /-----BEGIN (?:RSA|DSA|EC|OPENSSH) PRIVATE KEY-----/g,
		description: "Private key",
	},
	{
		name: "Generic API Key",
		regex: /(?<![A-Za-z0-9_])api[_-]?key[_-]?[=:]["']?([A-Za-z0-9]{16,64})["']?/gi,
		description: "Generic API Key",
	},
	{
		name: "Generic Secret",
		regex: /(?<![A-Za-z0-9_])secret[_-]?[=:]["']?([A-Za-z0-9]{16,64})["']?/gi,
		description: "Generic Secret",
	},
	{
		name: "GitHub Token",
		regex: /(?<![A-Za-z0-9_])gh[pousr]_[A-Za-z0-9_]{36}(?![A-Za-z0-9_])/g,
		description: "GitHub Token",
	},
	{
		name: "Generic Password",
		regex: /(?<![A-Za-z0-9_])password[_-]?[=:]["']?([A-Za-z0-9]{8,64})["']?/gi,
		description: "Generic Password",
	},
];

export const DEFAULT_EXCLUSIONS = [
	"node_modules",
	".git",
	"dist",
	"build",
	"*.min.js",
	"*.map",
	"package-lock.json",
	"yarn.lock",
];
