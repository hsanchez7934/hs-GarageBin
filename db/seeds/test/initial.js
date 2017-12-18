
exports.seed = function(knex, Promise) {
  return knex('garage_items').del()
    .then(function () {
      return Promise.all([
        knex('garage_items').insert([
          {
            id: 1,
            title: 'Wheels',
            body: 'Need to sell',
            rating: 'Sparkling'
          },
          {
            id: 2,
            title: 'Old Mower',
            body: 'Needs parts, not running, has sentimental value',
            rating: 'Dusty'
          },
          {
            id: 3,
            title: 'Old cloths',
            body: 'Need to donate to thrift store',
            rating: 'Rancid'
          },
        ])
          // eslint-disable-next-line no-console
          .then(() => console.log('Seeding dev complete!'))
          // eslint-disable-next-line no-console
          .catch(error => console.log(`Error seeding data: ${error}`))
      ]);
    })
    // eslint-disable-next-line no-console
    .catch(error => console.log(`Error seeding data: ${error}`));
};
