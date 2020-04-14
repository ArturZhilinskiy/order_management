import { LightningElement, track, wire} from 'lwc';

import { getListUi} from 'lightning/uiListApi';
import PRODUCT_OBJECT from '@salesforce/schema/Product__c';

import { ShowToastEvent } from 'lightning/platformShowToastEvent'

export default class OrderManagementProductArea extends LightningElement {

    @track filteredProducts = [];

    allProducts = [];
    listViewApiName = 'orderManagement_All'

    @wire( getListUi, { objectApiName: PRODUCT_OBJECT, listViewApiName: '$listViewApiName'})
    loadProducts(result) {
        if (result.data) {
            this.allProducts = [];
            for (let elem of result.data.records.records) {
                let product = {};
                for(let field in elem.fields) {
                    product[field] = elem.fields[field].value;
                }
                this.allProducts.push(product);
            }
        } else if (result.error) {
            const evt = new ShowToastEvent({
                title: "Error",
                message: "Error message: " + result.error.data.message,
                variant: "error"
            });
            this.dispatchEvent(evt);
        }
    }

    loadAllProducts() {
        this.listViewApiName = this.listViewApiName == 'orderManagement_All' ? 'OrderManagement_All' : 'orderManagement_All';
    }

    handleSearchChange(event) {
        let searchValue = ((event.target.value).trim()).toLowerCase();
        
        this.filteredProducts = this.allProducts.filter(value => {
            let nameValue = (value.Name).toLowerCase();
            return nameValue.includes(searchValue);
        });

        console.log(this.filteredProducts);
    }

}