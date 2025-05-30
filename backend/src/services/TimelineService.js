import { TimelineRepository } from '../repositories/TimelineRepository.js';
import { EventRepository } from '../repositories/EventRepository.js';

const timelineRepo = new TimelineRepository();
const eventRepo = new EventRepository();

export class TimelineService {
  async createTimeline(timelineData) {
    return await timelineRepo.create(timelineData);
  }

  async addEvent(timeline_id, eventData) {
    const event = await eventRepo.create({ ...eventData, timeline_id });
    const timeline = await timelineRepo.findByProcessId(eventData.process_id);
    await timelineRepo.update({ timeline_id: timeline.timeline_id, number_events: timeline.number_events + 1 });
    return event;
  }

  async modifyEvent(eventData) {
    return await eventRepo.update(eventData);
  }

  async removeEvent(event_id) {
    return await eventRepo.delete(event_id);
  }
}
