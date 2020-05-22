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
  QUnit.module('model', function () {
    const dest = 'packages/engines/dashboards';
    hooks.afterEach(async function () {
      await fs.remove(path.join(FIXTURE_PATH, dest, 'addon/models/sample.js'));
      await fs.remove(path.join(FIXTURE_PATH, dest, 'app/models/sample.js'));
      await fs.remove(path.join(FIXTURE_PATH, dest, 'tests/unit/models/sample-test.js'));
    });

    QUnit.test('should move a model', async function (assert) {
      const result = await execa(EXECUTABLE_PATH, ['model', 'sample', dest], execOpts);

      assert.equal(result.exitCode, 0, 'exited with zero');

      assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'addon/models/sample.js')));
      assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'app/models/sample.js')));
      assert.ok(
        fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'tests/unit/models/sample-test.js'))
      );
    });

    QUnit.test('should move an model from a namespace', async function (assert) {
      const result = await execa(
        EXECUTABLE_PATH,
        ['model', 'sample', dest, '-f', 'my-models'],
        execOpts
      );

      assert.equal(result.exitCode, 0, 'exited with zero');

      assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'addon/models/sample.js')));
      assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'app/models/sample.js')));
      assert.ok(
        fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'tests/unit/models/sample-test.js'))
      );
    });

    QUnit.test('should not move an model with dry-run', async function (assert) {
      const result = await execa(EXECUTABLE_PATH, ['model', 'sample', dest, '-d'], execOpts);

      assert.equal(result.exitCode, 0, 'exited with zero');

      assert.notOk(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'addon/models/sample.js')));
      assert.notOk(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'app/models/sample.js')));
      assert.notOk(
        fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'tests/unit/models/sample-test.js'))
      );
    });

    QUnit.test('should emit a warning if there is no test', async function (assert) {
      const result = await execa(EXECUTABLE_PATH, ['model', 'sample2', dest], execOpts);

      assert.equal(result.exitCode, 0, 'exited with zero');

      assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'addon/models/sample2.js')));
      assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'app/models/sample2.js')));
      assert.notOk(
        fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'tests/unit/models/sample2-test.js'))
      );
      assert.ok(result.stdout.includes('WARNING'));
    });
  });
});
