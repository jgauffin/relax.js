

export interface ValidationContext{
     inputType: string;
     dataType?: string;
     addError(message: string);
}

interface Validator {
    validate(value: string, context: ValidationContext);
}


interface ValdatorRegistryEntry{
    validator:  { new (): Validator },
    validInputTypes: string[];
}
const validators: Map<string, ValdatorRegistryEntry> = new Map();

export function RegisterValidator(validationName: string, validInputTypes: string[] = []) {
    return function (target: { new (...args: unknown[]): Validator }) {
        validators.set(validationName, { validator: target, validInputTypes });
    };
}
@RegisterValidator('required')
export class RequiredValidation implements Validator {
    static create(rule: string): RequiredValidation | null {
        return rule === 'required' ? new RequiredValidation() : null;
    }

    validate(value: string, context: ValidationContext) {
        if (value.trim() !== ''){
            return;
        }

        context.addError(this.getMessage());
    }

    getMessage(): string {
        return 'This field is required.';
    }
}

@RegisterValidator('range', ['number'])
export class RangeValidation implements Validator {
    min: number;
    max: number;

    constructor(min: number, max: number) {
        this.min = min;
        this.max = max;
    }

    static create(rule: string): RangeValidation | null {
        const rangeMatch = rule.match(/^range\((\d+)-(\d+)\)$/);
        if (rangeMatch) {
            const [, min, max] = rangeMatch;
            return new RangeValidation(parseInt(min), parseInt(max));
        }
        return null;
    }

    validate(value: string, context: ValidationContext) {
        const num = parseFloat(value);
        if (!isNaN(num) && num >= this.min && num <= this.max){
            return;
        }

        context.addError(this.getMessage(value));
    }

    getMessage(actual: string): string {
        return `Number must be between ${this.min} and ${this.max}, was ${actual}.`;
    }
}

@RegisterValidator('', ['number'])
export class DigitsValidation implements Validator {
    static create(rule: string): DigitsValidation | null {
        return rule === 'digits' ? new DigitsValidation() : null;
    }

    validate(value: string, context: ValidationContext) {
        if (/^\d+$/.test(value)){
            return;
        }

        context.addError(this.getMessage());
    }

    getMessage(): string {
        return 'Please enter only digits.';
    }
}
