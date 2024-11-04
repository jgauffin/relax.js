import { FormReader, FormReaderOptions } from './FormReader';

export class FormChangeDetector {
    private reader: FormReader;

    constructor(private form: HTMLFormElement, options?: FormReaderOptions) {
        this.subscribe();
        this.reader = new FormReader(options ?? {});
    }

    private subscribe() {
        const inputs = Array.from(this.form.querySelectorAll('input'));
        inputs.forEach((x) => {
            const type = x.getAttribute('type');
            if (type == 'radio' || type == 'checkbox') {
                x.addEventListener('change', () => this.onChange());
            } else {
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
    }

    private onChange(): void {
        //const target =e.target as HTMLInputElement;
        if (this.form.reportValidity()) {
            this.reader.read(this.form);
        }
    }
}
