
// Pro TIP: Install the LIT html extension for syntax highlighting.
 

export function sanitizeHtml(input: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '`': '&#x60;'
    };
    const reg = /[&<>"'`]/g;
    return input.replace(reg, (match) => map[match]);
  }

export function html(strings: TemplateStringsArray, ...values: never[]): DocumentFragment {
    // Build the HTML string with escaped values
    const templateString = strings.reduce(
      (result, string, i) => `${result}${string}${sanitizeHtml(String(values[i] || ''))}`, 
      ''
    );
  
    // Create a template element and populate it
    const template = document.createElement('template');
    template.innerHTML = templateString.trim();
    
    // Handle custom loop directives in the template
    processLoopDirectives(template.content);
  
    // Return a DocumentFragment
    return template.content;
  }
  
  // Helper to process custom loop directives
  function processLoopDirectives(fragment: DocumentFragment): void {
    // Select all elements with the `loop` attribute
    const loopElements = fragment.querySelectorAll('[loop]');
  
    loopElements.forEach(element => {
      const loopAttr = element.getAttribute('loop');
      if (!loopAttr) return;
  
      // Parse loop syntax (e.g., "user in users")
      const [item, collection] = loopAttr.split(' in ').map(str => str.trim());
      const dataArray = eval(collection); // Use eval carefully, or replace with safe data retrieval
  
      // Clone the element for each item in the array
      const parent = element.parentElement;
      if (parent && Array.isArray(dataArray)) {
        dataArray.forEach((dataItem: never) => {
          const clone = element.cloneNode(true) as HTMLElement;
  
          // Replace ${item.property} syntax in clone with actual values
          replaceTemplatePlaceholders(clone, item, dataItem);
  
          // Append the clone to the parent element
          parent.insertBefore(clone, element);
        });
  
        // Remove the original element with the loop directive
        element.remove();
      }
    });
  }
  
  // Helper to replace placeholders like `${item.property}` with actual values
  function replaceTemplatePlaceholders(element: HTMLElement, itemName: string, data: never): void {
    const content = element.innerHTML;
    const pattern = new RegExp(`\\$\\{${itemName}\\.(\\w+)\\}`, 'g');
  
    // Replace template variables in element's inner HTML
    element.innerHTML = content.replace(pattern, (_, property) => sanitizeHtml(String(data[property] || '')));
  
    // Replace template variables in attributes (like id)
    Array.from(element.attributes).forEach(attr => {
      attr.value = attr.value.replace(pattern, (_, property) => sanitizeHtml(String(data[property] || '')));
    });
  }