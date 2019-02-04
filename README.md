
# URL Shortener Microservice
A full stack URL Shortener Microservice api project using RESTful API.

![screenshot](https://i.ibb.co/vXFL3q0/Screen-Shot-2019-02-04-at-17-58-22.png)

# Visit
Visit at [heroku](https://url-shortener-project11.herokuapp.com/).

# Technologies
Project is created with :
- Express
- Node
- MongoDB
- Sass
- Mongoose
- Mocha
- Chai

# How to Use

Post a valid URL in the form\
You will be taken to the route [project url]/api/shorturl/new\
Copy the short_url value from the response object.(It will be the index of the entry in the database)\.
Go to [project url]/api/shorturl/[copied short_url]\
You will be redirected to the posted URL.\

Example:\
Post https://www.freecodecamp.com.\
Copy the short_url(in this case it will be 1)\
Go to https://url-shortener-project11.herokuapp.com/api/shorturl/1\
You will react https://www.freecodecamp.com.\

# You may also like
- [Timestamp Microservice](https://github.com/1XWebbyX1/timestamp-microservice)
- [Request Header Parser](https://github.com/1XWebbyX1/request-header-parser-microservice)

# Inspiration

This Project was inspired by user stories  at [freeCodeCamp](https://learn.freecodecamp.org/apis-and-microservices/apis-and-microservices-projects/url-shortener-microservice).


# License

MIT

---


> GitHub [@1XWebbyX1](https://github.com/1XWebbyX1)
