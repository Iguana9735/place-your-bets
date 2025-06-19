import { recreateTable } from './tableCommands.ts'

const tableDefinitions = [{
    TableName: 'place-your-bets-guesses',
    KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' },
    ],
    AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
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
