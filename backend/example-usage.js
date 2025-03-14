const { getSession } = require("./config/neo4j");

async function createUser(name, email) {
	const session = getSession();
	try {
		const result = await session.run(
			"CREATE (u:User {name: $name, email: $email}) RETURN u",
			{ name, email }
		);
		return result.records[0].get("u").properties;
	} finally {
		await session.close();
	}
}
