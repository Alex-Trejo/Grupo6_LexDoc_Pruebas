<<<<<<< HEAD
const assert = require('assert');
const EventRepository = require('../src/repositories/EventRepository');

describe('EventRepository', () => {
    it('should perform some operation', () => {
        // Add your test logic here to cover lines 5-55
        assert.strictEqual(true, true); // Placeholder assertion
    });
});
=======
import { ok, strictEqual } from 'assert';
import { EventRepository } from '../src/repositories/EventRepository.js';

describe('EventRepository', () => {
  it('should create a new event', async () => {
    const eventRepo = new EventRepository();
    const newEvent = await eventRepo.create({
      title: 'Reunión',
      date: '2025-06-04',
    });
    ok(newEvent.id); // Verifica que se creó con ID
    strictEqual(newEvent.title, 'Reunión');
  });
});
>>>>>>> 16d1e9ffeab75df9f1d0ef6bb6eaaf6b8bad7857
