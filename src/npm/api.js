import got from 'got';
import ms from 'ms';
import PouchDB from 'pouchdb-http';

import config from './../config.js';
import datadog from './../datadog.js';

const db = new PouchDB(config.npmRegistryEndpoint, {
  ajax: {
    timeout: ms('2.5m'), // default is 10s
  },
});

const defaultOptions = {
  include_docs: true, // eslint-disable-line camelcase
  conflicts: false,
  attachments: false,
};

async function findAll(options) {
  const start2 = Date.now();
  const results = await db.allDocs({
    ...defaultOptions,
    ...options,
  });
  datadog.timing('db.allDocs', Date.now() - start2);

  return results;
}

function listenToChanges(options) {
  const start2 = Date.now();
  const changes = db.changes({
    ...defaultOptions,
    ...options,
  });
  datadog.timing('db.changes', Date.now() - start2);
  return changes;
}

async function getInfo() {
  const start = Date.now();

  const {
    body: { doc_count: nbDocs, update_seq: seq },
  } = await got(config.npmRegistryEndpoint, {
    json: true,
  });

  datadog.timing('npm.info', Date.now() - start);

  return {
    nbDocs,
    seq,
  };
}

export default {
  findAll,
  listenToChanges,
  getInfo,
};
