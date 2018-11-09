// var apiKey = '2f95f51b181ddd27883e91878e922466'; // assign our key to a variable, easier to read
var key = "fe895109edf26805c1f29e093af0949b"

console.log('working')


// the next line and function set up the button in our html to be clickable and reactive 
document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons() {
    document.getElementById('submitzip').addEventListener('click', function (event) {
        event.preventDefault();
        var zip = document.getElementById('zip').value; // this line gets the zip code from the form entry
        var url = 'https://api.petfinder.com/shelter.find';

        // Within $.ajax{...} is where we fill out our query 
        $.ajax({
            url: url,
            jsonp: "callback",
            dataType: "jsonp",
            data: {
                key: key,
                // animal: 'cat',
                'location': zip,
                output: 'basic',
                format: 'json'
            },
            // Here is where we handle the response we got back from Petfinder
            success: function (response) {
                console.log(response); // debugging

                var all_shelters = response.petfinder.shelters.shelter
                console.log('all shelters')
                console.log(all_shelters)
                var name = [];
                var latitude = [];
                var longitude = [];
                var phone = [];
                var address1 = [];


                for (i = 0; i < all_shelters.length; i++) {

                    name.push(all_shelters[i].name.$t)
                    latitude.push(all_shelters[i].latitude.$t)
                    longitude.push(all_shelters[i].longitude.$t)
                    phone.push(all_shelters[i].phone.$t)
                    address1.push(all_shelters[i].address1.$t)

                }

                console.log('fhefkajhjskjhef')
                console.log(name)
                console.log(latitude)
                console.log(longitude)
                console.log(phone)
                console.log(address1)
                console.log('fhefkajhjskjhef')

                var dict = []; // create an empty array

                for (i = 0; i < all_shelters.length; i++) {
                    dict.push({
                        Name: name[i],
                        Phone: phone[i],
                        Address: address1[i],
                        // value: phone[i]
                    })
                }

                console.log(dict)

                // repeat this last part as needed to add more key/value pairs

                // var log = []

                // for (i = 0; i < all_shelters.length; i++){
                //     log.push(name[i], phone[i])
                // }
                // console.log(log)



                var tbody = d3.select("tbody");
                // var empty_body = tbody.empty()
                d3.selectAll("tr").remove()
                d3.selectAll("td").remove()
                // tbody.attr("class", "table");
                dict.forEach((input) => {
                    var row = tbody.append("tr");
                    Object.entries(input).forEach(([key, value]) => {
                        var cell = tbody.append("td");
                        cell.text(value)
                    })
                })

            }




        });
    })

}




