import { LightningElement } from 'lwc';

import PRODUCT_OBJECT from '@salesforce/schema/Product__c';
import PRODUCT_FAMILY_FIELD from '@salesforce/schema/Product__c.Family__c';
import PRODUCT_TYPE_FIELD from '@salesforce/schema/Product__c.Type__c';

export default class OrderManagementFilter extends LightningElement {
    product = {
        objectApiName : PRODUCT_OBJECT,
        fields : {
            family      : PRODUCT_FAMILY_FIELD,
            type        : PRODUCT_TYPE_FIELD  
        }
    }
}