/* global it, describe, expect, beforeEach, $, Cookies, FeatureFlag, beforeAll, afterEach */

describe('Feature Flag loads different css and js files', () => {

    beforeEach(() => {

        window.featureFlag = new FeatureFlag('test-feature', {
            variants: {
                default: {
                    css: '/base/test/mocks/default.css',
                    js: '/base/test/mocks/default.js',
                    percent: 0.5
                },
                one: {
                    css: '/base/test/mocks/one.css',
                    js: '/base/test/mocks/one.js',
                    percent: 0.5
                },
                two: {
                    css: '/base/test/mocks/two.css',
                    js: '/base/test/mocks/two.js',
                    percent: 0
                }
            }
        });

    });

    afterEach(() => {

        window.featureFlag.cleanUp();
        window.featureFlag = undefined;

    });

    it('It adds a localStorage paramater to the page', () => {
        expect(localStorage.getItem('test-feature')).not.toBeUndefined();
    });

    it('It adds a js file to the page', () => {

        const element = document.querySelector('script[data-feature-flag]');
        expect(element).not.toBeNull();
    });

    it('It adds a css file to the page', () => {

        const element = document.querySelector('link[data-feature-flag]');
        expect(element).not.toBeNull();
    });

    it('It returns a json value when reading storage', () => {

        const storageVal = window.featureFlag.readStorage();
        expect(storageVal.constructor).toBe(Object);

    });

    it('If storage is set it does not reset storage', done => {

        setTimeout(() => {

            window.featureFlag = new FeatureFlag('test-feature', {
                variants: {
                    default: {
                        css: '/base/test/mocks/default.css',
                        js: '/base/test/mocks/default.js',
                        percent: 0.5
                    },
                    one: {
                        css: '/base/test/mocks/one.css',
                        js: '/base/test/mocks/one.js',
                        percent: 0.5
                    },
                    two: {
                        css: '/base/test/mocks/two.css',
                        js: '/base/test/mocks/two.js',
                        percent: 0
                    }
                }
            });

            const date = new Date(window.featureFlag.readStorage().time).getSeconds();
            const date2 = new Date().getSeconds();

            expect(date).not.toBe(date2);
            done();

        }, 1000);

    });

    it('The css file path matches the feature path', () => {

        const path = window.featureFlag.readStorage().css;
        const src = document.querySelector('link[data-feature-flag]').getAttribute('href');

        expect(src === path).toBe(true);
    });

    it('The js path name matches the feature path', () => {

        const path = window.featureFlag.readStorage().js;
        const src = document.querySelector('script[data-feature-flag]').getAttribute('src');

        expect(src === path).toBe(true);
    });

    it('Clears the feature from localStorage', () => {

        window.featureFlag.cleanUp();
        expect(localStorage.getItem('test-feature')).toBe(null);

    });

    it('Only clears the cookie if the percentage changes', () => {

        const beforePath = window.featureFlag.readStorage().css;

        window.featureFlag = new FeatureFlag('test-feature', {
            variants: {
                default: {
                    css: '/base/test/mocks/default.css',
                    js: '/base/test/mocks/default.js',
                    percent: 0
                },
                one: {
                    css: '/base/test/mocks/one.css',
                    js: '/base/test/mocks/one.js',
                    percent: 0
                },
                two: {
                    css: '/base/test/mocks/two.css',
                    js: '/base/test/mocks/two.js',
                    percent: 1.0
                }
            }
        });

        const afterPath = window.featureFlag.readStorage().css;

        expect(beforePath).not.toBe(afterPath);

    });

});
