import { LightningElement, wire } from 'lwc';

import PRODUCT_OBJECT from '@salesforce/schema/Product__c';
import PRODUCT_FAMILY_FIELD from '@salesforce/schema/Product__c.Family__c';
import PRODUCT_TYPE_FIELD from '@salesforce/schema/Product__c.Type__c';

import{ CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';

export default class OrderManagementFilter extends LightningElement {

    @wire(CurrentPageReference)
    pageRef;

    product = {
        objectApiName : PRODUCT_OBJECT,
        fields : {
            family      : PRODUCT_FAMILY_FIELD,
            type        : PRODUCT_TYPE_FIELD  
        }
    }

    handleFilterChange(event) {
        let familyFiled = this.template.querySelector("lightning-input-field[data-my-id=family]");
        let typeFiled = this.template.querySelector("lightning-input-field[data-my-id=type]");

        let filterData = {
            family : familyFiled.value,
            type   : typeFiled.value
        }

        fireEvent(this.pageRef, 'filtersChanged', JSON.stringify(filterData));
    }
}