import { AutoRegister } from "../AutoRegister";

@Signal
export class OpenDialog{
    constructor(name: string){}
}

export class 
@AutoRegister('rlx-dialog')
export class RelaxDialog extends HTMLElement {
    private dialog: HTMLDialogElement;
    private overlay: HTMLDivElement;

    constructor() {
        super();

        // Create shadow DOM
        const shadow = this.attachShadow({ mode: 'open' });

        // Create dialog element
        this.dialog = document.createElement('dialog');
        this.dialog.setAttribute('part', 'dialog');

        // Create overlay for fallback
        this.overlay = document.createElement('div');
        this.overlay.setAttribute('part', 'overlay');

        // Styling
        const style = document.createElement('style');
        style.textContent = `
            dialog::backdrop {
                background-color: rgba(0, 0, 0, 0.5);
            }

            ::slotted(p) {
                margin: 0;
            }

            [part="overlay"] {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.5);
                display: none;
                z-index: 10;
            }

            [part="dialog"] {
                z-index: 11;
            }
        `;

        // Append elements to shadow DOM
        shadow.appendChild(style);
        shadow.appendChild(this.overlay);
        shadow.appendChild(this.dialog);

        if (this.hasAttribute('open')){
            this.open();
        }

        // Close button for dialog content
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.addEventListener('click', () => this.close());
        this.dialog.appendChild(closeButton);

        // Slot for dialog content
        const slot = document.createElement('slot');
        this.dialog.appendChild(slot);
    }

    // Opens the dialog
    open() {
        if ('showModal' in this.dialog) {
            this.dialog.showModal();
        } else {
            this.dialog.style.display = 'block';
            this.overlay.style.display = 'block';
        }
    }

    // Closes the dialog
    close() {
        if ('close' in this.dialog) {
            this.dialog.close();
        } else {
            this.dialog.style.display = 'none';
            this.overlay.style.display = 'none';
        }
    }

    // Lifecycle: when component is added to the DOM
    connectedCallback() {
        this.overlay.addEventListener('click', () => this.close());
    }
}
