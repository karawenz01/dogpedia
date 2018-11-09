# only use this file if using MongoDB

# dbuser = "emmak0822"
# dbpassword = "DogPedia0822!!"

# alternative read-only user
# dbuser = "dogpedia_read_only"
# dbpassword = "dogpedia0822"

# the following commands will export each collection to a JSON file
# mongoexport -h ds018558.mlab.com:18558 -d dogpedia -c breed_trait -u dogpedia_read_only -p dogpedia0822 -o breed_trait.json --jsonArray --pretty
# mongoexport -h ds018558.mlab.com:18558 -d dogpedia -c breeds -u dogpedia_read_only -p dogpedia0822 -o breeds.json --jsonArray --pretty
# mongoexport -h ds018558.mlab.com:18558 -d dogpedia -c pet_stores -u dogpedia_read_only -p dogpedia0822 -o pet_stores.json --jsonArray --pretty
# mongoexport -h ds018558.mlab.com:18558 -d dogpedia -c time_money -u dogpedia_read_only -p dogpedia0822 -o time_money.json --jsonArray --pretty
