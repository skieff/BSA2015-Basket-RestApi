import Backbone from 'libs/backbone'
import BasketItemView from './BasketItem'
import BasketItemCollectionModel from 'Model/BasketItemCollection'
import productCollection from 'Model/ProductCollection'
import _ from 'underscore'

class BasketItemCollection extends Backbone.View {
    //noinspection JSMethodCanBeStatic
    tagName() {
        return 'ul';
    }

    initialize(options) {
        this.basket = options.basket;

        this.collection = new BasketItemCollectionModel([], options);
        this.newBasketItem = new this.collection.model({
            basket: this.basket.id,
            product: productCollection.firstId()
        }, options);

        this.listenTo(this.collection, 'reset', this.onCollectionReset);
        this.listenTo(this.collection, 'add', this.onAdd);
        this.listenTo(this.collection, 'destroy', this.onDelete);
        this.listenTo(this.collection, 'sync', this.onCollectionSync);
        this.listenTo(this.newBasketItem, 'save-item', this.onSaveItem);

        this.collection.fetch({reset: true});
    }

    onDelete() {
        this.basket.fetch();
    }

    onCollectionSync() {
        this.basket.fetch();
    }

    onSaveItem(basketItem) {
        let existed = this.collection.findWhere({basket: basketItem.get('basket'), product: basketItem.get('product')});

        if (existed) {
            existed.set('itemsAmount', existed.get('itemsAmount') + 1);
        } else {
            var basketItemData = _.clone(basketItem.attributes);
            basketItemData.product = basketItemData.product || productCollection.firstId();

            existed = this.collection.add(basketItemData);
        }

        existed.save();
    }

    onAdd(basketItem) {
        this.renderItem(basketItem);
    }

    onCollectionReset(collection) {
        this.$el.empty();
        this.render(collection);
    }

    render(collection) {
        this.renderItem(this.newBasketItem);

        for(let basketItem of collection.models) {
            this.renderItem(basketItem);
        }
    }

    renderItem(basketItem) {
        this.$el.append((new BasketItemView({model: basketItem})).$el);
    }
}

export default BasketItemCollection;