export interface Behavior {
    // Attach the behavior to the component, e.g., add event listeners
    attach(element: HTMLElement): void;

    /**
     * A specific child node was updated.
     */
    updated(element: HTMLElement): void;
  
    // Detach the behavior from the component, e.g., remove event listeners
    detach(element: HTMLElement): void;
  }