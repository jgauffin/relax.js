/* eslint-disable @typescript-eslint/no-explicit-any */
import { assignValue } from "../objects/assignValue";

export interface IFormReader {
    /**
     * Read entire form.
     * 
     * @param elemOrName Form element or element name (either id, form name or relaxed name).
     */
    read(elemOrName: HTMLElement | string): Record<string, unknown>;
}

interface IReaderContext {
    /**
     * Parent HTML element that got a name
     */
    parentElements: HTMLElement[];

    /**
     * Parent object (if this is a child object) through a defined name on a non-form element or through dot notation.
     */
    parents: any[];

    /**
     * Named path to this child object. empty for root object.
     */
    path: string[];

    /**
     * Currently generated object.
     */
    currentObject: any;
}

export interface FormReaderOptions{
    prefix?: string;

    /**
     * Treat value as a number.
     */
    disableBinaryCheckbox?: boolean,

    /**
     * Treat value as a number.
     */
    disableBinaryRadioButton?: boolean
}

/**
 * The form reader are used to read form elements into an object.
 * 
 * For this to work, the name attribute in forms need to follow specific rules.
 * 
 * For instance, the name 
 */
export class FormReader {
    private prefix = 'data';
    constructor(private options?: FormReaderOptions) {
        if (this.options?.prefix){
            this.prefix = options.prefix;
        }
    }

    public read(elemOrName: HTMLElement | string): any {
        let container: HTMLElement;

        if (typeof elemOrName === "string") {
            container = <HTMLElement>document.querySelector(`#${elemOrName},[${this.prefix}-name="${elemOrName}"],[name="${elemOrName}"]`);
            if (!container) {
                throw new Error("Failed to locate '" + elemOrName + "'.");
            }
        } else {
            container = elemOrName;
        }

        const motherObject: any = {};
        for (let i = 0; i < container.childElementCount; i++) {
            this.visitElement({
                currentObject: motherObject,
                path: [],
                parentElements: [],
                parents: []
            }, <HTMLElement>container.children[i])
        }

        return motherObject;
    }

    private visitElement(context: IReaderContext, element: HTMLElement): any {
        let childContext = context;

        let name = this.getNonInputName(element);
        if (name != null) {
            childContext = this.buildNewContextForNonInputName(name, context);
        } else if (this.isInputElement(element)) {

            name = this.getInputName(element);
            if (name) {
                const canRead = this.canRead(element);
                if (canRead) {
                    const value = this.getValue(element);
                    if (value !== null) {
                        assignValue(childContext.currentObject, name, value);
                    }
                    // assignValue(childContext.currentObject, name, value, (obj, value, index) => {
                    //     var inputType = element.getAttribute('type');
                    //     if (inputType == "checkbox"){

                    //     }
                    //     if (element.)
                    // });
                }
            }

            // We ignore children of input types.
            return;
        }

        for (let i = 0; i < element.childElementCount; i++) {
            this.visitElement(childContext, <HTMLElement>element.children[i])
        }

    }

    /**
     * Values should only be read form checkboxes/radio buttons when they have been checked.
     * @param element Element to check
     * @returns 
     */
    private canRead(element: HTMLElement) {
        const inputType = element.getAttribute('type')?.toLowerCase();
        if (inputType == 'checkbox' || inputType == 'radio') {
            return (element.hasAttribute("checked")) || element.hasAttribute("selected");
        }

        return true;
    }

