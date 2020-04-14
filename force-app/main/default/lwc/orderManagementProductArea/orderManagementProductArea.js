import { LightningElement, track, wire} from 'lwc';

import { getListUi} from 'lightning/uiListApi';
import PRODUCT_OBJECT from '@salesforce/schema/Product__c';

import { ShowToastEvent } from 'lightning/platformShowToastEvent'

import{ CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';

export default class OrderManagementProductArea extends LightningElement {

    @track filteredProducts = [];

    @wire(CurrentPageReference)
    pageRef;

    allProducts = [];
    listViewApiName = 'orderManagement_All'

    productNameForSearch = '';

    @wire( getListUi, { objectApiName: PRODUCT_OBJECT, listViewApiName: '$listViewApiName'})
    loadProducts(result) {
        if (result.data) {
            this.allProducts = [];
            for (let elem of result.data.records.records) {
                let product = {
                    id          : elem.fields.Id.value,  
                    description : elem.fields.Description__c.value,  
                    family      : elem.fields.Family__c.value,  
                    type        : elem.fields.Type__c.value,  
                    name        : elem.fields.Name.value,  
                    price       : elem.fields.Price__c.value,  
                    image       : elem.fields.Image__c.value,  
                };
                this.allProducts.push(product);
            }
            this.filterProduts(this.productNameForSearch);
        } else if (result.error) {
            const evt = new ShowToastEvent({
                title: "Error",
                message: "Error message: " + result.error.data.message,
                variant: "error"
            });
            this.dispatchEvent(evt);
        }
    }

    connectedCallback() {
        registerListener('allProductListUpdate', this.loadAllProducts, this);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    loadAllProducts() {
        this.listViewApiName = this.listViewApiName == 'orderManagement_All' ? 'OrderManagement_All' : 'orderManagement_All';
    }

    handleSearchChange(event) {
        this.productNameForSearch = ((event.target.value).trim()).toLowerCase();
        this.filterProduts(this.productNameForSearch);
    }

    filterProduts(searchValue) {
        this.filteredProducts = this.allProducts.filter(value => {
            let nameValue = (value.name).toLowerCase();
            return nameValue.includes(searchValue);
        });

        console.log(this.filteredProducts);
    }

}