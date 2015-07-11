import Backbone from 'libs/backbone'
import BasketView from './Basket'

class BasketCollection extends Backbone.View {

    //noinspection JSMethodCanBeStatic
    tagName() {
        return 'ul';
    }

    initialize() {
        this.listenTo(this.collection, 'reset', this.onCollectionReset);

        this.collection.fetch({reset: true});
    }

    onCollectionReset(collection) {
        this.$el.empty();
        this.render(collection);
    }

    render(collection) {
        for(let basket of collection.models) {
            this.$el.append((new BasketView({model: basket})).$el);
        }
    }
}

export default BasketCollection;