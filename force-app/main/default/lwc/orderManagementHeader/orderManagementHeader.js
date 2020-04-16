import { LightningElement, api, wire, track } from 'lwc';

import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Account.Name';
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

import{ CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';

import createOrder from '@salesforce/apex/OrderManager.createOrder';

const actions = [
    { label: 'Delete', name: 'delete' }
];

const columns = [
    { label: 'Name', fieldName: 'name' },
    { label: 'Price', fieldName: 'price', type: 'currency' },
    { label: 'Quantity', fieldName: 'quantity', type: 'number' },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    }
];

export default class OrderManagementHeader extends LightningElement {
    @api recordId;
    
    @wire(CurrentPageReference)
    pageRef;

    get recordIdFromState(){
        return this.pageRef.state.c__recordId; 
    }

    renderedCallback() {
        if (!this.recordId) {
            this.recordId = this.recordIdFromState;
        }
    }

    objectApiName = ACCOUNT_OBJECT;
    accountFields = [ACCOUNT_NAME_FIELD, ACCOUNT_NUMBER_FIELD];
    
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
    @track showProductCart = false;

    @track columns = columns; 

    @track productCart = [];

    get isManager() {
        return getFieldValue(this.currentUser.data, ISMANAGER_FIELD);
    }

    connectedCallback() {
        registerListener('addProductToCart', this.addToProductCart, this);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
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

        fireEvent(this.pageRef, 'allProductListUpdate');

        this.showCreateProductForm = false;
    }

    handleCreateProductFormCancel() {
        this.showCreateProductForm = false;
    }

    handleCartClick() {
        this.showProductCart = true;
    }

    handleProductCardCancel() {
        this.showProductCart = false;
    }

    handleCheckoutClick() {
        let order = {
            accountId : this.recordId,
            orderItems : this.productCart
        }

        let orderJSON = JSON.stringify(order);
        
        createOrder({orderJSON: orderJSON})
            .then(result => {
                const evt = new ShowToastEvent({
                    title: "Order created",
                    message: "Order Id: " + result,
                    variant: "success"
                });
                this.dispatchEvent(evt);
                
                this.productCart = [];

                this.showProductCart = false;
            })
            .catch(error => {
                const evt = new ShowToastEvent({
                    title: "Error",
                    message: "Message: " + error.body.message,
                    variant: "error"
                });
                this.dispatchEvent(evt);
            });
    }

    addToProductCart(data) {
        let selectedProduct = JSON.parse(data);
        
        let elemIndex = this.productCart.findIndex(elem => {
            console.log(elem.productId);
            return elem.productId == selectedProduct.id
        });

        if (elemIndex != -1) {
            this.productCart[elemIndex].quantity += 1;
        } else {
            this.productCart.push(this.createOrderItem(selectedProduct)); 
        }
        
        const evt = new ShowToastEvent({
            title: "Product added to the cart",
            message: "Product Name: " + selectedProduct.name,
            variant: "success"
        });
        this.dispatchEvent(evt);
    }

    createOrderItem(product) {
        let orderItem = {
            productId : product.id,
            name      : product.name,
            quantity  : 1,
            price     : product.price
        }
        return orderItem;
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        if (actionName == 'delete') {
            let rows = JSON.parse(JSON.stringify(this.productCart));

            let rowIndex = rows.findIndex(item => {
                return item.productId == row.productId;
            });
            
            if (rows[rowIndex].quantity >= 2) {
                rows[rowIndex].quantity -= 1;
            } else {
                rows.splice(rowIndex, 1);
            }

            this.productCart = rows;
        }
    }

    get totalPrice() {
        return this.productCart.reduce((acc, item) => {
            return acc += item.quantity * item.price;
        }, 0);
    }
}