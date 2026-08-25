import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = '/home/ubuntu/text-similarity-lab';
const repo = 'carolineferreira161/Tcc';
const clean = (value) => value.replace(/\x1b\][^\x07]*(?:\x07|$)/g, '').replace(/\x1b\[[0-?]*[ -/]*[@-~]/g, '');
const api = (...args) => clean(execFileSync('gh', ['api', ...args], { encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 })).trim();
const apiJson = (args, body) => JSON.parse(clean(execFileSync('gh', ['api', ...args, '--input', '-'], { input: JSON.stringify(body), encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 })));

function filesIn(dir) {
  const result = [];
  for (const entry of readdirSync(dir)) {
    if (['.git', 'dist', 'node_modules', '.manus-logs'].includes(entry)) continue;
    const absolute = join(dir, entry);
    const stat = statSync(absolute);
    if (stat.isDirectory()) result.push(...filesIn(absolute));
    else result.push(absolute);
  }
  return result;
}

const ref = JSON.parse(api(`repos/${repo}/git/ref/heads/main`));
const parentSha = ref.object.sha;
const currentCommit = JSON.parse(api(`repos/${repo}/git/commits/${parentSha}`));
const entries = filesIn(root).map((absolute) => {
  const path = relative(root, absolute).replaceAll('\\', '/');
  const raw = readFileSync(absolute);
  const isText = !/\.(webp|png|jpg|jpeg|gif|ico|woff2?|ttf)$/i.test(path);
  return { path, raw, isText };
});

const treeEntries = [];
for (const entry of entries) {
  const blob = apiJson([`repos/${repo}/git/blobs`, '--method', 'POST'], {
    content: entry.isText ? entry.raw.toString('utf8') : entry.raw.toString('base64'),
    encoding: entry.isText ? 'utf-8' : 'base64',
  });
  treeEntries.push({ path: entry.path, mode: '100644', type: 'blob', sha: blob.sha });
}

const tree = apiJson([`repos/${repo}/git/trees`, '--method', 'POST'], {
  base_tree: currentCommit.tree.sha,
  tree: treeEntries,
});
const commit = apiJson([`repos/${repo}/git/commits`, '--method', 'POST'], {
  message: 'publish Text Similarity Lab for Vercel',
  tree: tree.sha,
  parents: [parentSha],
});
apiJson([`repos/${repo}/git/refs/heads/main`, '--method', 'PATCH'], {
  sha: commit.sha,
  force: false,
});
console.log(JSON.stringify({ repository: `https://github.com/${repo}`, commit: commit.sha, files: treeEntries.length }, null, 2));
