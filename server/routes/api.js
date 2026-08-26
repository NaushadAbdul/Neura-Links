import express from 'express';
import * as models from '../models/schemas.js';

const router = express.Router();

const modelMap = {
  users: models.User,
  studentProfiles: models.StudentProfile,
  studentprofiles: models.StudentProfile,
  userActions: models.UserAction,
  useractions: models.UserAction,
  levels: models.Level,
  modules: models.Module,
  lessons: models.Lesson,
  tools: models.Tool,
  resources: models.Resource,
  roadmapNodes: models.RoadmapNode,
  roadmapnodes: models.RoadmapNode,
  tasks: models.Task,
  projects: models.Project,
  submissions: models.Submission,
  achievements: models.Achievement,
  announcements: models.Announcement,
  notifications: models.Notification,
};

// GET ALL DATA IN ONE HYDRATION PAYLOAD
router.get('/data/all', async (req, res) => {
  try {
    const result = {};
    for (const [key, Model] of Object.entries(modelMap)) {
      try {
        const items = await Model.find({}).lean();
        if (key === 'studentProfiles') {
          const profileMap = {};
          items.forEach(item => {
            if (item.userId) profileMap[item.userId] = item;
          });
          result[key] = profileMap;
        } else {
          result[key] = items;
        }
      } catch (err) {
        result[key] = key === 'studentProfiles' ? {} : [];
      }
    }
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// GET COLLECTION ITEMS
router.get('/data/:entity', async (req, res) => {
  const { entity } = req.params;
  const Model = modelMap[entity];
  if (!Model) return res.status(404).json({ success: false, message: `Entity ${entity} not found` });

  try {
    const items = await Model.find({}).lean();
    return res.json({ success: true, data: items });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// CREATE ITEM IN COLLECTION
router.post('/data/:entity', async (req, res) => {
  const { entity } = req.params;
  const Model = modelMap[entity];
  if (!Model) return res.status(404).json({ success: false, message: `Entity ${entity} not found` });

  try {
    const data = req.body;
    let doc;

    if (entity === 'studentProfiles') {
      doc = await Model.findOneAndUpdate({ userId: data.userId }, data, { upsert: true, new: true, lean: true });
    } else if (entity === 'users' && (data.id || data.email)) {
      const query = data.id ? { id: data.id } : { email: data.email };
      doc = await Model.findOneAndUpdate(query, data, { upsert: true, new: true, lean: true });
    } else if (data.id) {
      doc = await Model.findOneAndUpdate({ id: data.id }, data, { upsert: true, new: true, lean: true });
    } else {
      doc = await Model.create(data);
    }

    if (req.io) {
      req.io.emit('data_updated', { entity, action: 'create_or_update', data: doc });
    }

    return res.json({ success: true, data: doc });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// UPDATE ITEM IN COLLECTION
router.put('/data/:entity/:id', async (req, res) => {
  const { entity, id } = req.params;
  const Model = modelMap[entity];
  if (!Model) return res.status(404).json({ success: false, message: `Entity ${entity} not found` });

  try {
    const data = req.body;
    const query = entity === 'studentProfiles' ? { userId: id } : { id };
    const doc = await Model.findOneAndUpdate(query, data, { new: true, upsert: true, lean: true });

    if (req.io) {
      req.io.emit('data_updated', { entity, action: 'update', data: doc });
    }

    return res.json({ success: true, data: doc });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE ITEM FROM COLLECTION
router.delete('/data/:entity/:id', async (req, res) => {
  const { entity, id } = req.params;
  const Model = modelMap[entity];
  if (!Model) return res.status(404).json({ success: false, message: `Entity ${entity} not found` });

  try {
    const query = entity === 'studentProfiles' ? { userId: id } : { id };
    await Model.deleteOne(query);

    if (req.io) {
      req.io.emit('data_updated', { entity, action: 'delete', id });
    }

    return res.json({ success: true, id });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// SEED MONGODB ATLAS WITH MOCK DATA IF EMPTY
router.post('/seed', async (req, res) => {
  try {
    const seedData = req.body;
    if (!seedData || typeof seedData !== 'object') {
      return res.status(400).json({ success: false, message: 'Seed data payload missing' });
    }

    for (const [key, Model] of Object.entries(modelMap)) {
      if (seedData[key]) {
        const count = await Model.countDocuments();
        if (count === 0) {
          if (key === 'studentProfiles' && typeof seedData[key] === 'object') {
            const profileList = Object.values(seedData[key]);
            if (profileList.length > 0) await Model.insertMany(profileList);
          } else if (Array.isArray(seedData[key]) && seedData[key].length > 0) {
            await Model.insertMany(seedData[key]);
          }
        }
      }
    }

    if (req.io) {
      req.io.emit('data_updated', { entity: 'all', action: 'seeded' });
    }

    return res.json({ success: true, message: 'MongoDB Atlas successfully seeded!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
