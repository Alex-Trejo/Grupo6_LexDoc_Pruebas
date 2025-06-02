import { TimelineRepository } from '../repositories/TimelineRepository.js';
import { EventRepository } from '../repositories/EventRepository.js';
import { ProcessRepository } from '../repositories/ProcessRepository.js';

const processRepo = new ProcessRepository();

const timelineRepo = new TimelineRepository();
const eventRepo = new EventRepository();

export class TimelineService {
  async createTimeline(timelineData, account_id) {
    // Verificar si el proceso existe y pertenece al usuario autenticado
    const process = await processRepo.findById(timelineData.process_id);
    if (!process) {
      throw new Error('Proceso no encontrado');
    }

    if (process.account_id !== account_id) {
    throw new Error('No autorizado para crear timeline en este proceso');
    }

      // Verificar si ya existe un timeline para ese proceso
    const existing = await timelineRepo.findById(timelineData.process_id);
    if (existing) {
      throw new Error('Ya existe un timeline para este proceso');
    }
    
    return await timelineRepo.create(timelineData);
  }

  async addEvent({timeline_id, event_title, description, account_id}) {

    //const timeline = await timelineRepo.findByProcessId(eventData.process_id);

    const timeline = await timelineRepo.findById(timeline_id);
    if (!timeline) {
      throw new Error('Timeline no encontrado');
    }

    const process = await processRepo.findById(timeline.process_id);
    if (!process || process.account_id !== account_id) {
      throw new Error('No tienes permiso para agregar eventos a este timeline');
    }

    const now = new Date();
    const order = timeline.number_events + 1;

    const event = await eventRepo.create({
        name: event_title,
        description,
        date: now,
        order,
        timeline_id
      });
    
     await timelineRepo.update({
        timeline_id,
        number_events: order
      });
    return event;
  }

  async modifyEvent(eventData) {
    return await eventRepo.update(eventData);
  }

  async getTimelineByProcessId(process_id) {
    return await timelineRepo.findByProcessId(process_id);
  }

  async removeEvent(event_id) {
    return await eventRepo.delete(event_id);
  }
}
