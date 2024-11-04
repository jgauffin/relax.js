export class AlertComponent extends HTMLElement {
    private container: HTMLDivElement;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // Create container element
        this.container = document.createElement('div');
        this.shadowRoot!.appendChild(this.container);

    }

    static get observedAttributes() {
        return ['type', 'css-prefix'];
    }

    //, oldValue: string | null, newValue: string | null
    attributeChangedCallback(name: string) {
        if (name === 'type' || name === 'css-prefix') {
            this.updateClasses();
        }
    }

    connectedCallback() {
        // Initial class setup in case attributes were set before connecting
        this.updateClasses();
    }

    defaultStyles = `
            .alert {
                display: flex;
                align-items: center;
                justify-content: left;
                padding: var(--alert-padding, 1em);
                border-radius: var(--alert-border-radius, 4px);
                font-size: 1em;
                margin: 1em 0;
                font-family: Arial, sans-serif;
            }
            .info {
                background-color: var(--alert-info-bg, #e0f7fa);
                color: var(--alert-info-color, #006064);
            }
            .error {
                background-color: var(--alert-error-bg, #ffebee);
                color: var(--alert-error-color, #c62828);
            }
            .warning {
                background-color: var(--alert-warning-bg, #fff3e0);
                color: var(--alert-warning-color, #e65100);
            }
            .success {
                background-color: var(--alert-success-bg, #e8f5e9);
                color: var(--alert-success-color, #2e7d32);
            }
        `;

    private updateClasses() {
        const prefix = this.getAttribute('css-prefix');
        const type = this.getAttribute('type') || 'info';

        // If css-prefix is set, use prefixed classes; otherwise, use internal styles
        if (prefix) {
            this.container.className = `${prefix}-alert ${prefix}-${type}`;
            this.removeInternalStyles();
        } else {
            this.container.className = `alert ${type}`;
            this.applyInternalStyles();
        }
    }

    private removeInternalStyles() {
        const styles = this.shadowRoot!.querySelectorAll('style');
        styles.forEach((style) => style.remove());
    }

    applyInternalStyles() {
        if (!this.shadowRoot) return;
        const style = document.createElement('style');
        style.textContent = this.defaultStyles;
        this.shadowRoot.appendChild(style);
    }

}

customElements.define('alert-component', AlertComponent);
