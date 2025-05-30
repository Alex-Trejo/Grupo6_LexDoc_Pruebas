import { TimelineService } from '../services/TimelineService.js';

const timelineService = new TimelineService();

export class TimelineController {
  async createTimeline(req, res) {
    try {
      const timelineData = req.body;
      const timeline = await timelineService.createTimeline(timelineData);
      res.status(201).json(timeline);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async addEvent(req, res) {
    try {
      const { timeline_id } = req.params;
      const eventData = req.body;
      const event = await timelineService.addEvent(timeline_id, eventData);
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async removeEvent(req, res) {
    try {
      const { event_id } = req.params;
      await timelineService.removeEvent(event_id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async modifyEvent(req, res) {
    try {
      const eventData = req.body;
      const updatedEvent = await timelineService.modifyEvent(eventData);
      res.status(200).json(updatedEvent);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getTimelineByProcess(req, res) {
    try {
      const { process_id } = req.params;
      const timeline = await timelineService.getTimelineByProcess(process_id);
      res.status(200).json(timeline);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}
