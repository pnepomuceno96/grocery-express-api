const express = require('express');
const server = express();
const PORT = 3000;
const uuid = require('uuid');
const url = require('node:url')
const bodyParser = require('body-parser');
const dao = require('./groceryDao');

server.use(bodyParser.json());

function validateItemInput(req, res, next) {
    if (!req.body.itemName || !req.body.quantity || !req.body.price) {
        req.body.valid = false;
        next()
    } else {
        req.body.valid = true;
        next()
    }
}

// function validateGroceryIdInput(req, res, next) {
//     if (!req.body.grocery_id) {
//         req.body.valid = false;
//         next()
//     } else {
//         req.body.valid = true;
//         next()
//     }
// }

server.post('/groceryitems', validateItemInput, (req, res) => {
    const body = req.body;
    if(req.body.valid) {
        dao.addItem(uuid.v4(), body.itemName, body.quantity, body.price, false)
            .then((data) => {
                res.send({
                    message: "Successfully added item"
                })
            })
            .catch((err) => {
                res.send({message: `Request failed :( \n   Error: ${err}`})
            })
    } else {
        res.send({message: "Item properties are invalid"})
    }
})

server.get('/groceryitems', (req, res) => {
    dao.getList()
        .then((data) => {
            res.send({
                message: "Successfully retrieved list"
            });
            console.log(data)
        })
        .catch((err) => {
            res.send({message: `Failed to retrieve list \n    Error: ${err}`})
        })
})

// "Purchase" an item/set it as brought
server.put('/groceryitems', (req, res) => {
    const requestUrl = url.parse(req.url).query;
    console.log(requestUrl)
    dao.purchaseItemById(requestUrl)
        .then((data) => {
            res.send({
                message: "Item successfully set as brought"
            })
        })
        .catch((err) => {
            res.send({
                message: `An error occured: ${err}`
            })
        })
})

// Delete
server.delete('/groceryitems', (req, res) => {
    const requestUrl = url.parse(req.url).query;
    dao.deleteItemById(requestUrl)
        .then(() => {
            res.send({
                message: "Item successfully deleted"
            })
        })
        .catch((err) => {
            res.send({
                message: `An error occured: ${err}`
            })
        })
})


server.listen(PORT, () => {
    console.log('Server is listening on Port', PORT)
})