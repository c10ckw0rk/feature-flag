/* global it, describe, expect, beforeEach, $, Cookies, FeatureFlagons, beforeAll, afterEach */

const FF = FeatureFlagons.default;

describe('Feature Flag loads different css and js files', () => {

    beforeEach(() => {

        window.featureFlag = new FF('test-feature', {
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

        window.featureFlag.start();

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

            window.featureFlag = new FF('test-feature', {
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

            window.featureFlag.start();

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

        window.featureFlag = new FF('test-feature', {
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

        window.featureFlag.start();

        const afterPath = window.featureFlag.readStorage().css;

        expect(beforePath).not.toBe(afterPath);

    });

    it('if percentage changes it only pulls from the listed pool', () => {

        const test = () => {

            window.featureFlag.cleanUp();

            window.featureFlag = new FF('test-feature', {
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
                    }
                }
            });

            window.featureFlag.setStorage('one');

            window.featureFlag = new FF('test-feature', {
                variants: {
                    default: {
                        css: '/base/test/mocks/default.css',
                        js: '/base/test/mocks/default.js',
                        percent: 1
                    },
                    one: {
                        css: '/base/test/mocks/one.css',
                        js: '/base/test/mocks/one.js',
                        percent: 0
                    }
                },
                pullFrom: ['default']
            });

            window.featureFlag.start();

            return window.featureFlag.readStorage().name === 'one';

        };

        expect(test()).toBe(true);

    });

    it('if condition is false styles and javascript are not added', () => {

        window.featureFlag.cleanUp();

        window.featureFlag = new FF('test-feature', {
            variants: {
                default: {
                    css: '/base/test/mocks/default.css',
                    js: '/base/test/mocks/default.js',
                    percent: 1
                },
                one: {
                    css: '/base/test/mocks/one.css',
                    js: '/base/test/mocks/one.js',
                    percent: 0
                }
            },
            pullFrom: ['default'],
            condition: false
        });

        window.featureFlag.start();

        expect(document.querySelector('link[data-feature-flag]')).toBeNull();

    });

    it('if the function condition is false styles and javascript are not added', () => {

        window.featureFlag.cleanUp();

        window.featureFlag = new FF('test-feature', {
            variants: {
                default: {
                    css: '/base/test/mocks/default.css',
                    js: '/base/test/mocks/default.js',
                    percent: 1
                },
                one: {
                    css: '/base/test/mocks/one.css',
                    js: '/base/test/mocks/one.js',
                    percent: 0
                }
            },
            pullFrom: ['default'],
            condition: () => {
                return false;
            }
        });

        window.featureFlag.start();

        expect(document.querySelector('link[data-feature-flag]')).toBeNull();

    });

    it('if the function condition is true styles and javascript are added', () => {

        window.featureFlag.cleanUp();

        window.featureFlag = new FF('test-feature', {
            variants: {
                default: {
                    css: '/base/test/mocks/default.css',
                    js: '/base/test/mocks/default.js',
                    percent: 1
                },
                one: {
                    css: '/base/test/mocks/one.css',
                    js: '/base/test/mocks/one.js',
                    percent: 0
                }
            },
            pullFrom: ['default'],
            condition: () => {
                return true;
            }
        });

        window.featureFlag.start();

        expect(document.querySelector('link[data-feature-flag]')).not.toBeNull();

    });

    it('if the condition is true styles and javascript are added', () => {

        window.featureFlag.cleanUp();

        window.featureFlag = new FF('test-feature', {
            variants: {
                default: {
                    css: '/base/test/mocks/default.css',
                    js: '/base/test/mocks/default.js',
                    percent: 1
                },
                one: {
                    css: '/base/test/mocks/one.css',
                    js: '/base/test/mocks/one.js',
                    percent: 0
                }
            },
            pullFrom: ['default'],
            condition: true
        });

        window.featureFlag.start();

        expect(document.querySelector('link[data-feature-flag]')).not.toBeNull();

    });

});
