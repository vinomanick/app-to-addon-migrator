# app-to-addon-migrator
An opinionated cli tool to migrate Ember components from app to addons within a Yarn workspace.

*NOTE:* This cli tool works only with the following conventional folder structure for your Ember app.

```
|-app
|-packages
| |-addons
| |-engines
| | |-dashboards-engine
| | |-tickets-engine

```

## Install
```
npm i -g app-to-addon-migrator
```

## Usage
```
atam [entity] [entity-name] [dest-folder]
atam route default dashboards-engine
```

After running the above command, the route `default` from `app/routes/default.js` will be
moved to `packages/engines/dashboards-engine/addon/routes/default.js`

### Dry-run
If you just want to see/verify the movement use the `--dry-run` or `-d` option.

```
atam route default dashboards-engine -d
```

This will print something like (without actually copying the files):
```
Moving route.js
---------------
app/routes/helpdesk/default.js
packages/engines/dashboards-engine/addon/routes/default.js


Moving route template.hbs
-------------------------
app/templates/helpdeskdefault.hbs
packages/engines/dashboards-engine/addon/templates/default.hbs

...
```

## Commands:
```
  atam adapter <adapter-name>             Copy an adapter from app to addon
  <addon-name>
  atam component [component-name]         Copy a component from app to addon
  [addon-name]
  atam constant [constant-name]           Copy a constant from app to addon
  [addon-name]
  atam helper [helper-name] [addon-name]  Copy a helper from app to addon
  atam mixin [mixin-name] [addon-name]    Copy a mixin from app to addon
  atam model [model-name] [addon-name]    Copy a model from app to addon
  atam route [route-name] [addon-name]    Copy a route with controller from
                                            app to addon
  atam routex [route-name] [addon-name]   Copy a route and its dependent
                                            components from app to addon
  atam storage [storage-name]             Copy a storage from app to addon
  [addon-name]
  atam util [util-name] [addon-name]      Copy a util from app to addon
  atam validator [validator-name]         Copy a validator from app to addon
  [addon-name]

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]

```

