import got from 'got';
import log from './log.js';
import config from './config.js';
import datadog from './datadog.js';

const hits = new Map();

function formatHits(pkg) {
  hits.set(pkg.name, pkg.hits);
}

/**
 * Load downloads hits
 */
export async function loadHits() {
  const start = Date.now();
  log.info('📦  Loading hits from jsDelivr');

  try {
    const { body: hitsJSON } = await got(config.jsDelivrHitsEndpoint, {
      json: true,
    });
    hits.clear();
    hitsJSON.forEach(formatHits);
  } catch (e) {
    log.error(e);
  }

  datadog.timing('jsdelivr.loadHits', Date.now() - start);
}

/**
 * Get download hits
 * @param {array} pkgs
 */
export function getHits(pkgs) {
  const start = Date.now();
  return pkgs.map(({ name }) => {
    const jsDelivrHits = hits.get(name) || 0;

    datadog.timing('jsdelivr.getHits', Date.now() - start);
    return {
      jsDelivrHits,
      _searchInternal: {
        // anything below 1000 hits/month is likely to mean that
        // someone just made a few random requests so we count that as 0
        jsDelivrPopularity: Math.max(jsDelivrHits.toString().length - 3, 0),
      },
    };
  });
}

/**
 * Get packages files list
 * @param {array} pkgs
 */
export async function getAllFilesList(pkgs) {
  const files = await Promise.all(pkgs.map(getFilesList));
  return files;
}

/**
 * Get one package files list
 * @param {object} pkg
 */
async function getFilesList(pkg) {
  const files = await got(`${config.jsDelivrPackageEndpoint}/${pkg.name}`, {
    json: true,
  });
  return files;
}
