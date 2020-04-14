import { LightningElement, api } from 'lwc';

export default class OrderManagementProductCard extends LightningElement {
    @api product = {
        name        : 'Product Name',
        image       : '',
        family      : 'Food',
        type        : 'Pizza',
        price       : '200',
        description : 'Lal la la la'
    }
}