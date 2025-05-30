import pool from '../config/db.js';

export class LegalAdviceRepository {
  async create(advice) {
    const query = `INSERT INTO legal_advice (content, process_id) VALUES ($1, $2) RETURNING *`;
    const values = [advice.content, advice.process_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async findById(advice_id) {
    const query = `SELECT * FROM legal_advice WHERE advice_id = $1`;
    const { rows } = await pool.query(query, [advice_id]);
    return rows[0];
  }

  async update(advice) {
    const query = `UPDATE legal_advice SET content=$1 WHERE advice_id=$2 RETURNING *`;
    const values = [advice.content, advice.advice_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async delete(advice_id) {
    const query = `DELETE FROM legal_advice WHERE advice_id=$1`;
    await pool.query(query, [advice_id]);
  }

  async findByProcessId(process_id) {
    const query = `SELECT * FROM legal_advice WHERE process_id = $1`;
    const { rows } = await pool.query(query, [process_id]);
    return rows;
  }
}
