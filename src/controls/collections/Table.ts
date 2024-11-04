import { BaseComponent } from "../../dom/webcomponents/BaseComponent";

interface ColumnDefinition {
    /**
     * With specifier, like "10px", "10%" or "*"
     */
    width?: string;

    sortOrder?: 'ascending' | 'descending';

    title: string;

    property: string;
}

class Table extends BaseComponent {
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

        data.forEach((x) => {
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

customElements.define('rlx-table', Table);
export { Table, ColumnDefinition };