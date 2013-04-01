var userStore = require('../userstore.js').UserStore;
var _ = require('underscore');

var defaultTemplateData = {
    user: null
};

exports.route = function(request, response) {
    var data = _.clone(defaultTemplateData);

    function renderPage() {
        response.render('index', data);
    }

    if (request.session.userid) {
        userStore.getById(request.session.userid, function(user) {
            data.user = user;
            console.log(user);
            renderPage();
        });
    } else {
        renderPage();
    }

};
