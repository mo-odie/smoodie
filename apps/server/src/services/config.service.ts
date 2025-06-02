import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

export interface ConfigOptions {
  envFilePaths?: string | string[] | undefined;
  ignoreEnvFile?: boolean;
}

function validateDotenvFormat(filePath: string): void {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  for (const [i, line] of lines.entries()) {
    const trimmed = line.trim();
    if (
      trimmed === '' ||
      trimmed.startsWith('#')
    ) continue;

    const validEnvLine = /^(export\s+)?[A-Za-z_][A-Za-z0-9_]*\s*=\s*(.*)?$/;
    if (!validEnvLine.test(trimmed)) {
      throw new Error(
        `Invalid .env format at line ${i + 1}: "${line}"`
      );
    }
  }
}

export class ConfigService {
  private static _config: Record<string, string> = {};

  static Metadata = {
    construct: () => new ConfigService()
  };

  static forRoot(options?: ConfigOptions) {
    const { envFilePaths, ignoreEnvFile } = options ?? {};

    if (!ignoreEnvFile) {
      const defaultPaths = [
        path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`),
        path.resolve(process.cwd(), '.env.local'),
        path.resolve(process.cwd(), '.env'),
      ];
      const files = envFilePaths
        ? (typeof envFilePaths === 'string' ? [envFilePaths] : envFilePaths)
        : defaultPaths;

      for (const p of files) {
        if (fs.existsSync(p)) {
          validateDotenvFormat(p);
          const envConfig = dotenv.parse(fs.readFileSync(p));
          Object.assign(ConfigService._config, envConfig);
        }

      }
      Object.assign(process.env, ConfigService._config);
    }

    return ConfigService;
  }

  get<T = string>(key: string): T | undefined {
    return (ConfigService._config[key] ?? process.env[key]) as T | undefined;
  }
}
