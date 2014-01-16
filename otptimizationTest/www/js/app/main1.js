require.config({
    baseUrl:"js/app",
    paths:{ "jquery":"../lib/jquery" },
    shim:{
        "jquery":{
            exports:"$"
        }
    }
});

require(['jquery','./lib','controller/c1','model/m1'],function ($, lib, controller, model) {
    //A fabricated API to show interaction of
    //common and specific pieces.
    controller.setModel(model);
    $(function () {
        controller.render(lib.getBody());
    });
});
