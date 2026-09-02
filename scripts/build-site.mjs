import { access, cp, lstat, mkdir, rm } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const supportedSites = new Set(['site-aijing', 'site-fedi', 'site-azer']);
const siteName = process.argv[2];

if (!supportedSites.has(siteName)) {
  console.error(
    `Usage: node scripts/build-site.mjs <site>\nSites autorisés : ${[...supportedSites].join(', ')}`,
  );
  process.exit(1);
}

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, '..');
const siteSource = join(projectRoot, 'sites', siteName);
const engineSource = join(projectRoot, 'packages', 'vanilla-engine');
const outputDirectory = join(projectRoot, 'dist', siteName);

async function includeInBuild(source) {
  if (basename(source) === '.DS_Store') {
    return false;
  }

  // A deployment artifact must never depend on a local symbolic link.
  return !(await lstat(source)).isSymbolicLink();
}

try {
  await access(siteSource);
  await access(engineSource);

  // A build is always clean: deleted source files must not survive in dist/.
  await rm(outputDirectory, { recursive: true, force: true });
  await mkdir(outputDirectory, { recursive: true });

  // Ignore the development symlink. The real engine is copied just below.
  await cp(siteSource, outputDirectory, {
    recursive: true,
    filter: includeInBuild,
  });

  await cp(engineSource, join(outputDirectory, 'vanilla-engine'), {
    recursive: true,
    filter: includeInBuild,
  });

  console.log(`Build prêt : dist/${siteName}`);
} catch (error) {
  console.error(`Impossible de construire ${siteName}.`, error);
  process.exit(1);
}
