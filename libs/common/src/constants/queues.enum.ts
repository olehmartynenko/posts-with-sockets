type QueueInfo = {
  name: string;
  key: string;
};

const Queues = {
  write: {
    name: 'write-queue',
    key: 'WRITE_QUEUE',
  },
  read: {
    name: 'read-queue',
    key: 'READ_QUEUE',
  },
} as const satisfies Record<string, QueueInfo>;

export default Queues;
