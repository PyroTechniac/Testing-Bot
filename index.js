const { KlasaClient } = require('klasa');
const { Permissions } = require('discord.js');
require('dotenv').config();

KlasaClient
    .use(require('./plugins/util'))
    .use(require('./plugins/moderation'))
    .use(require('./plugins/tags'))
    .use(require('./plugins/noMentionSpam'))
    .use(require('./plugins/functions'))
    .use(require('./plugins/channelsGateway'))
    .use(require('./plugins/membersGateway'))
    .use(require('klasa-dashboard-hooks'))
    .use(require('./plugins/klasaDocs'))
    .defaultGuildSchema
    .add('deleteCommand', 'boolean', { default: false })
    .add('minAccAge', 'integer', { default: 1800000 })
    .add('levelling', 'boolean', { default: true })
    .add('roles', folder => {
        folder
            .add('muted', 'Role');
    });
KlasaClient.defaultClientSchema
    .add('message', 'messagepromise')
    .add('timestamp', 'bigint', { default: 0 });
KlasaClient.defaultMemberSchema
    .add('experience', 'Integer', {
        default: 0,
        configurable: false
    })
    .add('level', 'Integer', {
        default: 0,
        configurable: false
    })
    .add('cooling', 'boolean', {
        default: false,
        configurable: false
    });
KlasaClient
    .basePermissions.add(Permissions.resolve('CREATE_INSTANT_INVITE'));
new KlasaClient({
    regexPrefix: process.env.NODE_ENV === 'production' ? /^(hey )?starlight(,|!)/i : /^(hey )?test(,|!)/i,
    commandEditing: true,
    commandMessageLifetime: 1800,
    prefix: 's!',
    providers: {
        default: process.env.NODE_ENV === 'production' ? 'mongodb' : 'json',
        mongodb: {
            connectionString: process.env.DB_STRING
        }
    },
    consoleEvents: {
        verbose: true,
        log: true,
        error: true,
        warn: true,
        wtf: true
    },
    commandLogging: true,
    dashboardHooks: {
        port: process.env.PORT
    },
    docs: {
        branches: ['master']
    },
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
}).login(process.env.TOKEN);