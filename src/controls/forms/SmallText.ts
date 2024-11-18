import { AutoRegister } from '../AutoRegister';
import { copyInputAttributes } from './AttributeHelper';

@AutoRegister('rlx-input-stext')
export class FormSmallText extends HTMLElement {
    private input: HTMLTextAreaElement;

    constructor() {
        super();
        const labelStr = this.innerText;
        this.innerHTML = `
        <div class="form-group">
          <label part="form-label" for="__name__"></label>
          <textarea part="form-input" name="__name__" rows="3"></textarea>
        </div>
      `;
        this.input = this.querySelector('textarea');
        const label = this.querySelector('label');
        label.innerText = labelStr;
        label.setAttribute('for', this.name);
        copyInputAttributes(this, this.input);
    }

    // Called when the element is added to the DOM
    connectedCallback() {
        this._updateFormGroup();
    }

    get name(): string {
        return this.getAttribute('name');
    }

    set data(value: unknown) {
        this.input.value = value?.toString() ?? '';
    }

    get data(): unknown {
        return this.getAttribute('value');
    }

    static get observedAttributes() {
        return ['name', 'title', 'type', 'value', 'dataType',  "required",
            "minlength",
            "maxlength",
            "pattern",
            "readonly",
            "disabled"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this._updateFormGroup();
        }
    }

    _updateFormGroup() {
        if (this.title){
            this.querySelector('label').innerText = this.title;
        }
        
        copyInputAttributes(this, this.input);
    }
}
