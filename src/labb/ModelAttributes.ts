import { AutoRegister } from '../controls/AutoRegister';
import { Table } from '../controls/collections/Table';
import { html } from '../dom/templates/html';

export interface ModelAttribute {
    name: string;
    dataType: string;
    isRequired: boolean;
}

@AutoRegister('model-attributes')
export class ModelAttributes extends HTMLElement {
    private table: Table;
    constructor() {
        super();

        const nodes = html`<rlx-table>
            <rlx-columns>
                <rlx-column name="name">Name</rlx-column>
                <rlx-column name="dataType">Data type</rlx-column>
                <rlx-column name="isRequired" titleMapper="booleanToRequired"
                    >&nbsp;</rlx-column
                >
            </rlx-columns>
        </rlx-table>
        <dialog name="newAttribute">
            <form>
                <rlx-form-manager>
                    <rlx-input name="name">Name</rlx-input>
                    <rlx-input-autocomplete name="dataType">Data type</rlx-input-autocomplete>
    </rlx-form-manager>
    </form>
    </dialog>
        `;

        this.appendChild(nodes);
        this.table = <Table>this.querySelector('rlx-table');
    }

    booleanToRequired(value: boolean): string {
        return value ? 'required' : '';
    }

    setData(attributes: ModelAttribute[]) {
        this.table.setData(attributes);
    }
}
