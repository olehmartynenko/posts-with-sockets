type QueueInfo = {
  name: string;
  key: string;
};

export const Queues = {
  WRITE: {
    name: 'write-queue',
    key: 'WRITE_QUEUE',
  },
  READ: {
    name: 'read-queue',
    key: 'READ_QUEUE',
  },
} as const satisfies Record<string, QueueInfo>;
