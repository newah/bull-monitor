import { BullMonitorExpress } from '@bull-monitor/express';
import { BullMQAdapter } from '@bull-monitor/root/bullmq-adapter';
import { Queue, QueueOptions, RedisOptions } from "bullmq";

const redisHost = process.env.REDIS_HOST
const redisPort = Number(process.env.REDIS_PORT)
const redisPass = process.env.REDIS_PASS
const connection: RedisOptions = {
    host: redisHost,
    port: redisPort,
    password: redisPass
}

const queueOptions: QueueOptions = { connection }
const queues = {}

export const getQueue = (queueName, listen = false) => {
    if (!queues[queueName]) {
        queues[queueName] = new Queue(queueName, queueOptions);
    }
    return queues[queueName];
};


export const queueTypes = {
    urlQueue: 'URL List',
    sessionQueue: 'Session Queue',
    httpQueue: 'HTTP Queue',
    headlessQueue: 'Headless Queue',
    cloudflareQueue: 'Cloudflare Queue',
    eventQueue: 'Event Queue',
    imageStorerQueue: 'Image Storer Queue',
    pageQueue: 'Page Queue',
    imsimQueue: 'Imsim Queue',
    mitmQueue: 'Mitm Queue',
    valuationQueue: 'Valuation Queue'
}

const httpQueue = getQueue(queueTypes.httpQueue, true);
const headlessQueue = getQueue(queueTypes.headlessQueue, true);
const eventQueue = getQueue(queueTypes.eventQueue, true);
const imageStorerQueue = getQueue(queueTypes.imageStorerQueue, true);
const pageQueue = getQueue(queueTypes.pageQueue, true);
const imsimQueue = getQueue(queueTypes.imsimQueue, true);
const mitmQueue = getQueue(queueTypes.mitmQueue, true);
const urlQueue = getQueue(queueTypes.urlQueue, true);
const sessionQueue = getQueue(queueTypes.sessionQueue, true);
const valuationQueue = getQueue(queueTypes.valuationQueue, true);
const cloudflareQueue = getQueue(queueTypes.cloudflareQueue, true);

export const monitor = new BullMonitorExpress({
    queues: [
        new BullMQAdapter(httpQueue),
        new BullMQAdapter(headlessQueue),
        new BullMQAdapter(pageQueue),
        new BullMQAdapter(mitmQueue),
        new BullMQAdapter(imageStorerQueue),
        new BullMQAdapter(imsimQueue),
        new BullMQAdapter(eventQueue),
        new BullMQAdapter(urlQueue),
        new BullMQAdapter(sessionQueue),
        new BullMQAdapter(valuationQueue),
        new BullMQAdapter(cloudflareQueue),
    ],
    metrics: {
        // collect metrics every X
        // where X is any value supported by https://github.com/kibertoad/toad-scheduler
        collectInterval: { minutes: 10 },
        maxMetrics: 400
    },
});
