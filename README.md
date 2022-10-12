# Exercise Tracker

This is the fourth project for the Back End Development and APIs Certification in freeCodeCamp.com

You can find the full assignment here:

https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/exercise-tracker

# Working Demo:
https://cfp-exercise-tracker.herokuapp.com/

# POST to "api/users"
Will add the user to the database and return a json object with the username and the id assigned to said user.

ej: 

    {
    "_id" : "6346009a8902fd18e3c678f1",
    "username" : "example"
    }

# GET to "api/users"
Will return an array of the users in the previous format.


# POST to "/api/users/:_id/exercises"
Will add the excercise to the database and return the information as a Json Object 

ej: 

    {  
        "_id":"6346009a8902fd18e3c678f1",
        "username":"example",
        "date":"Tue Oct 11 2022",
        "duration":100,
        "description":"description test"
    }


# GET to "/api/users/:_id/logs?[from][&to][&limit]"

[ ] = optional

from, to = dates (yyyy-mm-dd); limit = number

Will return the users information with the exercises that it has

    {
        {"_id":"6346009a8902fd18e3c678f1",
        "username":"example",
        "log":
            [{
                "description":"description test",
                "duration":100,
                "date":"Tue Oct 11 2022"
            },
            {
                "description":"description test2",
                "duration":200,
                "date":"Wed Oct 12 2022"
            }],
        "count":2}
    }

