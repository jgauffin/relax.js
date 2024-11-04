import { html } from "../templates/html";

export class ShadowElement{
  private shadowRoot: ShadowRoot;
    constructor(private domElement: HTMLElement){


      domElement.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `<button>Click me</button>`;
      const str = html`<div>Hello world</div>`;
        console.log(str, domElement);

    }

    set styles(value: CSSStyleSheet){
      this.shadowRoot.adoptedStyleSheets = [value];
    }


    set html(value: string){
      this.shadowRoot.innerHTML = value;
    }
    
}