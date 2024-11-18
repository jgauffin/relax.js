import { AutoRegister } from '../AutoRegister';
import { copyInputAttributes } from './AttributeHelper';
import {
    ConverterFunc,
    createConverterFromValue
} from './ValueConverter';

@AutoRegister('rlx-input')
export class FormInputElement extends HTMLElement {
    private input: HTMLInputElement;
    private valueConverter?: ConverterFunc;

    constructor() {
        super();
        this.title = this.innerText;
        this.innerHTML = `
        <div class="form-group">
          <label for="__name__"></label>
          <input name="__name__" />
        </div>
      `;
        this.input = this.querySelector('input');
        const label = this.querySelector('label');
        label.innerText = this.title;
        copyInputAttributes(this, this.input);
        label.setAttribute('for', this.name);
    }

    // Called when the element is added to the DOM
    connectedCallback() {
        this._updateFormGroup();
    }

    get name(): string {
        return this.getAttribute('name');
    }

    set data(value: unknown) {
        if (!this.valueConverter) {
            this.valueConverter = createConverterFromValue(value);
        }
        this.input.value = value?.toString() ?? '';
    }

    set dataType(value: string) {
        this.valueConverter = createConverterFromValue(value);
    }

    get data(): unknown {
        if (!this.valueConverter) {
            throw new Error(
                'Set dataType attribute for input[name="' +
                    this.name +
                    '"]'
            );
        }

        return this.valueConverter(this.getAttribute('value'));
    }

    // Observed attributes for the custom element
    static get observedAttributes() {
        return ['name', 'title', 'type', 'value', 'dataType'];
    }

    // Handle attribute changes
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this._updateFormGroup();
        }
    }

    // Update the form group based on the current attributes
    _updateFormGroup() {
        if (copyInputAttributes(this, this.input)) {
            return;
        }

        const label = this.querySelector('label');
        label.textContent = this.getAttribute('title') || this.title;
    }
}
