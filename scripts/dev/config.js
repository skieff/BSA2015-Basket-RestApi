require.config({

    paths: {
        backbone: 'libs/backbone',
        underscore: 'libs/underscore',
        jquery: 'libs/jquery-2.1.4'
    },

    shim: {
        underscore: {
            exports: '_'
        },
        jquery: {
            exports: '$'
        }
    },

    packages: [
    ]

});

require(["main"]);