    /**
     * Should build a new context for a child object (dev have defined a wrapping tag)
     * @param name Name to build from. Can contain dot and array notation.
     * @param parentContext Context for the parent object.
     */
    private buildNewContextForNonInputName(name: string, parentContext: IReaderContext): IReaderContext {
        const childContext: IReaderContext = {
            currentObject: parentContext.currentObject,
            parentElements: [...parentContext.parentElements],
            parents: [...parentContext.parents],
            path: [...parentContext.path]
        };

        const nameParts = name.split('.');
        nameParts.forEach(key => {
            if (key.at(-1) !== ']') {
                if (!Object.prototype.hasOwnProperty.call(childContext.currentObject, key)) {
                    childContext.currentObject[key] = {};
                    childContext.parents.push(childContext.currentObject);
                }

                childContext.path.push(`${key}`);
                childContext.currentObject = childContext.currentObject[key];
                return;
            }

            const startSquareBracketPos = key.indexOf('[');
            let arrayIndex = -1;

            // Got an index specified.
            if (startSquareBracketPos < key.length - 2) {
                const indexStr = key.substring(startSquareBracketPos + 1, key.length - 1);
                arrayIndex = +indexStr;
            }

            // Remove []
            key = key.substring(0, startSquareBracketPos);

            // Create array if items havent been appended before.
            if (!Object.prototype.hasOwnProperty.call(childContext.currentObject, key)) {
                childContext.currentObject[key] = [];
                childContext.path.push(`${key}`);
                childContext.parents.push(childContext.currentObject[key]);
            }

            if (arrayIndex == -1) {
                arrayIndex = childContext.currentObject[key].length;
            }

            childContext.path.push(`[${arrayIndex}]`);
            childContext.parents.push(childContext.currentObject[key]);
            childContext.currentObject[key][arrayIndex] = {};
            childContext.currentObject = childContext.currentObject[key][arrayIndex];
        });

        return childContext;
    }

    private getValue(el: HTMLElement): number | string | boolean | null | any[] {
        let valueStr: string | null = '';

        if (el.tagName == 'SELECT') {
            const sel = <HTMLSelectElement>el;
            if (sel.selectedIndex == -1) {
                return null;
            }

            if (el.hasAttribute("multiple")) {
                const allValues = [];
                for (let i = 0; i < el.childElementCount; i++) {
                    const childElement = <HTMLOptionElement>el.children[i];

                    if (childElement.selected) {
                        const value = this.parseValue(childElement.value);
                        allValues.push(value);
                    }
                }

                return allValues;
            }
            else {
                valueStr = sel.options[sel.selectedIndex].value;
            }

        } else if (el.tagName == 'TEXTAREA') {
            valueStr = el.getAttribute("value") || "";
        } else if (el.tagName == 'INPUT') {
            const input = <HTMLInputElement>el;
            const type = input.type;
            if (type == 'checkbox' || type == "radio") {
                if (input.value == 'true'){
                    return input.checked;
                }else if (input.value == 'false'){
                    return input.checked ? false : null;
                }

                valueStr = input.checked || input.hasAttribute("selected") ? input.value : null;
            } else {
                valueStr = input.value;
            }
        }

        if (valueStr == null) {
            return null;
        }

        return this.parseValue(valueStr);
    }

    private parseValue(valueStr: string): number | string | boolean {
        if (!valueStr) {
            throw new Error("not specified");
        }

        if (!isNaN(<any>valueStr) && valueStr[0] != '0') {
            return +valueStr;
        } else if (valueStr.toString().toLowerCase() == 'true') {
            return true;
        } else if (valueStr.toString().toLowerCase() == 'false') {
            return false;
        }

        return valueStr;
    }
    /**
     * Tries to retreive a name from a NON-input element.
     * 
     * These names are used to define child objects for all children of the current HTML element.
     * 
     * The id attribute is not used since it can be defined just to be able to control the HTML.
     * 
     * @param el Element to check for name
     * @returns 
     */
    private getNonInputName(el: HTMLElement): string | null {
        if (this.isInputElement(el)) {
            return null;
        }

        const name = el.getAttribute(`${this.prefix}-name`) || el.getAttribute(`${this.prefix}-collection`);
        return name;
    }

    /**
     * Tries to retreive a name from a HTML input element.
     * 
     * These are names for input elements.
     * 
     * @param el Element to check for name
     * @returns 
     */
    private getInputName(el: HTMLElement): string | null {
        const name = el.getAttribute('name');
        return name;
    }

    private isInputElement(el: HTMLElement): boolean {
        return el.tagName == 'INPUT' || el.tagName == 'SELECT' || el.tagName == 'TEXTAREA';
    }
}