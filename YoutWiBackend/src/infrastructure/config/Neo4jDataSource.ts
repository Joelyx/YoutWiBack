import neo4j from 'neo4j-driver';

const uri = process.env.NEO4J_URI || 'bolt://localhost:7687'; // URI de tu instancia de Neo4j
const user = process.env.NEO4J_USER || 'neo4j'; // Usuario de tu instancia de Neo4j
const password = process.env.NEO4J_PASSWORD || 'neo4j'; // Contraseña de tu instancia de Neo4j

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

export async function executeQuery(query: string, parameters = {}) {
    const session = driver.session();
    try {
        const result = await session.run(query, parameters);
        return result.records;
    } catch (error) {
        throw error;
    } finally {
        await session.close();
    }
}