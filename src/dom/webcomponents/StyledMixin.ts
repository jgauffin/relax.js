/* eslint-disable @typescript-eslint/no-explicit-any */
export interface StyledMixin {
    container: HTMLElement;
    defaultStyles: string;
    updateClasses(): void;
    applyInternalStyles(): void;
    removeInternalStyles(): void;
}
type Constructor<T = object> = new (...args: any[]) => T;

export function StyledBehavior<TBase extends Constructor<HTMLElement>>(Base: TBase) {
    return class Styled extends Base {
        container: HTMLDivElement;

        constructor(...args: any[]) {
            super(...args);
            this.attachShadow({ mode: 'open' });
            this.container = document.createElement('div');
            this.shadowRoot!.appendChild(this.container);

            // Apply initial internal styles if no prefix is set
            this.applyInternalStyles();
        }

        connectedCallback() {
            // Ensure classes are updated initially
            this.updateClasses();
        }

        // more unused parameters: , oldValue: string | null, newValue: string | null
        attributeChangedCallback(name: string) {
            if (name === 'css-prefix' || name === 'type') {
                this.updateClasses();
            }
        }

        static get observedAttributes() {
            return ['css-prefix', 'type'];
        }

        updateClasses() {
            const prefix = this.getAttribute('css-prefix');
            const type = this.getAttribute('type') || 'info';

            // Use prefixed classes if `css-prefix` is set; otherwise, use default internal classes
            if (prefix) {
                this.container.className = `${prefix}-alert ${prefix}-${type}`;
                this.removeInternalStyles();
            } else {
                this.container.className = `alert ${type}`;
                this.applyInternalStyles();
            }
        }

        applyInternalStyles() {
            if (!this.shadowRoot) return;
            const style = document.createElement('style');
            style.textContent = `
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
            this.shadowRoot.appendChild(style);
        }

        removeInternalStyles() {
            if (this.shadowRoot) {
                this.shadowRoot.querySelectorAll('style').forEach((style) => style.remove());
            }
        }
    };
}
