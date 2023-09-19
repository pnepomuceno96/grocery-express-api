const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-2'
});

const docClient = new AWS.DynamoDB.DocumentClient();

function addItem(grocery_id, itemName, quantity, price, brought) {
    const params = {
        TableName: 'grocery_items',
        Item: {
            grocery_id,
            itemName,
            quantity,
            price,
            brought
        }
    }
    return docClient.put(params).promise();
};

function getList() {
    const params = {
        TableName: 'grocery_items'
    }

    return docClient.scan(params).promise()
}

function purchaseItemById(grocery_id) {
    const params = {
        TableName: 'grocery_items',
        Key: {
            grocery_id
        },
        UpdateExpression: 'set #n = :value',
        ExpressionAttributeNames: {
            '#n': 'brought'
        },
        ExpressionAttributeValues: {
            ':value': true
        }
    }

    return docClient.update(params).promise();
}

function deleteItemById(grocery_id) {
    const params = {
        TableName: 'grocery_items',
        Key: {
            grocery_id
        }
    }

    return docClient.delete(params).promise()
}

module.exports = {
    addItem, getList, purchaseItemById, deleteItemById
}