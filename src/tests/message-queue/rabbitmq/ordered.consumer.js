'use strict';

const amqp = require('amqplib');

const consumerOrderedMessage = async () => {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const queueName = 'ordered message';

    await channel.assertQueue(queueName, {
        durable: true
    })
    //set prefetch to keep arrangement of message 
    /**
     * Hiểu đơn giản là nó sẽ đợi cho tin nhắn chạy lần lượt xong rồi mới đến tin khác để bảm đảm thứ tự
     */
    channel.prefetch(1);
    channel.consume(queueName, msg => {
        const message = msg.content.toString();

        setTimeout(() => {
            console.log('processed message::', message);
            channel.ack(msg);
        }, Math.random() * 1000);
    })
}
consumerOrderedMessage().catch(err => console.error(err))