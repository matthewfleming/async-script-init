# async-script-init

This allows you to include library scripts asynchronously, and provide callbacks that are run once all required libraries are loaded.

This can be used to ensure that a library global will be defined before dependant code is run.

## Demo
```sh
yarn build && yarn start
```

## Test

```sh
yarn test
```

## Usage

Configure the scripts and callback handlers

```ts
// Define alias for the scripts
type Sources = 'slow1' | 'slow2' | 'fast1' | 'fast2'

export const asyncScriptConfig: AsyncScriptConfig<Sources> = {
    // Script sources
    scripts: {
        gapi: 'https://apis.google.com/js/platform.js',
        otherlib: 'https://some.other/lib.js'

    },
    // Add handlers that will run once the scripts are loaded
    handlers: [
        {
            requires: ['gapi'],
            callback: () => {
                // platform.js is loaded so gapi is defined
                console.log(gapi)
            }
        },
        {
            requires: ['gapi', 'otherlib'],
            callback:  () => {
                // platform.js and lib.js are both loaded
            }
        },
    ]
}
```

Generate the script includes for the document render (add to head)
```ts
const initialiser = getIncludes(libraryConfig)
//<script async src="https://apis.google.com/js/platform.js" onload="asyncScriptHandler('gapi')"><script async src="https://some.other/lib.js" onload="asyncScriptHandler('otherlib')">
```

Initialise the handlers in your client 
```ts
init(asyncInitHandlers)
```

```js
// TBC
const df = require('async-script-init')
```
