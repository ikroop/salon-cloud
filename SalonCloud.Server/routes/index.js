"use strict";
var route;
(function (route) {
    class Index {
        static index(req, res) {
            res.json({ 'Index': 'Test' });
            //res.render('index', { title: "Express" });
        }
        ;
    }
    route.Index = Index;
})(route || (route = {}));
module.exports = route;
//# sourceMappingURL=index.js.map