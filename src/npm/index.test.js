import PackagesFetcher from './packagesFetcher.js';

const packagesFetcher = new PackagesFetcher({
  limit: 1,
  max: 2,
});

(async () => {
  await packagesFetcher.prefetch();

  const packages = packagesFetcher.get();
  console.log(packages);
  console.log(packagesFetcher.storage.length);
})();
