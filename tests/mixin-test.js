const fs = require('fs-extra')
const path = require('path')
const execa = require('execa')
const QUnit = require('qunit')

const PROJECT_ROOT = path.join(__dirname, '..')
const EXECUTABLE_PATH = path.join(PROJECT_ROOT, 'bin', 'cli.js')
const FIXTURE_PATH = path.join(__dirname, 'fixtures/input')

// resolved from the root of the project
const inputDir = path.resolve('./tests/fixtures/input')
const execOpts = { cwd: inputDir, stderr: 'inherit' }

QUnit.module('atam-cli', function (hooks) {
  QUnit.module('mixin', function () {
    const dest = 'packages/engines/dashboards'
    hooks.afterEach(async function () {
      await fs.remove(path.join(FIXTURE_PATH, dest, 'addon/mixins/sample.js'))
      await fs.remove(path.join(FIXTURE_PATH, dest, 'tests/unit/mixins/sample-test.js'))
    })

    QUnit.test('should move a mixin', async function (assert) {
      const result = await execa(EXECUTABLE_PATH, ['mixin', 'sample', dest], execOpts)

      assert.equal(result.exitCode, 0, 'exited with zero')

      assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'addon/mixins/sample.js')))
      assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'tests/unit/mixins/sample-test.js')))
    })

    QUnit.test('should move an mixin from a namespace', async function (assert) {
      const result = await execa(EXECUTABLE_PATH, ['mixin', 'sample', dest, '-f', 'my-mixins'], execOpts)

      assert.equal(result.exitCode, 0, 'exited with zero')

      assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'addon/mixins/sample.js')))
      assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'tests/unit/mixins/sample-test.js')))
    })

    QUnit.test('should not move an mixin with dry-run', async function (assert) {
      const result = await execa(EXECUTABLE_PATH, ['mixin', 'sample', dest, '-d'], execOpts)

      assert.equal(result.exitCode, 0, 'exited with zero')

      assert.notOk(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'addon/mixins/sample.js')))
      assert.notOk(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'tests/unit/mixins/sample-test.js')))
    })

    QUnit.test('should emit a warning if there is no test', async function (assert) {
      const result = await execa(EXECUTABLE_PATH, ['mixin', 'sample2', dest], execOpts)

      assert.equal(result.exitCode, 0, 'exited with zero')

      assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'addon/mixins/sample2.js')))
      assert.notOk(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'tests/unit/mixins/sample2-test.js')))
      assert.ok(result.stdout.includes('WARNING'))
    })
  })
})
