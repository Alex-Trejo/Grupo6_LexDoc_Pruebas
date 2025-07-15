import pool from '../config/db.js';

export class TimelineRepository {
  async create(timeline) {
<<<<<<< HEAD
    const query = `INSERT INTO timeline (number_events, process_id) VALUES ($1, $2) RETURNING *`;
=======
    const query = 'INSERT INTO timeline (number_events, process_id) VALUES ($1, $2) RETURNING *';
>>>>>>> 16d1e9ffeab75df9f1d0ef6bb6eaaf6b8bad7857
    const values = [timeline.number_events, timeline.process_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async findByProcessId(process_id) {
<<<<<<< HEAD
    const query = `SELECT * FROM timeline WHERE process_id = $1`;
=======
    const query = 'SELECT * FROM timeline WHERE process_id = $1';
>>>>>>> 16d1e9ffeab75df9f1d0ef6bb6eaaf6b8bad7857
    const { rows } = await pool.query(query, [process_id]);
    return rows[0];
  }

  async findById(timeline_id) {
<<<<<<< HEAD
    const query = `SELECT * FROM timeline WHERE timeline_id = $1`;
=======
    const query = 'SELECT * FROM timeline WHERE timeline_id = $1';
>>>>>>> 16d1e9ffeab75df9f1d0ef6bb6eaaf6b8bad7857
    const { rows } = await pool.query(query, [timeline_id]);
    return rows[0];
  }

  async decrementEventCount(timeline_id) {
<<<<<<< HEAD
  const query = `UPDATE timeline SET number_events = number_events - 1 WHERE timeline_id = $1`;
=======
  const query = 'UPDATE timeline SET number_events = number_events - 1 WHERE timeline_id = $1';
>>>>>>> 16d1e9ffeab75df9f1d0ef6bb6eaaf6b8bad7857
  await pool.query(query, [timeline_id]);
  }


  async update(timeline) {
<<<<<<< HEAD
    const query = `UPDATE timeline SET number_events = $1 WHERE timeline_id = $2 RETURNING *`;
=======
    const query = 'UPDATE timeline SET number_events = $1 WHERE timeline_id = $2 RETURNING *';
>>>>>>> 16d1e9ffeab75df9f1d0ef6bb6eaaf6b8bad7857
    const values = [timeline.number_events, timeline.timeline_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async delete(timeline_id) {
<<<<<<< HEAD
    const query = `DELETE FROM timeline WHERE timeline_id = $1`;
=======
    const query = 'DELETE FROM timeline WHERE timeline_id = $1';
>>>>>>> 16d1e9ffeab75df9f1d0ef6bb6eaaf6b8bad7857
    await pool.query(query, [timeline_id]);
  }

  async deleteTimeline(timeline_id) {
<<<<<<< HEAD
  const query = `DELETE FROM timeline WHERE timeline_id = $1`;
=======
  const query = 'DELETE FROM timeline WHERE timeline_id = $1';
>>>>>>> 16d1e9ffeab75df9f1d0ef6bb6eaaf6b8bad7857
  await pool.query(query, [timeline_id]);
}

}
