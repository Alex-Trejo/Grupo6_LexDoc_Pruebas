import pool from '../config/db.js';

export class ObservationRepository {
  async create(observation) {
    const query = `INSERT INTO observation (title, content, process_id) VALUES ($1, $2, $3) RETURNING *`;
    const values = [observation.title, observation.content, observation.process_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async findById(observation_id) {
    const query = `SELECT * FROM observation WHERE observation_id = $1`;
    const { rows } = await pool.query(query, [observation_id]);
    return rows[0];
  }

  async update(observation) {
    const query = `UPDATE observation SET title=$1, content=$2 WHERE observation_id=$3 RETURNING *`;
    const values = [observation.title, observation.content, observation.observation_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async delete(observation_id) {
    const query = `DELETE FROM observation WHERE observation_id=$1`;
    await pool.query(query, [observation_id]);
  }

  async findByProcessId(process_id) {
    const query = `SELECT * FROM observation WHERE process_id = $1`;
    const { rows } = await pool.query(query, [process_id]);
    return rows;
  }
}
