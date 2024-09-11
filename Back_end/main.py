from flask import Flask
from flask import request
from flask import jsonify
from flask import make_response
import requests
import json
from flask_cors import CORS


# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
app = Flask(__name__)

CORS(app)

@app.route('/')
def initial():
    return app.send_static_file("home.html")
    
@app.route('/deatils')
def details():
    id = request.args.get('id')
    # print(a)
    # print(request.args)

    # """Return a friendly HTTP greeting."""
    api_key = 'lpE7r62f0Q1NTs1v-989fTh8fZhoS0_airjCZU0659OhP0z3bNGMcKWnyZW35JzQPTb5LzC7XrC_iNN5NngNCpxhyAK5p3-UrFTBrjoBI3f0p255ETq6-iO9tuI5Y3Yx'
    
    url = "https://api.yelp.com/v3/businesses/"+ id
    headers = {
        'Authorization': 'Bearer '+ api_key,
    }
    response = requests.get(url, headers=headers)
    x = response.json()
    # final_list = []
    d = {}
    
    if x.get('hours'):
        if(len(x.get('hours'))>0 and x.get('hours')[0].get('is_open_now')!=None):
            if x.get('hours')[0].get('is_open_now') == True:
                d['Status'] = 'Open Now'
            else:
                d['Status'] = 'Closed'
    elif x.get('is_closed') != None:
        if x.get('is_closed') == True:
            d['Status'] = 'Closed'
        else:
            d['Status'] = 'Open Now'
    l = []
    if x.get('categories'):
        for each in x['categories']:
            if each.get('title'):
                l.append(each.get('title'))
        d['Category'] =  ' | '.join(l)
    if x.get('location',{}).get('display_address'):
        d['display_address'] =  ' '.join(x.get('location',{}).get('display_address'))
    if x.get('photos') != None:
        d['photos'] =  x.get('photos')
    if x.get('display_phone'):
        d['display_phone'] =  x.get('display_phone')
    if x.get('transactions'):
        y = []
        for each in x.get('transactions'):
            if each[0].islower():
                y.append(each[0].upper()+each[1:])
            else:
                y.append(each)

        d['transactions'] =  ' | '.join(y)
    if x.get('price'):
        d['price'] =  x.get('price')
    if x.get('name') != None:
        d['name'] =  x.get('name')
    if x.get('url'):
        d['url'] =  x.get('url')
    
    # if x.get('price'):
    #     d['price'] =  x.get('price')
    
    final_list = []
    final_list.append(d)
    print(final_list)
    return json.dumps(final_list)

@app.route('/search')
def search():
    a = request.args.get('lat')
    # print(a)
    # print(request.args)

    # """Return a friendly HTTP greeting."""
    api_key = 'lpE7r62f0Q1NTs1v-989fTh8fZhoS0_airjCZU0659OhP0z3bNGMcKWnyZW35JzQPTb5LzC7XrC_iNN5NngNCpxhyAK5p3-UrFTBrjoBI3f0p255ETq6-iO9tuI5Y3Yx'
    
    url = "https://api.yelp.com/v3/businesses/search?term="
    url += request.args.get('term')
   
    url += '&latitude='
    url += request.args.get('lat')
    url += '&longitude='  
    url += request.args.get('long')
    url += '&categories='
    url += request.args.get('category')
    url += '&radius='
    url += request.args.get('radius')
    print(url)
    
    headers = {
        'Authorization': 'Bearer '+ api_key,
    }
    
    
    response = requests.get(url, headers=headers)
    x = response.json()
    
    final_list = []
    for each in x.get('businesses') or []:
        d = {}
        d['id'] = each.get('id')
        d['image_url'] = each.get('image_url')
        d['name'] =  each.get('name')
        d['rating'] = each.get('rating')
        my_float = each.get('distance')*(0.00062137)
        d['distance'] = f'{my_float:.2f}'
        final_list.append(d)

    # print(x)
    # dictionary ={ 
    # "id": "04", 
    # "name": "sunil", 
    # "department": "HR"
    # } 
      
    # # Serializing json  
    # json_object = json.dumps(dictionary, indent = 4)
    # # return response.json()
    # print(final_list)
    return json.dumps(final_list)
if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. You
    # can configure startup instructions by adding `entrypoint` to app.yaml.
    # app.run(host='127.0.0.1', port=8080, debug=True)
    app.run(debug=True)