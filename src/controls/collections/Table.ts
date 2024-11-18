import { BaseComponent } from "../../dom/webcomponents/BaseComponent";
import { AutoRegister } from "../AutoRegister";

interface ColumnDefinition {
    /**
     * With specifier, like "10px", "10%" or "*"
     */
    width?: string;

    sortOrder?: 'ascending' | 'descending';

    title: string;

    property: string;
}

@AutoRegister('rlx-table')
export class Table extends BaseComponent {
    private table: HTMLTableElement = document.createElement('table');
    private tBody: HTMLTableSectionElement;
    private pages: Map<number, Record<string, unknown>[]> = new Map();

    constructor(private columns: ColumnDefinition[]) {
        super();
        this.shadowRoot.appendChild(this.table);
        this.tBody = document.createElement('tbody');
        const style = document.createElement('style');
        style.textContent = `
            table {
                border: 1px solid #ccc;
                width: 100%;
                padding: 0;
                margin: 0;
            }

            thead { margin: 0; padding: 0;}

            thead tr {
                background: black;
                margin: 0;
                padding: 0;
            }

            thead tr th{
                color: blue; 
                margin: 0;
                padding: 10px
                background: red;
            }
        `;

        this.shadowRoot!.appendChild(style);
    }

    pageLoader: (pageNumber: number) => Promise<Record<string, unknown>[]>;

    template?: HTMLTemplateElement;

    connectedCallback() {
        const columnsTemplate = this.querySelector('columns');
        if (columnsTemplate) {
            this.columns = this.extractColumnsFromTemplate(columnsTemplate);
            this.renderColumns();
        }
    }

    setData(data: unknown[]){
        this.render(data);
    }

    render(data: unknown[]) {
        if (!this.table.tHead) {
            this.renderColumns();
        }
        this.tBody.innerHTML = '';

        data.forEach((x: Record<string, unknown>) => {
            const row = document.createElement('tr');
            for (const prop in x) {
                const td = document.createElement('td');
                td.innerText = prop;
                row.appendChild(td);
            }
        });
    }

    page(pageNumber: number) {
        const wantedPage = this.pages.get(pageNumber);
        if (wantedPage) {
            this.render(wantedPage);
            return;
        }

        this.pageLoader(pageNumber).then((result) => {
            this.pages[pageNumber] = result;
            this.render(result);
        });
    }

    private extractColumnsFromTemplate(template: Element): ColumnDefinition[] {
        const columns: ColumnDefinition[] = [];
        const columnElements = template.querySelectorAll('column');
        columnElements.forEach((col) => {
            const title = col.getAttribute('title') || '';
            const property = col.getAttribute('prop') || '';
            const width = col.getAttribute('width');
            const sortOrder = col.getAttribute('sortOrder') as
                | 'ascending'
                | 'descending'
                | undefined;

            if (title && property) {
                columns.push({ title, property, width, sortOrder });
            }
        });
        return columns;
    }

    /**
     * Should only be done initially.
     */
    private renderColumns() {
        if (this.columns.length == 0) {
            if (this.template) {
                this.extractColumnsFromTemplate(this.template);
            } else {
                this.columns = [{ title: 'Name', property: 'name' }];
            }
        }

        const thead = document.createElement('thead');
        const tr = document.createElement('tr');
        thead.appendChild(tr);
        this.table.tHead = thead;

        this.columns.forEach((column) => {
            const th = document.createElement('th');
            th.innerText = column.title;
            tr.appendChild(th);
        });

        this.table.tHead = thead;
    }
}

@AutoRegister('rlx-columns')
export class ColumnsElement extends HTMLElement {
    private observer: MutationObserver;
  
    constructor() {
      super();
  
      this.observer = new MutationObserver(() => {
        this.updateColumns();
      });
    }
  
    connectedCallback() {
      this.observer.observe(this, { childList: true, subtree: false });
      this.updateColumns();
    }
  
    disconnectedCallback() {
      this.observer.disconnect();
    }
  
    get columns(): ColumnElement[] {
      return Array.from(this.querySelectorAll('column'));
    }
  
    set columns(value: ColumnElement[]) {
      this.innerHTML = '';
      value.forEach(column => this.appendChild(column));
      this.updateColumns();
    }
  
    private updateColumns() {
      console.log('Columns updated:', this.columns);
    }
  }



@AutoRegister('rlx-column')
export class ColumnElement extends HTMLElement {
  static get observedAttributes() {
    return ['name', 'transformer'];
  }

  get name(): string | null {
    return this.getAttribute('name');
  }

  set name(value: string | null) {
    if (value) {
      this.setAttribute('name', value);
    } else {
      this.removeAttribute('name');
    }
  }

  get transformer(): string | null {
    return this.getAttribute('transformer');
  }

  set transformer(value: string | null) {
    if (value) {
      this.setAttribute('transformer', value);
    } else {
      this.removeAttribute('transformer');
    }
  }

  get displayName(): string {
    return this.innerText;
  }

  set displayName(value: string) {
    this.innerText = value;
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    console.log(`Attribute changed: ${name}, Old: ${oldValue}, New: ${newValue}`);
  }
}