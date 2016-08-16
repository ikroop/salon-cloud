"use strict";
var route;
(function (route) {
    var Index = (function () {
        function Index() {
        }
        Index.index = function (req, res) {
            res.json({ 'Index': 'Test' });
            //res.render('index', { title: "Express" });
        };
        ;
        return Index;
    }());
    route.Index = Index;
})(route || (route = {}));
module.exports = route;
//# sourceMappingURL=index.js.map