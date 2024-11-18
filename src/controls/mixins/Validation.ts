import { FormValidator } from '../../dom/forms/FormValidator';
import { Constructor } from './Constructor';

export function ValidationMixin<TBase extends Constructor<HTMLElement>>(
    Base: TBase
): TBase {
    return class extends Base {
        private validator: FormValidator;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(...args: any[]) {
            super(...args);

            let form: HTMLFormElement | undefined;
            if (this.parentElement.tagName == 'FORM') {
                form = <HTMLFormElement>this.parentElement;
            } else {
                const children = Array.from(this.children);
                children.forEach((child) => {
                    if (child.tagName == 'FORM') {
                        form = <HTMLFormElement>child;
                    }

                    if (!form) {
                        throw new Error(
                            'Parent or a direct child must be a FORM for class ' +
                                Base.name
                        );
                    }
                });
            }

            console.log('mixin');
            this.validator =  new FormValidator(form, {autoValidate: this.hasAttribute('autovalidate')});
        }

        public validateForm(): boolean {
            return this.validator.validateForm();
        }
    };
}

// function ValidationMixin<T extends Constructor<HTMLElement>>(Base: T) {
//     return class extends Base {
//         private validationRules: ValidationInterface[] = [];

//         constructor(...args: any[]) {
//             super(...args);
//         }

//         connectedCallback() {
//             super.connectedCallback && super.connectedCallback();

//             // Parse validations attribute and set up validation rules
//             this.parseValidations();
//             this.attachValidationEvents();
//         }

//         private parseValidations() {
//             const validations = this.getAttribute('validations');
//             if (!validations) return;

//             const rules = validations.split(',').map(rule => rule.trim());

//             // Attempt to create each validation for each rule
//             rules.forEach(rule => {
//                 registeredValidations.forEach(ValidationClass => {
//                     const validationInstance = ValidationClass.create(rule);
//                     if (validationInstance) {
//                         this.validationRules.push(validationInstance);
//                     }
//                 });
//             });
//         }

//         private attachValidationEvents() {
//             this.addEventListener('input', this.validate.bind(this));
//             this.addEventListener('change', this.validate.bind(this));
//         }

//         private validate() {
//             let validationMessage = '';

//             for (const rule of this.validationRules) {
//                 const isValid = rule.validate((<HTMLInputElement>this).value);
//                 if (!isValid) {
//                     validationMessage = rule.getMessage();
//                     break; // Stop at the first validation failure
//                 }
//             }

//             (<HTMLInputElement>this).setCustomValidity(validationMessage);
//             (<HTMLInputElement>this).reportValidity();
//         }
//     };
// }
