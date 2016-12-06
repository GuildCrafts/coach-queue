
exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  const datetime = new Date(2017, 1, 27, 16, 5)

  return knex('appointments').del()
    .then(() => {
      return Promise.all([
        // Inserts seed entries
        knex('appointments').insert({
          coach_id:'4321cd',
          date_time: datetime,
          appointment_length: 45,
          description: "Something here now.",
          attendees: ['someone_123', 'aNameIsCool', 'peopleLikeLearning']
        }),
        knex('appointments').insert({
          coach_id:'1234ab',
          date_time: datetime,
          appointment_length: 45,
          description: "Solve my bug coach.",
          attendees: ['someone_123', 'reallycoolname']
        }),
        knex('appointments').insert({
          coach_id:'4321cd',
          date_time: datetime,
          appointment_length: 45,
          description: "We want a walkthrough for setting up express.",
          attendees: ['somebody_hit', 'aNameIsCool', 'peopleLikeLearning']
        })
      ]);
    });
};
