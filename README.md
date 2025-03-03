# Secret Finder

A command-line tool to scan your codebase for sensitive information and secrets that should not be committed to your repository.

## Features

- 🔍 Scan files for secrets and sensitive information
- 🚫 Prevent accidental commits of secrets
- ⚙️ Customizable patterns
- 🔧 Configurable exclusions
- 🔄 Git integration to scan only staged files

## Installation

### Global Installation

Install globally to use the tool across all projects:

```bash
# Using npm
npm install -g secret-finder

# Using yarn
yarn global add secret-finder

# Using pnpm
pnpm install -g secret-finder
```

### Local Installation (Dev Dependency)

Install as a dev dependency in your project:

```bash
# Using npm
npm install --save-dev secret-finder

# Using yarn
yarn add -D secret-finder

# Using pnpm
pnpm add -D secret-finder
```

## Basic Usage

### If installed globally:

```bash
# Scan the current directory
secret-finder

# Scan specific paths
secret-finder src/ config/

# Scan with exclusions
secret-finder --exclude "*.log" "node_modules"

# Scan only git staged files
secret-finder --staged
```

### If installed locally:

```bash
# Scan the current directory
npx secret-finder

# Scan specific paths
npx secret-finder src/ config/

# Scan with exclusions
npx secret-finder --exclude "*.log" "node_modules"

# Scan only git staged files
npx secret-finder --staged
```

You can also add scripts to your package.json:

```json
{
  "scripts": {
    "scan": "secret-finder",
    "scan:staged": "secret-finder --staged"
  }
}
```

Then run:
```bash
npm run scan
# or
npm run scan:staged
```

## CLI Options

| Option | Alias | Description |
| ------ | ----- | ----------- |
| `--config` | `-c` | Path to config file (default: `.secret-finder.json`) |
| `--exclude` | `-e` | Patterns to exclude from scanning |
| `--silent` | `-s` | Only show findings, no progress information |
| `--verbose` | `-v` | Show detailed information during scan |
| `--staged` | `-g` | Only scan git staged files |
| `--help` | `-h` | Show help |

## Configuration (Optional)

Create a `.secret-finder.json` file in your project root:

```json
{
  "patterns": [
    {
      "name": "AWS Access Key",
      "regex": "AKIA[0-9A-Z]{16}",
      "description": "AWS Access Key ID"
    },
    {
      "name": "GitHub Token",
      "regex": "gh[pousr]_[a-zA-Z0-9]{16,}",
      "description": "GitHub Personal Access Token"
    }
  ],
  "exclude": [
    "node_modules",
    "dist",
    "*.lock"
  ]
}
```

## Integration with Husky (Pre-commit Hook)

Prevent committing secrets by setting up a pre-commit hook using Husky.

### Step 1: Install Husky

```bash
# Using npm
npm install --save-dev husky

# Using yarn
yarn add -D husky

# Initialize husky
npx husky install
```

Add the following to your package.json:

```json
{
  "scripts": {
    "prepare": "husky"
  }
}
```

### Step 2: Create a Pre-commit Hook

#### If installed globally:

```bash
echo "secret-finder --staged" > .husky/pre-commit
```

#### If installed as dev dependency:

```bash
echo "npx secret-finder --staged" > .husky/pre-commit
```

This will create a pre-commit hook that runs the secret scanner only on staged files.

### Step 3: (Optional) More Advanced Pre-commit Setup

For more advanced usage, you can create a custom pre-commit script:

```bash
#!/bin/sh
# .husky/pre-commit

echo "🔍 Checking for secrets in staged files..."

# If installed globally
# secret-finder --staged --silent

# If installed as dev dependency
npx secret-finder --staged --silent

# If the scanner found secrets, it will exit with code 1, which will abort the commit
if [ $? -ne 0 ]; then
  echo "❌ Secret check failed. Please remove secrets before committing."
  exit 1
fi

echo "✅ No secrets found in staged files."
```

## Troubleshooting

### No Staged Files Error

If you get an error about no staged files being found, make sure you have added files to the git staging area using `git add`.

### Command Not Found

- If installed globally and you get "command not found", check if your global npm/yarn binaries directory is in your PATH.
- If installed locally, make sure to use `npx secret-finder` or run through package.json scripts.

### False Positives

If you're getting false positives, you can:
1. Update your patterns in the configuration file
2. Add specific files or patterns to the exclude list
3. Use `--verbose` to debug which patterns are matching

## License

MIT