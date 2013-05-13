/*
 * HTML Underscore Templates
 *
 */

foodTruckNS.templates = foodTruckNS.templates || {};

//Adjust underscore templating to match mustache
_.templateSettings = {
    evaluate : /\{\[([\s\S]+?)\]\}/g,
    interpolate : /\{\{([\s\S]+?)\}\}/g
};

foodTruckNS.templates.tweet = _.template([
    '<p class="tweet-text">',
        '{{ tweet.text }}',
    '</p>',
    '<time class="tweet-timeago" datetime="{{ tweet.created_at }}"></time>'
].join('\n'));

foodTruckNS.templates.truckList = _.template([
    '<li class="{{ truck.id }}">',

        '<a class="truck-image" href="trucks/{{ truck.urlid }}">',
            '<img class="truck-thumbnail"',
                 'src="{{ thumbnail.src }}"',
                 'alt="{{ truck.name }}"',
                 'width="{{ thumbnail.width }}" height="{{ thumbnail.height }}" />',
        '</a>',

        '<div class="truck-info">',
            '<a href="trucks/{{ truck.urlid }}">',
                '<h3 class="truck-name">{{ truck.name }}</h3>',
            '</a>',

            '<div class="truck-status">',
                '<span class="iconic iconic-clock {{ truck.open ? "open" : "closed" }}"></span>',
                '<span class="{{ truck.open ? "open" : "closed" }}">{{ truck.open ? "Open!" : "Closed" }}</span>',
                '{[ if (truck.open) { ]}',
                    '<a class="location" target="_blank" href="{{ truck.locationLink }}">',
                        '<span class="iconic iconic-map-pin-fill"></span> Go!',
                    '</a>',
                '{[ } ]}',
            '</div>',

            '<p>{{ truck.description }}</p>',

            '<div class="truck-tweet">',
                '{{ tweet }}',
            '</div>',
        '</div>',
    '</li>'
].join('\n'));
