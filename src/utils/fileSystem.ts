import glob from "fast-glob";
import path from "path";
import fs from "fs";

/**
 * Gets all files to scan based on provided paths and exclusions
 */
export async function getFilesToScan(paths: string[], exclude: string[]): Promise<string[]> {
	// Convert exclusions to glob patterns
	const ignorePatterns = exclude.map((pattern) => {
		// If pattern doesn't start with '*' or '**' and doesn't include a slash, make it match anywhere
		if (!pattern.startsWith("*") && !pattern.startsWith("!") && !pattern.includes("/")) {
			return `**/${pattern}`;
		}
		return pattern;
	});

	// Convert simple directory names to glob patterns
	const globPatterns = paths.map((p) => {
		if (fs.existsSync(p) && fs.statSync(p).isDirectory()) {
			return `${p}/**/*`;
		}
		return p;
	});

	// Get all files
	const files = await glob(globPatterns, {
		ignore: ignorePatterns,
		dot: true,
		onlyFiles: true,
		followSymbolicLinks: false,
	});

	// Return absolute paths
	return files.map((file) => path.resolve(file));
}
