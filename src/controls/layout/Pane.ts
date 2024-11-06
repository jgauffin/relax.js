import { AutoRegister } from "../AutoRegister";

@AutoRegister('rlx-pane')
export class Pane extends HTMLDivElement {
    private titleElement: HTMLHeadingElement;
    private bodyContainer: HTMLDivElement;

    constructor() {
        super();
        this.titleElement = document.createElement('h2');
        this.bodyContainer = document.createElement('div');
        this.attachShadow({ mode: 'open' });

        // Style and structure the component
        const style = document.createElement('style');
        style.textContent = `
            h2 {
                font-size: 1.5em;
                margin: 0.5em 0;
            }
            div.body-container {
                padding: 1em;
                border-top: 1px solid #ccc;
            }
        `;

        this.shadowRoot!.appendChild(style);
        this.shadowRoot!.appendChild(this.titleElement);
        this.shadowRoot!.appendChild(this.bodyContainer);
    }

    static get observedAttributes() {
        return ['title'];
    }

    attributeChangedCallback(
        name: string,
        _: string | null,
        newValue: string | null
    ) {
        if (name === 'title' && newValue !== null) {
            this.titleElement.textContent = newValue;
        }
    }

    connectedCallback() {
        // Move all child elements to the body container
        Array.from(this.children).forEach((child) => {
            this.bodyContainer.appendChild(child);
        });
    }
}
