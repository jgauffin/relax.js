class AutocompleteInput extends HTMLElement {
    private inputElement: HTMLInputElement;
    private dataListElement: HTMLDataListElement;
    private mustMatch: boolean;
    private valueMap: Map<string, unknown> = new Map();

    constructor() {
        super();

        const labelElement = document.createElement('label');
        labelElement.textContent = this.getAttribute('title') || 'Enter text:';
        labelElement.htmlFor = 'autocomplete-input';
        this.appendChild(labelElement);

        this.inputElement = document.createElement('input');
        this.inputElement.type = 'text';
        this.inputElement.id = 'autocomplete-input';
        this.inputElement.name = this.getAttribute('name') || 'input';
        this.inputElement.setAttribute('list', 'autocomplete-options');
        this.appendChild(this.inputElement);

        this.dataListElement = document.createElement('datalist');
        this.dataListElement.id = 'autocomplete-options';
        this.appendChild(this.dataListElement);

        this.mustMatch = this.hasAttribute('mustMatch');

        const selectedValue = this.getAttribute('selectedValue');
        if (selectedValue) {
            this.inputElement.value = selectedValue;
        }

        this.inputElement.addEventListener('blur', () => this.validateInput());
    }

    private validateInput() {
        if (this.mustMatch) {
            const entry = this.valueMap.get(this.inputElement.value);
            if (!entry){
                this.inputElement.setCustomValidity('You must select one of the choices');
            }
        }
    }

    public setData(data: unknown, options: unknown[]) {
        this.dataListElement.innerHTML = '';

        options.forEach((item) => {
            const option = document.createElement('option');
            option.value = item.toString();
            this.valueMap.set(option.value, item);
            this.dataListElement.appendChild(option);
        });
        this.inputElement.value = data.toString();
    }

    static get observedAttributes() {
        return ['name', 'title', 'selected', 'mustMatch'];
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'name') {
            this.inputElement.name = newValue;
        } else if (name === 'title') {
            const labelElement = this.querySelector(
                'label'
            ) as HTMLLabelElement;
            labelElement.textContent = newValue;
        } else if (name === 'selected') {
            this.inputElement.value = newValue;
        } else if (name === 'mustMatch') {
            this.mustMatch = newValue !== null;
        }
    }
}

customElements.define('rlx-form-text', AutocompleteInput);
