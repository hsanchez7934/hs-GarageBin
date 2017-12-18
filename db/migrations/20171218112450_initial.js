
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('garage_items', function(table) {
      table.increments('id').primary();
      table.string('title');
      table.string('body');
      table.string('rating');
      
      table.timestamps(true, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('garage_items')
  ]);
};
