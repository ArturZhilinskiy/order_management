import { LightningElement, api, wire, track } from 'lwc';

import ACCOUT_NAME_FIELD from '@salesforce/schema/Account.Name';
import ACCOUNT_NUMBER_FIELD from '@salesforce/schema/Account.AccountNumber';

import PRODUCT_OBJECT from '@salesforce/schema/Product__c';
import PRODUCT_NAME_FIELD from '@salesforce/schema/Product__c.Name';
import PRODUCT_IMAGE_FIELD from '@salesforce/schema/Product__c.Image__c';
import PRODUCT_FAMILY_FIELD from '@salesforce/schema/Product__c.Family__c';
import PRODUCT_TYPE_FIELD from '@salesforce/schema/Product__c.Type__c';
import PRODUCT_PRICE_FIELD from '@salesforce/schema/Product__c.Price__c';
import PRODUCT_DESCRIPTION_FIELD from '@salesforce/schema/Product__c.Description__c';



import ISMANAGER_FIELD from '@salesforce/schema/User.isManager__c';

import currentUserId from '@salesforce/user/Id'
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import { ShowToastEvent } from 'lightning/platformShowToastEvent'


export default class OrderManagementHeader extends LightningElement {
    @api recordId = '0015I0000048a4qQAA';
    @api objectApiName = 'Account';

    accountFields = [ACCOUT_NAME_FIELD, ACCOUNT_NUMBER_FIELD];
    
    product = {
        objectApiName : PRODUCT_OBJECT,
        fields : {
            name        : PRODUCT_NAME_FIELD,
            image       : PRODUCT_IMAGE_FIELD,
            family      : PRODUCT_FAMILY_FIELD,
            type        : PRODUCT_TYPE_FIELD,
            price       : PRODUCT_PRICE_FIELD,
            description : PRODUCT_DESCRIPTION_FIELD
        }
    }
    
    @wire (getRecord, { recordId: currentUserId, fields: [ISMANAGER_FIELD] })
    currentUser;

    @track showCreateProductForm = false;

    get isManager() {
        return getFieldValue(this.currentUser.data, ISMANAGER_FIELD);
    }

    handleCreateProductClick() {
        this.showCreateProductForm = true;
    }

    handleSuccess(event) {
        const evt = new ShowToastEvent({
            title: "Product created",
            message: "Record ID: " + event.detail.id,
            variant: "success"
        });
        this.dispatchEvent(evt);

        this.showCreateProductForm = false;
    }

    handleCancel() {
        this.showCreateProductForm = false;
    }
}