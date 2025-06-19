import { recreateTable } from './tableCommands.ts'

const tableDefinitions = [{
    TableName: 'place-your-bets-guesses',
    KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' },

    ],
    GlobalSecondaryIndexes: [{
        IndexName: 'playerId-submittedAt',
        KeySchema: [
            {
                AttributeName: 'playerId',
                KeyType: 'HASH',
            },
            {
                AttributeName: 'submittedAt',
                KeyType: 'RANGE',
            },
        ],
        Projection: {
            ProjectionType: 'ALL',
        },
    }, {
        IndexName: 'result',
        KeySchema: [
            {
                AttributeName: 'result',
                KeyType: 'HASH',
            },
        ],
        Projection: {
            ProjectionType: 'ALL',
        },
    }],
    AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: 'playerId', AttributeType: 'S' },
        { AttributeName: 'submittedAt', AttributeType: 'N' },
        { AttributeName: 'result', AttributeType: 'S' },
    ],
    BillingMode: 'PAY_PER_REQUEST',
}]


async function recreateAllTables() {
    await Promise.all(
        tableDefinitions.map((tableDef) => {
            return recreateTable(tableDef)
        }),
    )
}

await recreateAllTables()
