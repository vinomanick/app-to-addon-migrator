# app-to-addon-migrator
An opinionated cli tool to migrate Ember components from app to addons within a Yarn workspace.

*NOTE:* This cli tool works only with the following conventional folder structure for your Ember app.

```
|-app
|-packages
|-|-addons
|-|-engines
|-|-|-dashboards-engine
|-|-|-tickets-engine

```

## Install
```
npm i -g app-to-addon-migrator
```

## Usage
```
atam [entity] [source-folder] [entity-name] [dest-folder]
atam route dashboards default packages/engines/dashboards-engine
```


