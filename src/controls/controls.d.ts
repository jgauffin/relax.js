declare namespace JSX {
    interface IntrinsicElements {
      'my-custom-element': {
        'custom-attribute'?: string; // Define your attribute and its type
        'another-attribute'?: number;
        // Add other attributes as needed
      };
    }
  }