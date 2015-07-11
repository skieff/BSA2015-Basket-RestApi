import Backbone from 'libs/backbone';
import BasketItemCollectionView from './BasketItemCollection'

class Basket extends Backbone.View {
    //noinspection JSMethodCanBeStatic
    tagName() {
        return 'li';
    }

    initialize() {
        this.render(this.model);
    }

    render(basket) {
        this.$el.append(basket.id);
        this.$el.append((new BasketItemCollectionView({basket: this.model})).$el);
    }
}

export default Basket;