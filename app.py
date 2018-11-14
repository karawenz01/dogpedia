import os
from config import dbuser, dbpassword

import pandas as pd
import numpy as np

from flask import Flask, jsonify, render_template, request, redirect
from flask_pymongo import PyMongo
import pymongo

application = Flask(__name__)

# 1. Database setup

### Option 1. Use flask_pymongo to set up mongo connection and access a database
# app.config["MONGO_URI"] = f"mongodb://{dbuser}:{dbpassword}@ds018558.mlab.com:18558/dogpedia"
# mongo = PyMongo(app)

### Option 2. Use pymongo and connect to database
conn = f"mongodb://{dbuser}:{dbpassword}@ds018558.mlab.com:18558/dogpedia"
client = pymongo.MongoClient(conn)
db = client.dogpedia


# 2. Setting up the basic template route

@application.route("/")
def index():
    """Return index page"""
    return render_template('index.html')

@application.route("/find")
def find():
    """Return find page"""
    return render_template('find.html')

@application.route("/learn")
def learn():
    """Return learn page"""
    return render_template('learn.html')

@application.route("/adopt")
def adopt():
    """Return adopt page"""
    return render_template('adopt.html')

@application.route("/image")
def image():
    """Return image page"""
    return render_template('image.html')


# 3. Getting extra info with additional route

@application.route("/breeds")
def breeds():
    # breeds = mongo.db.breeds.find_one()['breed']
    breeds = db.breeds.find_one()['breed']
    return jsonify(breeds)


@application.route("/states")
def states():
    # states = mongo.db.pet_stores.find_one()["geo"]
    states = db.pet_stores.find_one()["geo"]
    return jsonify(states)


@application.route("/send", methods=["GET", "POST"])
def insert():
    if request.method == "POST":
        breed = request.form["Breed"]
        time = request.form["Time"]
        money = request.form["Money"]
        
        print(breed)
        print(time)
        print(money)

        db.time_money.insert_one({'breed': breed,
                                    'time': time,
                                    'money': money})

        return redirect("/learn", code=302)

    return render_template("learn.html")


@application.route("/breed_traits/<breed>")
def breedTraits(breed):
    """Return the traits for a given breed"""
    name = breed
    apt = db.breed_trait.find_one({'breed':breed})['apt_friendly']
    energy = db.breed_trait.find_one({'breed':breed})['energy']
    shedding = db.breed_trait.find_one({'breed':breed})['shedding']
    
    # Create a dictionary entry for each row of metadata information
    breed_traits = {}
    breed_traits["name"] = apt
    breed_traits["energy"] = energy
    breed_traits["shedding"] = shedding
    breed_traits["apt_friendly"] = apt

    return jsonify(breed_traits)


@application.route("/time_money/<breed>")
def inputValues(breed):
    """Return a list of time and money spent on the breed"""
    datas = list(db.time_money.find({'breed': breed}))
    
    time = []
    money = []
    
    for data in datas:
        time.append(data['time'])
        money.append(data['money'])
    
    value = {
        "breed": breed,
        "time": time,
        "money": money
    }

    return jsonify(value)

@application.route("/find_breed")
def findBreed():
    """Return breeds with traits matching input values"""
    # convert input strings to corresponding integer values
    apt = int(request.args["apt"])
    energy = int(request.args["energy"])
    shed = int(request.args["shed"])

    print(apt)
    print(energy)
    print(shed)

    # filter breed_traits collection by input values
    datas = list(db.breed_trait.find({'apt_friendly': apt,
                                        'energy': energy,
                                        'shedding': shed}))

    breeds = []
    apts = []
    energys = []
    sheddings = []
    
    for data in datas:
        breeds.append(data['breed'])
        apts.append(data['apt_friendly'])
        energys.append(data['energy'])
        sheddings.append(data['shedding'])
    
    value = {
        "breed": breeds,
        "apt_friendly": apts,
        "energy":energys,
        "shedding": sheddings
    }

    return jsonify(value)


if __name__ == "__main__":
    application.run(debug=True, port=4996)
