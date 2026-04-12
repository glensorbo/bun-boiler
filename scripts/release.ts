#!/usr/bin/env bun

// Bun auto-loads .env which may have a placeholder GH_TOKEN. Unset it first
// so gh reads the real token from its config, then inject it back for Bun.$.
const { stdout: tokenRaw } =
  await Bun.$`bash -c 'unset GH_TOKEN GITHUB_TOKEN; gh auth token'`.quiet();
const ghToken = tokenRaw.toString().trim();
if (!ghToken) {
  console.error('❌ Not authenticated with gh. Run `gh auth login` first.');
  process.exit(1);
}

// Create a $ shell that has GH_TOKEN injected alongside the full process env.
const $ = Bun.$.env({ ...process.env, GH_TOKEN: ghToken });

const { stdout: remoteRaw } = await $`git remote get-url origin`.quiet();
const remote = remoteRaw.toString().trim();
const repoMatch = remote.match(/github\.com[:/](.+?)(?:\.git)?$/);
if (!repoMatch?.[1]) {
  console.error('❌ Could not determine GitHub repo from git remote.');
  process.exit(1);
}
const repo = repoMatch[1];

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
