import os.path
import sqlite3
import pandas as pd

# filepath to Dogpedia database
db_path = './db/dogpedia.db'


# checks if a table exists in a SQLite db found at db_path
def exists_table(table_name, db_path):
    # check if db exists
    if os.path.exists(db_path):
        # connect to db and collect list of table names
        conn = sqlite3.connect(db_path)
        tables = conn.execute(
            "SELECT name FROM sqlite_master WHERE type='table'").fetchall()
        tables = [table[0] for table in tables]
        conn.close()

        # return True if table_name found, else return False
        if table_name in tables:
            return True
        else:
            return False

    # return False if db doesn't exist
    else:
        return False


# build breeds table
def build_breeds():
    # if table exists, pass
    if exists_table("breeds", db_path):
        pass

    # else create table using breeds dataset
    else:

        # connect to db and create table schema
        conn = sqlite3.connect(db_path)
        conn.execute('CREATE TABLE breeds (breed TEXT PRIMARY KEY)')

        # populate table with data
        with conn:

            # pandas dataframe
            df = pd.read_csv('./db/dataset/breeds.csv')

            # collect list of breeds
            breeds = []
            for breed in list(df['breed']):
                breed_tuple = (breed,)
                breeds.append(breed_tuple)

            # insert values into table
            conn.executemany('INSERT INTO breeds VALUES (?)', breeds)

        # close db connection
        conn.close()


# build breed traits table
def build_breed_traits():
    # if table exists, pass
    if exists_table("breed_traits", db_path):
        pass

    # else create table using breed traits dataset
    else:
        # connect to db and create table schema
        conn = sqlite3.connect(db_path)
        conn.execute(
            'CREATE TABLE breed_traits (breed TEXT PRIMARY KEY, apt_friendly INTEGER, energy INTEGER, shedding INTEGER)')

        # populate table with data
        with conn:
            # pandas dataframe
            df = pd.read_csv("./db/dataset/breed_traits.csv")

            breeds = list(df['breed'])
            apt_friendly = list(df['apt_friendly'])
            energy = list(df['energy'])
            shedding = list(df['shedding'])

            # assemble list of tuples
            breed_traits = zip(breeds, apt_friendly, energy, shedding)

            # insert values into table
            conn.executemany(
                'INSERT INTO breed_traits VALUES (?, ?, ?, ?)', breed_traits)

        # close db connection
        conn.close()
