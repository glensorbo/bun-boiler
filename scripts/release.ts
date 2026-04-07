#!/usr/bin/env bun

// Unset placeholder env vars so gh reads the real token from its keychain/config
const { stdout: tokenRaw } =
  await Bun.$`bash -c 'unset GH_TOKEN GITHUB_TOKEN; gh auth token'`.quiet();
const ghToken = tokenRaw.toString().trim();

// Detect repo from git remote to avoid gh CLI detection failures inside Bun.$
const { stdout: remoteRaw } = await Bun.$`git remote get-url origin`.quiet();
const remote = remoteRaw.toString().trim();
const repoMatch = remote.match(/github\.com[:/](.+?)(?:\.git)?$/);
if (!repoMatch) {
  console.error('❌ Could not detect GitHub repo from git remote.');
  process.exit(1);
}
const repo = repoMatch[1];

// Scoped shell with the real GH_TOKEN injected
const $ = Bun.$.env({ ...process.env, GH_TOKEN: ghToken });

const { stdout: tagsRaw } = await $`git tag --sort=-version:refname`.quiet();
const allTags = tagsRaw.toString().trim().split('\n').filter(Boolean);

// Find the latest RC tag
const rcTags = allTags.filter((t) => /^v\d+\.\d+\.\d+-rc\d+$/.test(t));
const latestRc = rcTags[0];

if (!latestRc) {
  console.error(
    '❌ No RC tags found. Run `bun tag <patch|minor|major>` first.',
  );
  process.exit(1);
}

// Strip the -rcN suffix to get the stable version
const stableVersion = latestRc.replace(/-rc\d+$/, '');

console.log(`🏷️  Latest RC      : ${latestRc}`);
console.log(`🚀 Releasing      : ${stableVersion}`);

// Check if a release already exists for this version
const existingRelease =
  await $`gh release view ${stableVersion} --repo ${repo} --json tagName`
    .quiet()
    .nothrow();
if (existingRelease.exitCode === 0) {
  console.error(`❌ Release ${stableVersion} already exists.`);
  process.exit(1);
}

await $`gh release create ${stableVersion} --repo ${repo} --generate-notes --latest --title ${stableVersion}`;

console.log(`✅ Released ${stableVersion} — prod deploy triggered!`);
