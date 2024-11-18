export class CheckboxGroupComponent extends HTMLElement {
    private data: Record<string, unknown> = {};
    private layout: 'inline' | 'block' = 'block'; // Default layout
    private checkedValues: unknown[] = []; // Array to store checked values
    private checkedValuesStr: string[] = []; // Array to store checked values

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // Initial Shadow DOM structure
        this.shadowRoot!.innerHTML = `
        <style>
          :host {
            display: block;
            font-family: var(--font-family, Arial, sans-serif);
            color: var(--text-color, #000);
          }
          .checkbox-group-label {
            font-weight: var(--label-font-weight, bold);
            margin-bottom: var(--label-margin-bottom, 8px);
            display: block;
          }
          .checkbox-items {
            display: flex;
            flex-wrap: wrap;
            gap: var(--checkbox-gap, 8px);
          }
          .checkbox-item {
            display: flex;
            align-items: center;
            margin-bottom: var(--checkbox-margin-bottom, 4px);
          }
          .checkbox-item label {
            margin-left: var(--label-margin-left, 4px);
            font-weight: var(--item-label-font-weight, normal);
          }
          :host([layout="inline"]) .checkbox-items {
            flex-direction: row;
          }
          :host([layout="block"]) .checkbox-items {
            flex-direction: column;
          }
        </style>
        <div>
          <span class="checkbox-group-label"></span>
          <div class="checkbox-items"></div>
        </div>
      `;
    }

    // Method to set data and generate checkboxes
    public setData(data: Record<string, unknown>) {
        this.data = data;
        const itemsContainer = this.shadowRoot!.querySelector(
            '.checkbox-items'
        ) as HTMLDivElement;

        // Clear any existing checkboxes
        itemsContainer.innerHTML = '';

        // Iterate over the items in the data object and create checkboxes
        for (const [itemLabel, isChecked] of Object.entries(data)) {
            // Create a container for each checkbox and label
            const itemContainer = document.createElement('div');
            itemContainer.classList.add('checkbox-item');

            // Create the checkbox input
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked =
                Boolean(isChecked) || this.checkedValues.includes(itemLabel); // Check based on data or checkedValues array
            checkbox.id = itemLabel;

            // Create the label for the checkbox
            const label = document.createElement('label');
            label.htmlFor = itemLabel;
            label.textContent = itemLabel;

            // Append the checkbox and label to the item container
            itemContainer.appendChild(checkbox);
            itemContainer.appendChild(label);

            // Append the item container to the items container
            itemsContainer.appendChild(itemContainer);
        }
    }

    // Method to update checked values
    public setChecked(values: object[]) {
        this.checkedValues = values;
        this.checkedValuesStr = values.map((x) => x.toString());
        this.updateCheckboxes();
    }

    // Update checkboxes based on checkedValues
    private updateCheckboxes() {
        const itemsContainer = this.shadowRoot!.querySelector(
            '.checkbox-items'
        ) as HTMLDivElement;
        const checkboxes = itemsContainer.querySelectorAll(
            'input[type="checkbox"]'
        ) as NodeListOf<HTMLInputElement>;

        checkboxes.forEach((checkbox) => {
            checkbox.checked = this.checkedValuesStr.includes(checkbox.value);
        });
    }

    // Observe changes to the `layout` and `title` attributes
    static get observedAttributes() {
        return ['layout', 'title', 'checked'];
    }

    // Called when an observed attribute is changed
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'layout') {
            this.layout = newValue === 'inline' ? 'inline' : 'block';
            this.updateLayout();
        } else if (name === 'title') {
            this.updateTitle(newValue);
        } else if (name === 'checked') {
            this.updateChecked(newValue);
        }
    }

    // Update the layout of the checkboxes
    private updateLayout() {
        const itemsContainer = this.shadowRoot!.querySelector(
            '.checkbox-items'
        ) as HTMLDivElement;
        if (this.layout === 'inline') {
            itemsContainer.style.flexDirection = 'row';
        } else {
            itemsContainer.style.flexDirection = 'column';
        }
    }

    // Update the title of the checkbox group
    private updateTitle(newTitle: string) {
        const mainLabel = this.shadowRoot!.querySelector(
            '.checkbox-group-label'
        ) as HTMLSpanElement;
        mainLabel.textContent = newTitle || '';
    }

    private updateChecked(newValues: string) {
        if (!newValues || newValues === '') {
            this.checkedValues.length = 0;
            this.checkedValuesStr.length = 0;
        }
        this.checkedValuesStr = newValues.split(',');
        this.updateCheckboxes();
    }
}

// Define the custom element
customElements.define('checkbox-group', CheckboxGroupComponent);
