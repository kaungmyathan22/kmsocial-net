import { config } from '@root/config';
import { redisConnection } from '@services/redis/redis.connection';
import Logger from 'bunyan';
import mongoose from 'mongoose';

const log: Logger = config.createLogger('setupDatabase');

export default () => {
  const connect = () => {
    mongoose
      .connect(config.DATABASE_URL!)
      .then(() => {
        log.info('Successfully connected to the databse.');
        redisConnection.connect();
      })
      .catch((err) => {
        log.error('Erro connecting to databse', err);
        return process.exit(1);
      });
  };
  connect();
  mongoose.connection.on('disconnected', connect);
};
