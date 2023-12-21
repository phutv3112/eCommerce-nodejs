'use strict';

const amqp = require('amqplib');
const messages = 'a new product: Title';

// const log = console.log
// console.log = function () {
//     log.apply(console, [new Date()].concat(arguments))
// }

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        const notifiExchange = 'notificationEx';
        const notiQueue = 'notificationQueueProcess';
        const notifiExchangeDLX = 'notificationExDLX';
        const notifiRoutingKeyDLX = 'notificationRoutingKeyDLX';

        //1. create Exchange
        await channel.assertExchange(notifiExchange, 'direct', {
            durable: true
        })
        //2. create queue
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false, //cho phep cac  ket noi truy cap vao cung luc 
            deadLetterExchange: notifiExchangeDLX,
            deadLetterRoutingKey: notifiRoutingKeyDLX,
        })
        //3. binding queue
        await channel.bindQueue(queueResult.queue, notifiExchange)
        //4. send message
        const msg = 'a new product'
        console.log('producer message::', msg);
        await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: '10000'
        });

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500)
    } catch (error) {
        console.error('Run producer error::', error);
    }
}

runProducer().then(rs => console.log(rs)).catch(err => console.error(err))