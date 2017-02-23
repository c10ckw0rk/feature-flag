# Feature Flagons

A small library for ab testing based on a random number percentage.

`npm install feature-flagons`


## usage

```javascript
import AutoComplete from 'feature-flagons';

    new FF('test-feature', {
        variants: {
            default: {
                css: '/base/test/mocks/default.css',
                js: '/base/test/mocks/default.js',
                percent: 0.1
            },
            one: {
                css: '/base/test/mocks/one.css',
                js: '/base/test/mocks/one.js',
                percent: 0.4
            },
            two: {
                css: '/base/test/mocks/two.css',
                js: '/base/test/mocks/two.js',
                percent: 0.4
            }
        },
        condition: true, // (optional) condition on whether to execute.
        force: 'one' // overrides the percentage and foces this variant to load.
    }
```


