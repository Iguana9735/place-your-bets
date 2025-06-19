import { CreateTableCommand, DeleteTableCommand, DescribeTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb'

const client = new DynamoDBClient({})

export async function tableExists(tableName: string): Promise<boolean> {
    try {
        await client.send(new DescribeTableCommand({ TableName: tableName }))
        return true
    } catch (error: any) {
        if (error.name === 'ResourceNotFoundException') {
            return false
        }
        throw error
    }
}

export async function waitForTableToBeDeleted(tableName: string): Promise<void> {
    console.log(`Waiting for table ${tableName} to be deleted...`)
    while (await tableExists(tableName)) {
        await new Promise(resolve => setTimeout(resolve, 2000))
        console.log('.')
    }
    console.log('Done!')
}

export async function waitForTableToBeActive(tableName: string): Promise<void> {
    console.log(`Waiting for table ${tableName} to be active...`)
    while (true) {
        try {
            const result = await client.send(new DescribeTableCommand({ TableName: tableName }))
            if (result.Table?.TableStatus === 'ACTIVE') {
                console.log('Done!')
                break
            }
        } catch (error: any) {
            if (error.name !== 'ResourceNotFoundException') {
                throw error
            }
        }
        await new Promise(resolve => setTimeout(resolve, 2000))
        console.log('.')
    }
}

export async function deleteTable(tableName: string): Promise<void> {
    if (await tableExists(tableName)) {
        console.log(`Deleting table: ${tableName}`)
        await client.send(new DeleteTableCommand({ TableName: tableName }))
        await waitForTableToBeDeleted(tableName)
    } else {
        console.log(`Table ${tableName} doesn't exist, skipping deletion`)
    }
}

export async function createTable(tableDefinition: any): Promise<void> {
    console.log(`Creating table: ${tableDefinition.TableName}`)
    await client.send(new CreateTableCommand(tableDefinition))
    await waitForTableToBeActive(tableDefinition.TableName)
}

export async function recreateTable(tableDefinition: any): Promise<void> {
    await deleteTable(tableDefinition.TableName)
    await createTable(tableDefinition)
    console.log(`Table ${tableDefinition.TableName} recreated successfully!`)
}

