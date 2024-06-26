/**
 * Methods used to simplify working with elements in a HTML document.
 */
export class ElementUtils {
    constructor(private elementPrefix: string = 'data') {}

    /**
     * Remove all children.
     * @param n Node to remove children for. Expected to be a HTMLElement
     */
    removeChildren(n: Node) {
        if (!n) {
            throw new Error(`Element not set: ${n}`);
        }
        while (n.firstChild) {
            n.removeChild(n.firstChild);
        }
    }

    /**
     * Move all children from one node to another (will ).
     * @param source Element to remove children from.
     * @param target Element to add all children to.
     */
    moveChildren(source: HTMLElement, target: HTMLElement) {
        while (source.firstChild) {
            target.appendChild(source.firstChild);
        }

        if (source.parentElement) {
            source.parentElement.removeChild(source);
        } else {
            source.remove();
        }
    }

    /**
     * Get a identifier (either an ID, Name, or a prefixed name attribute).
     * @param e Element to find id on
     * @returns Name.
     */
    getIdentifier(e: HTMLElement): string {
        if (e.id) return e.id;

        let name = e.getAttribute('name');
        if (name != null) return name;

        name = e.getAttribute(`${this.elementPrefix}-name`);
        if (name != null) return name;

        let attrs = '';
        for (let i = 0; i < e.attributes.length; i++) {
            attrs = `${attrs + e.attributes[i].name}=${e.attributes[i].value},`;
        }

        return `${e.tagName}[${attrs.substr(0, attrs.length - 1)}]`;
    }

    /**
     * Is the element a form field? (input, select or textarea)
     * @param e Element to check
     * @returns true if it's a form field.
     */
    isFormField(e: HTMLElement): boolean {
        const tagName = e.tagName;
        return (
            tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA'
        );
    }

    /**
     * Get data type (type attribute on input fields and 'data-type' for all others).
     *
     * Type is specified when attributes are bound using prefixes.
     *
     * @param e Element to get type for
     * @param attributeName Specified when it's the attribute that should be used.
     * @returns
     */
    getDataType(e: HTMLElement): string | null {
        if (this.isFormField(e)) {
            return e.getAttribute('type');
        } else {
            return e.getAttribute('data-type');
        }
    }

    /**
     * Get data type (type attribute on input fields and 'data-type' for all others).
     *
     * Type is specified when attributes are bound using prefixes.
     *
     * @param e Element to get type for
     * @returns
     */
    setDataType(e: HTMLElement, typeName: string): void {
        if (this.isFormField(e)) {
            e.setAttribute('type', typeName);
        } else {
            e.setAttribute('data-type', typeName);
        }
    }
}
