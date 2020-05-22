const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');
const QUnit = require('qunit');

const PROJECT_ROOT = path.join(__dirname, '..');
const EXECUTABLE_PATH = path.join(PROJECT_ROOT, 'bin', 'cli.js');
const FIXTURE_PATH = path.join(__dirname, 'fixtures/input');

// resolved from the root of the project
const inputDir = path.resolve('./tests/fixtures/input');
const execOpts = { cwd: inputDir, stderr: 'inherit' };

QUnit.module('atam-cli', function (hooks) {
  QUnit.module('storage', function () {
    const dest = 'packages/engines/dashboards';
    hooks.afterEach(async function () {
      await fs.remove(path.join(FIXTURE_PATH, dest, 'app/storages/sample.js'));
    });

    QUnit.test('should move an storage', async function (assert) {
      const result = await execa(EXECUTABLE_PATH, ['storage', 'sample', dest], execOpts);

      assert.equal(result.exitCode, 0, 'exited with zero');

      assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'app/storages/sample.js')));
    });

    QUnit.test('should move an storage from a namespace', async function (assert) {
      const result = await execa(
        EXECUTABLE_PATH,
        ['storage', 'sample', dest, '-f', 'my-storages'],
        execOpts
      );

      assert.equal(result.exitCode, 0, 'exited with zero');

      assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'app/storages/sample.js')));
    });

    QUnit.test('should not move an storage with dry-run', async function (assert) {
      const result = await execa(EXECUTABLE_PATH, ['storage', 'sample', dest, '-d'], execOpts);

      assert.equal(result.exitCode, 0, 'exited with zero');

      assert.notOk(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'app/storages/sample.js')));
    });
  });
});
