import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import * as models from '../server/models/schemas.js';

dotenv.config();

if (dns.setServers) {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const mongoUri = process.env.MONGODB_URI;

// List of real registered students from your screenshots
const REGISTERED_STUDENTS = [
  {
    id: '0fu0bl6KcwU55dORv4Zh6lgnYQo2',
    name: 'MANIKRISHNA JANNAVARAPU',
    email: 'manikrishnavenkata2007@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role: 'student',
    status: 'active',
    joinedDate: '2026-08-22',
    authProvider: 'google',
  },
  {
    id: '1ISOww2IBiceOGSuPk5uyg3NX63',
    name: 'NITHIN SAI VALLURI',
    email: 'vallurinithin31@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    role: 'student',
    status: 'active',
    joinedDate: '2026-08-22',
    authProvider: 'google',
  },
  {
    id: '2Y7TgE75sqQkxDGU8J5ladHJzMl1',
    name: 'Tejaswini saginala',
    email: 'tejaswinisaginala@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'student',
    status: 'active',
    joinedDate: '2026-08-22',
    authProvider: 'google',
  },
  {
    id: '21k5VGq807fDXMz1ShZF2e0jD053',
    name: 'Rocky94',
    email: 'r10348521@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role: 'student',
    status: 'active',
    joinedDate: '2026-08-22',
    authProvider: 'google',
  },
  {
    id: '3cC1jDobjIS6UQBBthsia0KQNXI3',
    name: 'loukika gogireddy',
    email: 'loukikagogireddy@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'student',
    status: 'active',
    joinedDate: '2026-08-22',
    authProvider: 'google',
  },
  {
    id: '9UXiqGwAAqTUSgt9n0rpRhC72N23',
    name: 'Khareedu Vidya Sri',
    email: 'vidyasrikhareedu@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'student',
    status: 'active',
    joinedDate: '2026-08-22',
    authProvider: 'google',
  },
  {
    id: 'BWIgasalsaNACk9CicQbETjaLOG2',
    name: 'Manohar Rabilli',
    email: 'rabillimanohar0103@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role: 'student',
    status: 'active',
    joinedDate: '2026-08-22',
    authProvider: 'google',
  },
  {
    id: 'sneha_student_2006',
    name: 'sneha2006',
    email: 'sneha2006@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'student',
    status: 'active',
    joinedDate: '2026-08-22',
    authProvider: 'google',
  }
];

async function insertAllStudentsToMongoAtlas() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas!');

    console.log('🌱 Inserting registered students into MongoDB Atlas...');
    for (const student of REGISTERED_STUDENTS) {
      await models.User.findOneAndUpdate({ id: student.id }, student, { upsert: true, returnDocument: 'after' });
      await models.StudentProfile.findOneAndUpdate(
        { userId: student.id },
        {
          userId: student.id,
          level: 1,
          levelTitle: 'LEVEL 01 — Python Foundations',
          xp: 150,
          streak: 2,
          skills: { 'Python': 50, 'AI Engineering': 30 },
          completedModuleIds: [],
          completedLessonIds: [],
          completedTaskIds: [],
          completedProjectIds: [],
          unlockedAchievementIds: [],
        },
        { upsert: true, returnDocument: 'after' }
      );
      console.log(`✅ Synced student: ${student.name} (${student.email})`);
    }

    console.log('\n🎉 ALL REGISTERED STUDENTS ARE NOW SUCCESSFULLY INSERTED INTO MONGODB ATLAS!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Insert error:', error.message);
    process.exit(1);
  }
}

insertAllStudentsToMongoAtlas();
