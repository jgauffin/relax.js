import { ConverterFunc, createConverter, createConverterFromInputType } from "../forms/ValueConverter";
import { Constructor } from "./Constructor";

interface ElementWithName extends HTMLElement{
    get name():string;
}

/**
 * Distributes data to an element hierarchy as long as they have a "data" property or function.
 * @param Base Class to implement mixin to
 * @returns
 */
export function ValueHandlerMixin<TBase extends Constructor<ElementWithName>>(
    Base: TBase
) {
    return function (...args: never[]) {

        class InnerClass extends Base {
            valueConverter?: ConverterFunc;
            input: HTMLInputElement;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            constructor(...args: any[]) {
                super(...args);
            }
            set data(value: unknown) {
                if (!this.valueConverter) {
                    this.valueConverter = createConverter(value);
                }
                this.input.value = value?.toString() ?? "";
            }

            set dataType(value: string) {
                this.valueConverter = createConverter(value);
            }

            get data(): unknown {
                if (!this.valueConverter) {
                    const type = this.input.getAttribute("type");
                    this.valueConverter = createConverterFromInputType(type);
                }

                if (!this.valueConverter) {
                    throw new Error("A value converter has not been specified for input[name=\"" + this.name + "\"]");
                }

                return this.valueConverter(this.getAttribute("value"));
            }
        }

        return new InnerClass(...args);
    }
}