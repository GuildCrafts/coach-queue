const knex = require('./knex')
const { createRecord } = require('./utilities')

const addTeams = teams =>
  Promise.all( teams.map( team => createRecord('teams', team) ))

const associateLearnersWithTeams = teams =>
  Promise.all( teams.map( team => createRecord('learner_teams', team) ))

const addLearners = handles =>
  Promise.all( handles.map( handle => createRecord('learners', {handle}) ))

const deleteLearners = () => knex.raw(`DELETE FROM learners;`)

const deleteAllTeams = () => knex.raw(`DELETE FROM teams;`)

const getTeamMemberHandles = handle =>
  knex.raw(
    `SELECT handle
     FROM learners
     INNER JOIN (SELECT lt.*
      FROM learner_teams lt
      INNER JOIN (SELECT *
        FROM learners
		    INNER JOIN learner_teams lt
		    ON learners.id = lt.learner_id::int
		    WHERE handle = '${handle}') foo
      ON lt.team_id = foo.team_id) boo
    ON boo.learner_id::int = learners.id;`
  )

const getTeamIdByHandle = handle =>
  knex.select('team_id')
    .from('learners')
    .join('learner_teams', 'learners.id', 'learner_teams.learner_id')
    .where('handle', handle)

const getAllTeamsByCycle = cycle =>
  knex.select('*').from('teams').where('cycle', cycle)

const getCycleByTeamId = teamId =>
  knex.select('cycle')
    .from('teams')
    .where('id', teamId)
    .then( cycle => {
      return cycle.length === 0 ? 0 : cycle[0].cycle
    })

const getAllLearners = () =>
  knex.select('*')
    .from('learners')

const getAllLearnersByCycle = cycle =>
  knex.select('*')
    .from('learners')
    .join('learner_teams', 'learners.id', 'learner_teams.learner_id')
    .join('teams', 'learner_teams.team_id', 'teams.id')
    .where('teams.cycle', cycle)

const addUploads = cycle => createRecord('upload', { cycle })

const getUploadTimeByCycle = uploadTime =>
  knex
    .select('uploaded_at')
    .from('upload')

module.exports = {
  addTeams,
  associateLearnersWithTeams,
  addLearners,
  getTeamMemberHandles,
  getTeamIdByHandle,
  deleteLearners,
  getAllTeamsByCycle,
  deleteAllTeams,
  getCycleByTeamId,
  getAllLearnersByCycle,
  getAllLearners,
  addUploads,
  getUploadTimeByCycle
}
