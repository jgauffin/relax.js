import { AutoRegister } from "../controls/AutoRegister";
import { ModelAttribute } from "./ModelAttributes";


export interface IData{
    name:string;
    description: string;
    required: boolean;
    dataType: string;
}


@AutoRegister('add-model')
export class AddModel extends HTMLElement{

    private modelAttributes: ModelAttribute[]=[];

    public saveForm(data: IData): void {
        console.log('Received data', data);
        
    }
}
