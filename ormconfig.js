module.exports = {
    type: 'mongodb',
    host: 'localhost',
    port: 27017,
    database: 'mongo_graphql',
    synchronize: true,
    logging: false,
    entities: ['src/entities/**/*.ts'],
    cli: {
        entitiesDir: 'src/entity'
    }
};
