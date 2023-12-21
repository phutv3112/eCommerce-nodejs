'use strict';

const amqp = require('amqplib');

const consumerOrderedMessage = async () => {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const queueName = 'ordered message';

    await channel.assertQueue(queueName, {
        durable: true
    })
    for (let i = 0; i < 10; i++) {
        const message = `ordered queue message ${i}`;
        console.log('message: ', message);
        channel.sendToQueue(queueName, Buffer.from(message), {
            persistent: true
        })
    }

    setTimeout(() => {
        connection.close();
    }, 1000)
}
consumerOrderedMessage().catch(err => console.error(err))