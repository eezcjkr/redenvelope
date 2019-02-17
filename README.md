## Install

`yarn`

## Run locally

```
yarn start
```

This will use config from `presets/localnet/config.json`

## Build params (env variables) 

- `CONFIG` - name of config preset. Possible values: `localnet` (default), `testnet`, `mainnet`.

## Deployment

Testnet:
```
CONFIG=testnet yarn build
yarn deploy:testnet
```

Mainnet:
```
CONFIG=mainnet yarn build
yarn deploy:mainnet
```
