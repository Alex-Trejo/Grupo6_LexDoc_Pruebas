import pool from '../config/db.js';

export class EvidenceRepository {
  async create(evidence) {
    const query = `INSERT INTO evidence (type, file, process_id) VALUES ($1, $2, $3) RETURNING *`;
    const values = [evidence.type, evidence.file, evidence.process_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async findById(evidence_id) {
    const query = `SELECT * FROM evidence WHERE evidence_id = $1`;
    const { rows } = await pool.query(query, [evidence_id]);
    return rows[0];
  }

  async update(evidence) {
    const query = `UPDATE evidence SET type=$1, file=$2 WHERE evidence_id=$3 RETURNING *`;
    const values = [evidence.type, evidence.file, evidence.evidence_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async delete(evidence_id) {
    const query = `DELETE FROM evidence WHERE evidence_id=$1`;
    await pool.query(query, [evidence_id]);
  }

  async findByProcessId(process_id) {
    const query = `SELECT * FROM evidence WHERE process_id = $1`;
    const { rows } = await pool.query(query, [process_id]);
    return rows;
  }
}
