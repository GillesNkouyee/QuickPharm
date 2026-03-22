const fs = require('fs');
const path = require('path');
const assert = require('assert');

const repoRoot = path.resolve(__dirname, '..');
const pkg = require(path.join(repoRoot, 'package.json'));
const renderYaml = fs.readFileSync(path.join(repoRoot, 'render.yaml'), 'utf8');
const dockerfile = fs.readFileSync(path.join(repoRoot, 'Dockerfile'), 'utf8');

assert.strictEqual(pkg.name, 'quickpharm', 'package.json name must be quickpharm');
assert.ok(pkg.scripts && pkg.scripts.start, 'package.json must expose a start script');
assert.ok(pkg.scripts && pkg.scripts.test, 'package.json must expose a test script');
assert.ok(/dockerfilePath:\s*Dockerfile/.test(renderYaml), 'render.yaml must target Dockerfile');
assert.ok(!/mongodb\+srv:\/\//i.test(renderYaml), 'render.yaml must not hardcode MongoDB credentials');
assert.ok(!/smtp:\/\//i.test(renderYaml), 'render.yaml must not hardcode SMTP credentials');
assert.ok(/COPY\s+deploy\/bundle\/bundle\s+\.\/bundle/.test(dockerfile), 'Dockerfile must copy the Meteor bundle');

console.log('Configuration validation passed.');
