import buildData from '../build-number.json';

export function getBuildNumber(): number {
  return buildData.build;
}

export function getBuildInfo(): string {
  const version = process.env.npm_package_version || '0.1.0';
  return `v${version} (Build ${buildData.build})`;
}
