import { getDatabase } from "../../server/utils";

export default (request, response) => {
  try {
    const database = getDatabase(request.headers.database);
    const tableName = request.body.table;
    const fields = request.body.fields;

    const dropTransaction = database.transaction(() => {
      // Query A:
      const fieldsString = fields.map((name) => `"${name}"`).join(", ");
      const queryCreate = `CREATE TABLE "${tableName}_tmp_drop_column" AS SELECT ${fieldsString} FROM "${tableName}";`;
      database.prepare(queryCreate).run();

      // Query B:
      const queryDrop = `DROP TABLE "${tableName}";`;
      database.prepare(queryDrop).run();

      // Query C:
      const queryRename = `ALTER TABLE "${tableName}_tmp_drop_column" RENAME TO "${tableName}";`;
      database.prepare(queryRename).run();
    });

    dropTransaction();

    response.statusCode = 200;
    response.json({});
  } catch (error) {
    response.statusCode = 200;
    response.json({ error: { message: error.message } });
  }
};
