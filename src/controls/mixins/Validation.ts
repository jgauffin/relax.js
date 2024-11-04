import { Constructor } from './Constructor';

export function ValidationMixin<TBase extends Constructor<HTMLFormElement>>(
    Base: TBase
) {
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

    return class extends Base {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(...args: any[]) {
            super(...args);

            this.addEventListener('submit', (event) => {
                if (!this.validateForm()) {
                    event.preventDefault();
                }
            });
        }

        public validateForm(): boolean {
            const formElements = Array.from(this.shadowRoot.querySelectorAll('input,textarea,select')) as (
                | HTMLInputElement
                | HTMLTextAreaElement
                | HTMLSelectElement
            )[];
            let isFormValid = true;
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
            this.insertAdjacentElement('beforebegin', errorSummary); // Insert the error summary above the form
        }

        public clearErrorSummary() {
            const existingSummary = this
                .previousElementSibling as HTMLElement | null;
            if (
                existingSummary &&
                existingSummary.classList.contains('error-summary')
            ) {
                existingSummary.remove();
            }
        }
    };
}
