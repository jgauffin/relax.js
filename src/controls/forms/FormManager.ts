import { readData } from '../../dom/forms/FormReader';
import { FormValidator } from '../../dom/forms/FormValidator';
import { PubSub } from '../../dom/PubSub';
import { AutoRegister } from '../AutoRegister';
import { DataDistributorMixin } from '../mixins/DataDistributor';

interface ISaveForm{
saveForm(data: unknown): void;
}

export class FormSavedMessage{
    constructor(public formName: string,
    public data: unknown){}
}

@AutoRegister('rlx-form-manager', {
    mixins: [DataDistributorMixin]
})
export class FormManager extends HTMLElement {
    private summary = document.createElement('div');
    private form: HTMLFormElement;
    private validator: FormValidator;
    constructor() {
        super();

        if (this.parentElement.tagName != 'FORM') {
            this.innerHTML =
                'This element must be placed directly under a FORM element.';
            return;
        }
        this.form = <HTMLFormElement>this.parentElement;

        console.log('hasAuto', this.hasAttribute('autovalidate'));
        this.validator = new FormValidator(this.form, {
            autoValidate: this.hasAttribute('autovalidate'),
            useSummary: this.hasAttribute('usesummary'),
            preventDefault: true,
            submitCallback: () => this.publishData()
        });

        // to remove "not used" warning ;)
        this.validator.clearErrorSummary();

        this.summary.className = 'error-summary';
        this.summary.setAttribute('style', 'color: red; display: none;');
        this.appendChild(this.summary);
    }

    private publishData(){
        console.log('here!');
        const data = readData(this.form);
        const parentSaver = this.findParentWithSaveForm(this);
        if (parentSaver){
            parentSaver.saveForm(data);
        }else{
            PubSub.publishUp(this, new FormSavedMessage(this.form.name, data));
        }
    }


    private findParentWithSaveForm(child: HTMLElement): ISaveForm | null {
        let current = child;
      
        while (current && typeof current === 'object') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            console.log('checking ', current.tagName, (current as Partial<ISaveForm>).saveForm);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (typeof (current as Partial<ISaveForm>).saveForm === 'function') {
            return <ISaveForm><unknown>current;
          }

          current = current.parentElement;
        }
      
        return null;
      }
}
