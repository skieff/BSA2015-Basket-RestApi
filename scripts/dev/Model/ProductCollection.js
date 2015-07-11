import Backbone from 'libs/backbone'
import ProductModel from './Product'

class ProductCollection extends Backbone.Collection {

    initialize() {
        this.model = ProductModel;
    }

    //noinspection JSMethodCanBeStatic
    url() {
        return '/product/';
    }

    firstId() {
        return (this.first() || {id: ''}).id
    }
}

let productCollection = new ProductCollection();
productCollection.fetch({sync: true});

export default productCollection;