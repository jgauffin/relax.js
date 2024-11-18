import { AutoRegister } from '../AutoRegister';
import {
    BooleanConverter,
    ConverterFunc,
    createConverterFromDataType,
    DataType
} from './ValueConverter';

@AutoRegister('rlx-input-toggle')
export class CheckboxToggle extends HTMLElement {
    private checkbox: HTMLInputElement;
    private label: HTMLLabelElement;
    private valueConverter: ConverterFunc;
    private static refCounter = 1;
    private nameId: number;

    constructor() {
        super();

        this.nameId = CheckboxToggle.refCounter++;
        const text = this.textContent;
        this.valueConverter = BooleanConverter;
        this.innerHTML = `
        <div class="form-group">
            <div class="checkbox-wrapper">
                <input type="checkbox" name="" id="" />
                <label for="">fffff</span>
            </div>
        </div>
      `;

        this.label = this.querySelector('label');
        this.checkbox = this.querySelector('input');
        this.checkbox.id = this.getAttribute('name') + this.nameId;
        this.label.setAttribute('for', this.getAttribute('name') + this.nameId);
        this.checkbox.name = this.getAttribute('name');
        this.label.textContent = text;
        
        this.dataType = <DataType>this.getAttribute('data-type') || 'boolean';
    }

    private _dataType: string;

    set dataType(value: DataType) {
        this.valueConverter = createConverterFromDataType(value);
    }
    // Method to get data and convert it to specified dataType
    getData(): unknown {
        if (this.checkbox.checked) {
            return false;
        }

        const value = this.checkbox.value;
        return this.valueConverter(value);
    }

    // Method to set data by assigning a value to the checkbox
    setData(data?: unknown) {
        if (!data) {
            this.checkbox.checked = false;
        } else {
            this.checkbox.checked = this.checkbox.value == data.toString();
        }
    }
}
