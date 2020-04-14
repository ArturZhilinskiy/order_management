import { LightningElement, api } from 'lwc';

import PRODUCT_OBJECT from '@salesforce/schema/Product__c';

import { NavigationMixin } from 'lightning/navigation';


export default class OrderManagementProductCard extends NavigationMixin(LightningElement) {
    @api product = {
        id          : '',
        name        : '',
        image       : '',
        family      : '',
        type        : '',
        price       : '',
        description : ''
    }

    handleDetailsClick() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.product.id, 
                objectApiName: PRODUCT_OBJECT,
                actionName: 'view'
            },
        });

    }

}