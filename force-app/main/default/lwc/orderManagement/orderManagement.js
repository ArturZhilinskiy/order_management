import { LightningElement, api, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';


export default class OrderManagement extends LightningElement {

    @api recordId;

    @wire(CurrentPageReference)
    currentPageReference; 


    get recordIdFromState(){
        return this.currentPageReference.state.c__recordId; 
    }

    renderedCallback() {
        if (!this.recordId) {
            this.recordId = this.recordIdFromState;
        }
    }
}