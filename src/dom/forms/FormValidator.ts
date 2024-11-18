function getFieldName(element: HTMLElement): string | null {
    const id = element.getAttribute('id');
    if (id) {
        const label = this.shadowRoot.querySelector(
            `label[for="${id}"]`
        ) as HTMLLabelElement | null;
        if (label) {
            return label.textContent?.trim() || null;
        }
    }

    return null;
}

export interface ValidatorOptions{
    autoValidate?: boolean;
    useSummary?: boolean;
    preventDefault?: boolean;
    submitCallback?: () => void;
}

export class FormValidator {
    constructor(private form: HTMLFormElement, private options?: ValidatorOptions) {
        if (!this.form){
            throw new Error('Form must be specified.');
        }

        console.log('options', options);
        this.form.addEventListener('submit', (event) => {
            if (options.preventDefault){
                event.preventDefault();
            }
            if (this.validateForm()){
                this.options?.submitCallback?.apply(this);
            }
        });

        if (options?.autoValidate) {
            form.addEventListener('input', (/*e: InputEvent*/) => {
                this.validateForm();
            })
        }
    }

    /**
     * 
     * @returns true if default should be prevented.
     */
    public validateForm(): boolean {
        const formElements = Array.from(
            this.form.querySelectorAll('input,textarea,select')
        ) as (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)[];
        let isFormValid = true;

        if (this.options?.useSummary !== true){
            this.form.checkValidity();
            this.form.reportValidity();
            return false;
        }

        const errorMessages: string[] = [];

        formElements.forEach((element) => {
            if (!element.checkValidity()) {
                isFormValid = false;
                const fieldName =
                    getFieldName.call(this, element) ||
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

    // Method to display the error summary
    public displayErrorSummary(messages: string[]) {
        this.clearErrorSummary();

        const errorSummary = document.createElement('div');
        errorSummary.className = 'error-summary';
        errorSummary.style.color = 'red';

        const errorList = document.createElement('ul');
        messages.forEach((message) => {
            const listItem = document.createElement('li');
            listItem.textContent = message;
            errorList.appendChild(listItem);
        });

        errorSummary.appendChild(errorList);
        this.form.insertAdjacentElement('beforebegin', errorSummary); // Insert the error summary above the form
    }

    public clearErrorSummary() {
        const existingSummary = this.form
            .previousElementSibling as HTMLElement | null;
        if (
            existingSummary &&
            existingSummary.classList.contains('error-summary')
        ) {
            existingSummary.remove();
        }
    }

    public static FindForm(element: HTMLElement): HTMLFormElement {
        if (element.parentElement.tagName == 'FORM') {
            return <HTMLFormElement>element.parentElement;
        } else {
            const children = Array.from(element.children);
            children.forEach((child) => {
                if (child.tagName == 'FORM') {
                    return <HTMLFormElement>child;
                }
            });
        }

        throw new Error(
            'Parent or a direct child must be a FORM for class ' +
                element.constructor.name
        );
    }

}
