import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
  NATS_SERVERS: string[];
}

const envsSchema = joi
    .object({
        PORT        : joi.number().required(),
        DATABASE_URL: joi.string().required(),
        NATS_SERVERS: joi.array().items(joi.string()).required(),
    })
    .unknown(true);

const { error, value } = envsSchema.validate({
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS?.split(','), // Split the NATS_SERVERS env var into an array
});

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
    port       : envVars.PORT,
    databaseUrl: envVars.DATABASE_URL,
    natServers : envVars.NATS_SERVERS,
};
