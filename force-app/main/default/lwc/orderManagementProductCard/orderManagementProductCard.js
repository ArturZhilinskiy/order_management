import { LightningElement, api, wire } from 'lwc';

import PRODUCT_OBJECT from '@salesforce/schema/Product__c';

import { NavigationMixin } from 'lightning/navigation';

import{ CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';

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

    @wire(CurrentPageReference)
    pageRef;

    handleDetailsClick() {
        window.open('/lightning/r/Product__c/'+this.product.id+'/view', '_blank');
    }

    handleAddClick() {
        fireEvent(this.pageRef, 'addProductToCart', JSON.stringify(this.product));
    }

}