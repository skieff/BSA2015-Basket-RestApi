import Backbone from 'libs/backbone';
import ProductSelect from './ProductSelect'
import productCollection from 'Model/ProductCollection'

class BasketItem extends Backbone.View {

    events() {
        return {
            'change [name="amount"]': this.onUiAmountChange,
            'click [name="add"]': this.onUiAddClick,
            'click [name="save"]': this.onUiSaveClick,
            'click [name="delete"]': this.onUiDeleteClick
        };
    }

    //noinspection JSMethodCanBeStatic
    tagName() {
        return 'li';
    }

    initialize() {
        this.listenTo(this.model, 'sync', this.onModelSync);
        this.listenTo(this.model, 'destroy', this.onModelDestroy);

        this.render(this.model);
    }

    render(basketItem) {
        if (basketItem.isNew()) {
            this.$el.append((new ProductSelect({model: basketItem, collection: productCollection}).$el));
            this.$el.append('<input type="number" min="1" name="amount" />');
            this.$el.append('<button name="add">Add</button>');
        } else {
            this.$el.append(basketItem.get('name') + ': ');
            this.$el.append('<input type="number" min="1" name="amount" value="' + basketItem.get('itemsAmount') + '" />');
            this.$el.append(
                ' x ' + basketItem.get('price') + ' = ' +
                basketItem.get('totalPrice')
            );
            this.$el.append('<button name="save">Save</button>');
            this.$el.append('<button name="delete">Delete</button>');
        }
    }

    onModelDestroy() {
        this.$el.remove();
    }

    onUiSaveClick() {
        if (this.model.hasChanged()) {
            this.model.save();
        }
    }

    onUiDeleteClick() {
        this.model.destroy({wait: true});
    }

    onModelSync(item) {
        this.$el.empty();
        this.render(item);
    }

    onUiAddClick() {
        this.model.trigger('save-item', this.model);
    }

    onUiAmountChange(evt) {
        this.model.set('itemsAmount', Backbone.$(evt.target).val());
    }
}

export default BasketItem;