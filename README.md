# Netshoes challenge
--------------------

## Prerequisites

Make sure you have installed all of the following prerequisites on your development machine:

* Node.js - [Download and install Node.js](https://nodejs.org/en/download/);
* MongoDb - [Download and install mongo](https://docs.mongodb.com/manual/installation/) and the npm package manager, if you don't have it yet.

## Quick install

The first thing you should do is install the Node.js dependencies. To install Node.js dependencies you're going to use npm again. In your application folder run this in the command-line:

```bash
$ npm install
```

You'll need to insert all data of products.json into mongodb

```bash
$ npm run loadDataBase
```

Starting application

```bash
$ npm start
```



### Cart endpoint documentation

   > Add new item to cart, using cookie to indentify user cart

Endpoint: /cart/add/{idProduct}
method: GET
response :
Set-Cookie:cart={cartId}
body:
```
{
"items": [
    {
      "id": 13,
      "title": "Tênis Nike Biscuit Canvas",
      "image": "camisetagrandecorinthians_9.png",
      "availableSizes": [
      "41"
    ],
      "quantity": 1,
      "price": 129.9
    }
  ],
  "_id": "5823a30b58b63d418ff80922"
}
```


## Structure

The basic structure of this challenge is given in the following way:

* `netshoes-challenge/`Contains the source code of the front-end challenge.
* `data/`Contains sample json file.
* `node_modules/` Contains all dependencies fetched via [NPM](https://www.npmjs.org/). However, this directory is unnecessary for versioning, so it is ignored.
* `public/` Contains all the static files you use in your application, this is where you store your front-end files.
* `.gitignore` The .gitignore file specifies intentionally untracked files that Git should ignore.
* `LICENSE` A software license tells others what they can and can't do with your source code.
* `package.json` Lists all [Node.js](http://nodejs.org/) dependencies.
* `README.md` Explains how your application works.
