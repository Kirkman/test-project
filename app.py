#!/usr/bin/env python
"""
Example application views.

Note that `render_template` is wrapped with `make_response` in all application
routes. While not necessary for most Flask apps, it is required in the
App Template for static publishing.
"""

import app_config
import json
import oauth
import static

from flask import Flask, make_response, render_template
from render_utils import make_context, smarty_filter, urlencode_filter, split_semicolon_filter, semicolon_to_comma_filter, two_line_address_filter, domain_only_filter
from werkzeug.debug import DebuggedApplication

app = Flask(__name__)
app.debug = app_config.DEBUG

app.add_template_filter(smarty_filter, name='smarty')
app.add_template_filter(urlencode_filter, name='urlencode')
app.add_template_filter(split_semicolon_filter, name='split_semicolon')
app.add_template_filter(semicolon_to_comma_filter, name='semicolon_comma')
app.add_template_filter(two_line_address_filter, name='two_line_address')
app.add_template_filter(domain_only_filter, name='domain_only')
# Example application views
@app.route('/')
def index():
    """
    Example view demonstrating rendering a simple HTML page.
    """
    context = make_context()

    return make_response(render_template('index.html', **context))


@app.route('/search.html')
def search():
    """
    Example view demonstrating rendering a simple HTML page.
    """
    context = make_context()

    return make_response(render_template('search.html', **context))


@app.route('/404.html')
def four_oh_four():
    context = make_context()

    return make_response(render_template('404.html', **context))

@app.errorhandler(404)
def page_not_found(e):
    context = make_context()

    return make_response(render_template('404.html', **context))


@app.route('/restaurants/<string:slug>/')
def _restaurant(slug):

    context = make_context()

    context['restaurant'] = []
    context['slug'] = ''

    restaurants = list(context['COPY']['restaurants'])
    restaurant_name = ''

    for index, restaurant in enumerate(restaurants):
        restaurant = dict(zip(restaurant.__dict__['_columns'], restaurant.__dict__['_row']))
        restaurant_slug = restaurant.get('slug')
        restaurant_slug = restaurant_slug

        if restaurant_slug == slug:
            print str(slug)
            context['restaurant'] = restaurant
            context['slug'] = str(slug)
            # This pagetype variable is used in the _base.html template to distinguish restaurant pages from the index page, so we can set a class on the #content div.
            context['pagetype'] = 'rest'

            restaurant_name = restaurant.get('name')

            context['restaurant']['index'] = index+1
            if index > 0:
                context['restaurant']['prev_slug'] = restaurants[index-1]['slug']
                context['restaurant']['prev_name'] = restaurants[index-1]['name']

            else:
                context['restaurant']['prev_slug'] = None
                context['restaurant']['prev_name'] = None

            if index < len(restaurants) - 1:
                context['restaurant']['next_slug'] = restaurants[index+1]['slug']
                context['restaurant']['next_name'] = restaurants[index+1]['name']
            else:
                context['restaurant']['next_slug'] = None
                context['restaurant']['next_name'] = None



    # Should this be wrapped in make_response() ?
    return make_response(render_template('restaurant.html', **context))

app.register_blueprint(static.static)
app.register_blueprint(oauth.oauth)

# Enable Werkzeug debug pages
if app_config.DEBUG:
    wsgi_app = DebuggedApplication(app, evalex=False)
else:
    wsgi_app = app

# Catch attempts to run the app directly
if __name__ == '__main__':
    print 'This command has been removed! Please run "fab app" instead!'
