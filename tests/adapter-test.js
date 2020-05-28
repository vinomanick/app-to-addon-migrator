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

// const { handler } = require('../src/handlers/adapter.js');

QUnit.module('atam-cli', function (hooks) {
  QUnit.module('adapter', function () {
    const destination = 'packages/engines/dashboards';

    hooks.beforeEach(function () {
      process.chdir(FIXTURE_PATH);
    });

    hooks.afterEach(async function () {
      await fs.remove(path.join(FIXTURE_PATH, destination, 'addon/adapters/sample.js'));
      await fs.remove(path.join(FIXTURE_PATH, destination, 'app/adapters/sample.js'));
      await fs.remove(path.join(FIXTURE_PATH, destination, 'tests/unit/adapters/sample-test.js'));
    });

    QUnit.test('should move an adapter', async function (assert) {
      const result = await execa(EXECUTABLE_PATH, ['adapter', 'sample', destination], execOpts);
      debugger

      assert.equal(result.exitCode, 0, 'exited with zero');

      // const options = {
      //   adapterName: 'sample',
      //   destination,
      // };

      // handler(options);

      assert.ok(
        fs.pathExistsSync(path.join(FIXTURE_PATH, destination, 'addon/adapters/sample.js'))
      );
      assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, destination, 'app/adapters/sample.js')));
      assert.ok(
        fs.pathExistsSync(
          path.join(FIXTURE_PATH, destination, 'tests/unit/adapters/sample-test.js')
        )
      );
    });

    QUnit.test('should move an adapter from a namespace', async function (assert) {
      const result = await execa(
        EXECUTABLE_PATH,
        ['adapter', 'sample', destination, '-f', 'my-adapters'],
        execOpts
      );

      assert.equal(result.exitCode, 0, 'exited with zero');

      assert.ok(
        fs.pathExistsSync(path.join(FIXTURE_PATH, destination, 'addon/adapters/sample.js'))
      );
      assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, destination, 'app/adapters/sample.js')));
      assert.ok(
        fs.pathExistsSync(
          path.join(FIXTURE_PATH, destination, 'tests/unit/adapters/sample-test.js')
        )
      );
    });

    QUnit.test('should not move an adapter with dry-run', async function (assert) {
      const result = await execa(
        EXECUTABLE_PATH,
        ['adapter', 'sample', destination, '-d'],
        execOpts
      );

      assert.equal(result.exitCode, 0, 'exited with zero');

      assert.notOk(
        fs.pathExistsSync(path.join(FIXTURE_PATH, destination, 'addon/adapters/sample.js'))
      );
      assert.notOk(
        fs.pathExistsSync(path.join(FIXTURE_PATH, destination, 'app/adapters/sample.js'))
      );
      assert.notOk(
        fs.pathExistsSync(
          path.join(FIXTURE_PATH, destination, 'tests/unit/adapters/sample-test.js')
        )
      );
    });

    QUnit.test('should emit a warning if there is no test', async function (assert) {
      const result = await execa(EXECUTABLE_PATH, ['adapter', 'sample2', destination], execOpts);

      assert.equal(result.exitCode, 0, 'exited with zero');

      assert.ok(
        fs.pathExistsSync(path.join(FIXTURE_PATH, destination, 'addon/adapters/sample2.js'))
      );
      assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, destination, 'app/adapters/sample2.js')));
      assert.notOk(
        fs.pathExistsSync(
          path.join(FIXTURE_PATH, destination, 'tests/unit/adapters/sample2-test.js')
        )
      );
      assert.ok(result.stdout.includes('WARNING'));
    });
  });
});
