import { AutoRegister } from "../AutoRegister";
import { ConverterFunc, createConverter, createConverterFromInputType } from "./ValueConverter";

@AutoRegister('rlx-input')
export class FormInputElement extends HTMLElement {
  private input: HTMLInputElement;
  private valueConverter?: ConverterFunc;

  constructor() {
    super();

    this.innerHTML = `
        <style>
          :host {
            display: block;
          }
          .form-group {
            display: flex;
            flex-direction: column;
            margin-bottom: var(--form-group-margin-bottom, 1em);
          }
          label::part(form-label) {
            font-weight: var(--form-label-font-weight, bold);
            margin-bottom: var(--form-label-margin-bottom, 0.5em);
          }
          input::part(form-input) {
            padding: var(--form-input-padding, 0.5em);
            border: var(--form-input-border, 1px solid #ccc);
            border-radius: var(--form-input-border-radius, 4px);
          }
        </style>
        <div class="form-group">
          <label part="form-label" id="form-label"></label>
          <input part="form-input" id="form-input" />
        </div>
      `;
    this.input = this.querySelector('input');
  }

  // Called when the element is added to the DOM
  connectedCallback() {
    this._updateFormGroup();
  }

  get name(): string {
    return this.getAttribute("name");
  }

  set data(value: unknown) {
    if (!this.valueConverter) {
      this.valueConverter = createConverter(value);
    }
    this.input.value = value?.toString() ?? "";
  }

  set dataType(value: string) {
    this.valueConverter = createConverter(value);
  }

  get data(): unknown {
    if (!this.valueConverter) {
      const type = this.input.getAttribute("type");
      this.valueConverter = createConverterFromInputType(type);
    }

    if (!this.valueConverter) {
      throw new Error("A value converter has not been specified for input[name=\"" + this.name + "\"]");
    }

    return this.valueConverter(this.getAttribute("value"));
  }


  // Observed attributes for the custom element
  static get observedAttributes() {
    return ['name', 'title', 'type', 'value'];
  }

  // Handle attribute changes
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this._updateFormGroup();
    }

  }

  // Update the form group based on the current attributes
  _updateFormGroup() {
    const label = this.shadowRoot.querySelector('#form-label');
    const input = this.shadowRoot.querySelector('#form-input');

    // Set label text from the 'title' attribute
    label.textContent = this.getAttribute('title') || 'Label';

    // Set input attributes from 'name', 'type', and 'value' attributes
    input.setAttribute('name', this.getAttribute('name') || '');
    input.setAttribute('type', this.getAttribute('type') || 'text');
    input.setAttribute('value', this.getAttribute('value') || '');
  }
}