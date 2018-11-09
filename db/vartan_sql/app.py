################
# DEPENDENCIES #
################
import os.path
import json
import sqlite3
from init_db import db_path, exists_table, build_breeds, build_breed_traits
import pandas as pd
from flask import Flask, jsonify, render_template, request, redirect


########################
# FUNCTION DEFINITIONS #
########################

# return SQL queries as dictionaries
def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


#############
# FLASK APP #
#############
app = Flask(__name__)


###############
# MAIN ROUTES #
###############
@app.route("/")
def index():
    """Return index page"""
    return render_template('index.html')


@app.route("/find")
def find():
    """Return find page"""
    return render_template('find.html')


@app.route("/learn")
def learn():
    """Return learn page"""
    return render_template('learn.html')


@app.route("/adopt")
def adopt():
    """Return adopt page"""
    return render_template('adopt.html')


##############
# API ROUTES #
##############
@app.route("/breeds")
def breeds():
    """Return list of breeds"""
    conn = sqlite3.connect(db_path)
    conn.row_factory = dict_factory
    results = conn.execute("SELECT * FROM breeds").fetchall()
    conn.close()
    return jsonify(results)


@app.route("/breed_traits/<breed>")
def breedTraits(breed):
    """Return the traits for a given breed"""
    conn = sqlite3.connect(db_path)
    conn.row_factory = dict_factory
    results = conn.execute(
        "SELECT * FROM breed_traits WHERE breed=?", (breed,)).fetchone()
    conn.close()
    return jsonify(results)


@app.route("/find_breed")
def find_breed():
    """Return breeds with traits matching input values"""
    # convert input strings to corresponding integer values
    if request.args["apt"] == "yes":
        apt = [3, 4, 5]
    else:
        apt = [1, 2]

    if request.args["energy"] == "high":
        energy = [3, 4, 5]
    else:
        energy = [1, 2]

    if request.args["shed"] == "much":
        shed = [3, 4, 5]
    else:
        shed = [1, 2]

    # filter breed_traits table by input values
    conn = sqlite3.connect(db_path)
    df = pd.read_sql("SELECT * FROM breed_traits", conn)
    filtered_df = df[df.apt_friendly.isin(
        apt) & df.energy.isin(energy) & df.shedding.isin(shed)]
    conn.close()

    return jsonify(json.loads(filtered_df.to_json(orient="records")))


@app.route("/states")
def states():
    with open('./db/dataset/pet_stores.json') as json_file:
        states_json = json.load(json_file)

    return jsonify(states_json[0]["geo"])


@app.route("/time_money/<breed>")
def inputValues(breed):
    """Return a list of time and money spent on the breed"""
    df = pd.read_json(
        "./db/dataset/time_money.json")[["breed", "money", "time"]]
    filtered_df = df[df.breed == breed]
    json_response = filtered_df.to_json(orient="records")
    json_response = json.loads(json_response)

    return jsonify(json_response)


################################
# INITIALIZE DOGPEDIA DATABASE #
################################
@app.before_first_request
def init_db():
    # check if db exists
    db_exists = os.path.exists(db_path)
    db_status = False

    # if db and all tables exist, pass
    if db_exists:
        db_status = exists_table("breeds", db_path) and exists_table(
            "breed_traits", db_path)
        if db_status:
            pass
        # if not all tables exist, remove db
        else:
            os.remove(db_path)

    # if all tables exist, pass
    if db_status:
        pass
    # else build db and all tables
    else:
        build_breeds()
        build_breed_traits()


# start Flask app in debug mode on port 5000
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
