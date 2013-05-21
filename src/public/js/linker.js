/*
 * Client side for modifying DOM elements that contain urls in plain text. This
 * can create <a> link tags out of urls.
 */

var foodTruckNS = foodTruckNS || {};
foodTruckNS.linker = foodTruckNS.linker || {};

foodTruckNS.linker.linkRegexp = /(https?:\/\/\S+[^.,;?!])/ig;

/* Converts any urls not wrapped in <a> tags to now be wrapped in
 * <a> tags.
 */
foodTruckNS.linker.linkify = function(el) {
    // Check if text node?
    if(3 == el.nodeType)
    {
        var parentNode = el.parentNode;
        txt = el.data;

        var matches = foodTruckNS.linker.linkRegexp.exec(txt);
        if(!matches)
            return;

        var url = matches[1];
        // Split the text node at this url.
        var index = txt.indexOf(url);
        var frontNode = document.createTextNode(txt.substring(0, index));
        var backNode = document.createTextNode(txt.substring(index+url.length));
        var urlNode = document.createTextNode(url);
        var a = document.createElement("a");
        a.href = url;
        a.target = '_blank';
        a.appendChild(urlNode);
        parentNode.removeChild(el);
        parentNode.appendChild(frontNode);
        parentNode.appendChild(a);
        parentNode.appendChild(backNode);

        return;
    }

    // Recur
    for(var i = 0; i < el.childNodes.length; i++)
    {
        var child = el.childNodes[i];
        foodTruckNS.linker.linkify(child);
    }
};
