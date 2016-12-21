/* eslint no-var: 0, no-underscore-dangle: 0, prefer-arrow-callback: 0, prefer-spread: 0, strict: 0 */

(function () {

    'use strict';

    function FeatureFlag(featureName, config, reset) {

        var _this = this;
        var percentNumbers = Array.apply(null, {length: 100}).map(Number.call, Number);
        var i;

        this.feature = featureName;
        this.head = document.querySelector('head');
        this.config = config;
        this.variants = config.variants;
        this.reset = reset;
        this.chosenVariant = null;

        Object.keys(this.variants).forEach(function (item) {

            var variantAmount = _this.variants[item].percent * 100;
            _this.variants[item].percentNumbers = [];

            for (i = 0; i < variantAmount; i++) {
                _this.variants[item].percentNumbers.push(percentNumbers.shift());
            }

        });


        if (this.readStorage() === null) {
            this.chosenVariant = this.setStorage();
        } else {

            this.chosenVariant = this.readStorage();

            if (!this.percentMatches()) {
                this.cleanUp();
                this.chosenVariant = this.setStorage();
            }

        }

        this.style();
        this.script();

    }

    FeatureFlag.prototype.setStorage = function () {

        var _this = this;
        var chosenVariant = {};
        var randomNumber = Math.floor(Math.random() * 100);
        var time = new Date().getTime();

        Object.keys(_this.variants).forEach(function (item) {

            if (_this.variants[item].percentNumbers.indexOf(randomNumber) !== -1) {
                chosenVariant = _this.variants[item];
                chosenVariant.name = item;
                chosenVariant.time = time;
            }

        });

        localStorage.setItem(this.feature, JSON.stringify(chosenVariant));

        return chosenVariant;

    };

    FeatureFlag.prototype.cleanUp = function () {

        Array.from(document.querySelectorAll('[data-feature-flag]')).forEach(item => {
            this.head.removeChild(item);
        });

        return localStorage.removeItem(this.feature);

    };

    FeatureFlag.prototype.percentMatches = function () {
        return this.chosenVariant.percent === this.variants[this.chosenVariant.name].percent;
    };

    FeatureFlag.prototype.readStorage = function () {

        var response;

        try {
            response = JSON.parse(localStorage.getItem(this.feature));
        } catch (e) {
            response = null;
        }

        return JSON.parse(localStorage.getItem(this.feature));

    };

    FeatureFlag.prototype.style = function () {

        var _this = this;
        var styles = this.chosenVariant.css;

        function addStyle(path) {

            var style = document.createElement('link');
            style.setAttribute('rel', 'stylesheet');
            style.setAttribute('href', path);
            style.setAttribute('data-feature-flag', 'true');
            _this.head.appendChild(style);

        }

        if (Array.isArray(styles)) {
            styles.forEach(addStyle);
        } else {
            addStyle(styles);
        }

    };

    FeatureFlag.prototype.script = function () {

        var _this = this;
        var scripts = this.chosenVariant.js;

        function addScript(path) {

            var script = document.createElement('script');
            script.setAttribute('src', path);
            script.setAttribute('data-feature-flag', 'true');
            _this.head.appendChild(script);

        }

        if (Array.isArray(scripts)) {
            scripts.forEach(addScript);
        } else {
            addScript(scripts);
        }

    };

    window.FeatureFlag = FeatureFlag;

})();
