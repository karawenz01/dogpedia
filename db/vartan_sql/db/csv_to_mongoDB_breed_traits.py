import pandas as pd
import pymongo
from config import dbuser, dbpassword

# database connection setup
conn = f"mongodb://{dbuser}:{dbpassword}@ds018558.mlab.com:18558/dogpedia"
client = pymongo.MongoClient(conn)
db = client.dogpedia
collection = db.breed_trait

# read in csv
df = pd.read_csv('dataset/breed_traits.csv')

# convert to dictionary records
data = df.to_dict(orient='records')

# insert data into database
collection.insert_many(data)
