class ShadowValidatedForm extends HTMLFormElement {
    private summary = document.createElement('div');

    constructor() {
        super();
        this.summary.className  ="error-summary";
        this.summary.setAttribute("style", "color: red; display: none;");
        this.appendChild(this.summary);

        this.addEventListener('submit', (event) =>
            this.handleFormSubmit(event)
        );
    }

    private handleFormSubmit(event: Event) {
        if (!this.validateForm()) {
            event.preventDefault(); // Prevent form submission if validation fails
        }
    }

    public setAutoValidate(enable: boolean) {
        this.autoValidate = enable;

        // If auto-validation is enabled, add input event listeners
        if (this.autoValidate) {
            this.addInputEventListeners();
        } else {
            this.removeInputEventListeners();
        }
    }

    public validateForm(): boolean {
        const formElements = Array.from(
            this.querySelectorAll('input, textarea, select')
        ) as (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)[];
        let isFormValid = true;
        const errorMessages: string[] = [];

        formElements.forEach((element) => {
            if (!element.checkValidity()) {
                isFormValid = false;
                const fieldName =
                    this.getFieldName(element) ||
                    element.name ||
                    'Unnamed Field';
                errorMessages.push(
                    `${fieldName}: ${element.validationMessage}`
                );
            }
        });

        if (!isFormValid) {
            this.displayErrorSummary(errorMessages);
        } else {
            this.clearErrorSummary();
        }

        return isFormValid;
    }

    private getFieldName(element: HTMLElement): string | null {
        const id = element.getAttribute('id');
        if (id) {
            const label = this.querySelector(
                `label[for="${id}"]`
            ) as HTMLLabelElement | null;
            return label ? label.textContent?.trim() || null : null;
        }
        return null;
    }

    private displayErrorSummary(messages: string[]) {
        const errorSummary = this.querySelector(
            '.error-summary'
        ) as HTMLElement;
        errorSummary.style.display = 'block';
        errorSummary.innerHTML = ''; // Clear previous error messages

        const errorList = document.createElement('ul');
        messages.forEach((message) => {
            const listItem = document.createElement('li');
            listItem.textContent = message;
            errorList.appendChild(listItem);
        });

        errorSummary.appendChild(errorList);
    }

    private clearErrorSummary() {
        const errorSummary = this.querySelector(
            '.error-summary'
        ) as HTMLElement;
        errorSummary.style.display = 'none';
        errorSummary.innerHTML = ''; // Clear error messages
    }

    private addInputEventListeners() {
        const formElements = Array.from(
            this.querySelectorAll('input, textarea, select')
        ) as (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)[];

        formElements.forEach((element) => {
            element.addEventListener('input', this.validateForm.bind(this));
        });
    }

    private removeInputEventListeners() {
        const formElements = Array.from(
            this.querySelectorAll('input, textarea, select')
        ) as (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)[];

        formElements.forEach((element) => {
            element.removeEventListener('input', this.validateForm.bind(this));
        });
    }
}

// Define the custom form element
customElements.define('rlx-form', ShadowValidatedForm, {
    extends: 'form'
});
