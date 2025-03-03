import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

/**
 * Gets the list of staged files in the git repository
 */
export async function getStagedFiles(): Promise<string[]> {
  try {
    const { stdout } = await execAsync('git diff --cached --name-only --diff-filter=ACM');
    return stdout
      .split('\n')
      .filter(Boolean)
      .map(file => path.resolve(file));
  } catch (error) {
    throw new Error(`Failed to get staged files: ${(error as Error).message}`);
  }
}
