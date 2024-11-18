import { AutoRegister } from "../AutoRegister";
import { copyInputAttributes } from "./AttributeHelper";

/**
 * 
 */
@AutoRegister('rlx-input-autocomplete')
export class AutocompleteInput extends HTMLElement {
    private input: HTMLInputElement;
    private label: HTMLLabelElement;
    private dataListElement: HTMLDataListElement;
    private mustMatch: boolean;
    private valueMap: Map<string, unknown> = new Map();

    constructor() {
        super();
        const text = this.innerText;
        this.innerHTML = `
        <div class="form-group">
          <label for="__name__"></label>
          <input type="text" name="__name__" />
        </div>
      `;

        this.label = this.querySelector('label');
        this.input = this.querySelector('input');
        this.label.innerText = text;


        this.dataListElement = document.createElement('datalist');
        this.dataListElement.id = this.input.name + '-options';
        this.appendChild(this.dataListElement);

        this.mustMatch = this.hasAttribute('mustMatch');

        copyInputAttributes(this, this.input);
        this.input.setAttribute('list', this.input.name + '-options');

        const selectedValue = this.getAttribute('selectedValue');
        if (selectedValue) {
            this.input.value = selectedValue;
        }

        this.input.addEventListener('blur', () => this.validateInput());
    }

    private validateInput() {
        if (this.mustMatch) {
            const entry = this.valueMap.get(this.input.value);
            if (!entry){
                this.input.setCustomValidity('You must select one of the choices');
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
        this.input.value = data.toString();
    }

    static get observedAttributes() {
        return ['name', 'title', 'selected', 'mustMatch'];
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name in this.input){
            this.input.setAttribute(name, newValue);
            return;
        }

        if (name === 'title') {
            const labelElement = this.querySelector(
                'label'
            ) as HTMLLabelElement;
            labelElement.textContent = newValue;
        } else if (name === 'mustMatch') {
            this.mustMatch = newValue !== null;
        }
    }
}
