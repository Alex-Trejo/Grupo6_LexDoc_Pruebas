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
