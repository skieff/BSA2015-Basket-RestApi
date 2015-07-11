define(['exports', 'module', 'libs/backbone', './BasketItemCollection'], function (exports, module, _libsBackbone, _BasketItemCollection) {
    'use strict';

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

    var _Backbone = _interopRequireDefault(_libsBackbone);

    var _BasketItemCollectionView = _interopRequireDefault(_BasketItemCollection);

    var Basket = (function (_Backbone$View) {
        function Basket() {
            _classCallCheck(this, Basket);

            _get(Object.getPrototypeOf(Basket.prototype), 'constructor', this).apply(this, arguments);
        }

        _inherits(Basket, _Backbone$View);

        _createClass(Basket, [{
            key: 'tagName',

            //noinspection JSMethodCanBeStatic
            value: function tagName() {
                return 'li';
            }
        }, {
            key: 'initialize',
            value: function initialize() {
                this.render(this.model);
            }
        }, {
            key: 'render',
            value: function render(basket) {
                this.$el.append(basket.id);
                this.$el.append(new _BasketItemCollectionView['default']({ basket: this.model }).$el);
            }
        }]);

        return Basket;
    })(_Backbone['default'].View);

    module.exports = Basket;
});
//# sourceMappingURL=Basket.js.map