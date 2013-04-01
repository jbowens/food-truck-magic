var userStore = require('../userstore.js').UserStore;

exports.route = function(request, response) {

    var data = {test : 'yolo'};

    function renderPage() {
        response.render('index', data);
    }

    if(request.session.userid) {
        userStore.getById(request.session.userid, function(user) {
            data.user = user;
            console.log(user);
            renderPage();
        });
    } else {
        renderPage();
    }

};
