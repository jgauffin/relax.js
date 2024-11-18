import { FormReader, FormReaderOptions } from './FormReader';

export class FormChangeDetector {
    private reader: FormReader;
    private callback: () => void;

    constructor(private form: HTMLFormElement, options?: FormReaderOptions) {
        this.reader = new FormReader(options ?? {});
    }

    public subscribe(callback: () => void) {
        const inputs = Array.from(this.form.querySelectorAll('input'));
        console.log(inputs);
        inputs.forEach((x) => {
            const type = x.getAttribute('type');
            if (type == 'radio' || type == 'checkbox') {
                console.log('check', x.name);
                x.addEventListener('change', () => this.onChange());
            } else {
                console.log('subcs', x.name)
                x.addEventListener('keypress', () => this.onChange());
            }
        });

        const textareas = Array.from(this.form.querySelectorAll('textarea'));
        textareas.forEach((x) => {
            x.addEventListener('keypress', () => this.onChange());
        });

        const selects = Array.from(this.form.querySelectorAll('select'));
        selects.forEach((x) => {
            x.addEventListener('change', () => this.onChange());
        });

        this.callback = callback;
    }

    private onChange(): void {
        //const target =e.target as HTMLInputElement;
        if (this.callback) {
            console.log('callback');
            this.callback();
        } else if (this.form.reportValidity()) {
            this.reader.read(this.form);
        }
    }

    /*
    private addInputEventListeners() {
        const formElements = Array.from(
            this.form.querySelectorAll('input, textarea, select')
        ) as (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)[];

        formElements.forEach((element) => {
            element.addEventListener('input', this.validateForm.bind(this));
        });
    }

    private removeInputEventListeners() {
        const formElements = Array.from(
            this.form.querySelectorAll('input, textarea, select')
        ) as (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)[];

        formElements.forEach((element) => {
            element.removeEventListener('input', this.validateForm.bind(this));
        });
    }*/
}
