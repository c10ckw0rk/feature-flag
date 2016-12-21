
export default class FeatureFlagons {

    constructor(featureName, config) {

        const percentNumbers = Array(...{length: 100}).map(Number.call, Number);
        let i;

        this.feature = featureName;
        this.head = document.querySelector('head');
        this.config = config;
        this.variants = config.variants;
        this.chosenVariant = null;

        Object.keys(this.variants).forEach((item) => {

            const variantAmount = this.variants[item].percent * 100;
            this.variants[item].percentNumbers = [];

            for (i = 0; i < variantAmount; i++) {
                this.variants[item].percentNumbers.push(percentNumbers.shift());
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

    setStorage() {

        let chosenVariant = {};
        const randomNumber = Math.floor(Math.random() * 100);
        const time = new Date().getTime();

        Object.keys(this.variants).forEach((item) => {

            if (this.variants[item].percentNumbers.indexOf(randomNumber) !== -1) {
                chosenVariant = this.variants[item];
                chosenVariant.name = item;
                chosenVariant.time = time;
            }

        });

        localStorage.setItem(this.feature, JSON.stringify(chosenVariant));

        return chosenVariant;

    }

    cleanUp() {

        Array.from(document.querySelectorAll('[data-feature-flag]')).forEach(item => {
            this.head.removeChild(item);
        });

        return localStorage.removeItem(this.feature);

    }

    percentMatches() {
        return this.chosenVariant.percent === this.variants[this.chosenVariant.name].percent;
    }

    readStorage() {

        let response;

        try {
            response = JSON.parse(localStorage.getItem(this.feature));
        } catch (e) {
            response = null;
        }

        return response;

    }

    style() {

        const styles = this.chosenVariant.css;

        const addStyle = path => {

            const style = document.createElement('link');
            style.setAttribute('rel', 'stylesheet');
            style.setAttribute('href', path);
            style.setAttribute('data-feature-flag', 'true');
            this.head.appendChild(style);

        }

        if (Array.isArray(styles)) {
            styles.forEach(addStyle);
        } else {
            addStyle(styles);
        }

    }

    script() {

        const scripts = this.chosenVariant.js;

        const addScript = path => {

            const script = document.createElement('script');
            script.setAttribute('src', path);
            script.setAttribute('data-feature-flag', 'true');
            this.head.appendChild(script);

        }

        if (Array.isArray(scripts)) {
            scripts.forEach(addScript);
        } else {
            addScript(scripts);
        }

    }

}
