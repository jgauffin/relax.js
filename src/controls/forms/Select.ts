/*
Example usage:

 <rlx-form-select name="my-select" title="Choose an option:">
    <option value="value1">Option 1</option>
    <option value="42">Option 2</option>
    <option>Option 3</option>
  </rlx-form-select>


*/

/**
 * 
 */

class FormGroupSelect extends HTMLElement {
    private selectElement: HTMLSelectElement;
    private valueMap: Map<string, unknown>;
  
    constructor() {
      super();
      this.valueMap = new Map();
  
      const labelElement = document.createElement('label');
      labelElement.id = 'label';
      labelElement.textContent = this.getAttribute('title') || 'Select an option:';
      this.appendChild(labelElement);
  
      this.selectElement = document.createElement('select');
      this.selectElement.id = 'select';
      this.appendChild(this.selectElement);
  
      const selectedValue = this.getAttribute('selected');
      if (selectedValue) {
        this.selectElement.value = selectedValue;
      }
  
      this.loadOptionsFromChildren();
    }
  
    private loadOptionsFromChildren() {
      const optionElements = Array.from(this.querySelectorAll('option'));
      if (optionElements.length > 0) {
        const data: Record<string, unknown> = {};
        optionElements.forEach(option => {
          const title = option.textContent || '';
          const value = option.getAttribute('value') || title;
          data[title] = value;
          option.remove();
        });
        this.setData(data);
      }
    }
  
    public setData(data: Record<string, unknown>) {
      this.selectElement.innerHTML = '';
      this.valueMap.clear();
  
      Object.entries(data).forEach(([title, realValue]) => {
        const stringValue = String(title);
        this.valueMap.set(stringValue, realValue);
  
        const option = document.createElement('option');
        option.textContent = title;
        option.value = stringValue;
        this.selectElement.appendChild(option);
      });
  
      const selectedValue = this.getAttribute('selected');
      if (selectedValue) {
        this.selectElement.value = selectedValue;
        
      }
    }

    public getData(): unknown{
        return this.valueMap.get(this.selectElement.value);  
    }
  
    get value(): string {
      return this.selectElement.value;
    }
  
    set value(newValue: unknown) {
        this.valueMap.set(newValue.toString(), newValue);
      this.selectElement.value = newValue.toString();
    }
  
    static get observedAttributes() {
      return ['name', 'title', 'selected'];
    }
  
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      if (name === 'title') {
        const labelElement = this.querySelector('#label') as HTMLLabelElement;
        labelElement.textContent = newValue;
      } else if (name === 'selected') {
        this.value = newValue;
      }
    }
  }
  
  customElements.define('rlx-form-select', FormGroupSelect);
  