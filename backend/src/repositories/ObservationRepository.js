import pool from '../config/db.js';

export class ObservationRepository {
  async create(observation) {
<<<<<<< HEAD
    const query = `INSERT INTO observation (title, content, process_id) VALUES ($1, $2, $3) RETURNING *`;
=======
    const query = 'INSERT INTO observation (title, content, process_id) VALUES ($1, $2, $3) RETURNING *';
>>>>>>> 16d1e9ffeab75df9f1d0ef6bb6eaaf6b8bad7857
    const values = [observation.title, observation.content, observation.process_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async findById(observation_id) {
<<<<<<< HEAD
    const query = `SELECT * FROM observation WHERE observation_id = $1`;
=======
    const query = 'SELECT * FROM observation WHERE observation_id = $1';
>>>>>>> 16d1e9ffeab75df9f1d0ef6bb6eaaf6b8bad7857
    const { rows } = await pool.query(query, [observation_id]);
    return rows[0];
  }

  async update({ observation_id, title, content }) {
  const query = `
    UPDATE observation
    SET title = $1,
        content = $2
    WHERE observation_id = $3
    RETURNING *;
  `;

 
  const values = [title, content, observation_id];
  const { rows } = await pool.query(query, values);
  return rows[0];
}


async findWithProcess(observation_id) {
  const query = `
    SELECT o.*, p.account_id AS process_owner
    FROM observation o
    JOIN process p ON o.process_id = p.process_id
    WHERE o.observation_id = $1
  `;
  const { rows } = await pool.query(query, [observation_id]);
  return rows[0];
}


  async delete(observation_id) {
<<<<<<< HEAD
    const query = `DELETE FROM observation WHERE observation_id=$1`;
=======
    const query = 'DELETE FROM observation WHERE observation_id=$1';
>>>>>>> 16d1e9ffeab75df9f1d0ef6bb6eaaf6b8bad7857
    await pool.query(query, [observation_id]);
  }

  async findByProcessId(process_id) {
<<<<<<< HEAD
    const query = `SELECT * FROM observation WHERE process_id = $1`;
=======
    const query = 'SELECT * FROM observation WHERE process_id = $1';
>>>>>>> 16d1e9ffeab75df9f1d0ef6bb6eaaf6b8bad7857
    const { rows } = await pool.query(query, [process_id]);
    return rows;
  }
}
