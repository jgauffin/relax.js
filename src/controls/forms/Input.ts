import { DataDistributorMixin } from "../mixins/DataDistributor";

class FormGroupElementBase extends HTMLElement {
    constructor() {
      super();
  
      // Attach a shadow root to the element
      this.attachShadow({ mode: 'open' });
  
      // Build the initial content of the shadow DOM
      this.shadowRoot.innerHTML = `
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
    }
  
    // Called when the element is added to the DOM
    connectedCallback() {
      this._updateFormGroup();
    }

    set data(value: string){
        
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
  

  /**
 * @element rlx-input
 * @attribute {string} custom-attribute - Description of this attribute
 * @attribute {number} another-attribute - Description of another attribute
 */
  const FormGroupElement = DataDistributorMixin(FormGroupElementBase);

  // Define the custom element
  customElements.define('rlx-input', FormGroupElement);
  