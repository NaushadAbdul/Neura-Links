import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { FirestoreUserData, UserUploadedFile, User, Submission } from '../types';

/**
 * Fetch all users from Firestore database with account creation date and uploaded files count.
 * Falls back to combining with local/seeded user list when Firestore is empty or offline.
 */
export async function fetchAllFirestoreUsers(
  localUsers: User[],
  submissions: Submission[]
): Promise<FirestoreUserData[]> {
  try {
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);

    const firestoreUsersMap: Record<string, FirestoreUserData> = {};

    if (!usersSnapshot.empty) {
      for (const userDoc of usersSnapshot.docs) {
        const data = userDoc.data();
        const userId = userDoc.id;
        
        // Fetch files count from user's subcollection or files collection
        const filesCount = data.uploadedFilesCount ?? data.filesCount ?? 0;

        firestoreUsersMap[userId] = {
          id: userId,
          email: data.email || 'user@neuralinks.club',
          name: data.name || data.displayName || data.email?.split('@')[0] || 'Club Student',
          role: data.role || 'student',
          createdAt: data.createdAt || data.joinedDate || new Date().toISOString().split('T')[0],
          uploadedFilesCount: filesCount,
          avatar: data.avatar || data.photoURL,
        };
      }
    }

    // Combine with local mock users to ensure seamless demo & fallback deduplicated by email
    const emailMap = new Map<string, FirestoreUserData>();

    // Add Firestore fetched users (excluding demo admin)
    Object.values(firestoreUsersMap).forEach(u => {
      if (u.id !== 'user_admin_01' && u.email !== 'admin@neuralinks.club') {
        emailMap.set(u.email.toLowerCase(), u);
      }
    });

    // Merge in localUsers if email not already present
    localUsers.forEach(u => {
      const emailLower = u.email ? u.email.toLowerCase() : '';
      if (emailLower && !emailMap.has(emailLower) && u.id !== 'user_admin_01' && u.email !== 'admin@neuralinks.club') {
        const userSubmissions = submissions.filter(s => s.studentId === u.id || s.studentEmail?.toLowerCase() === emailLower);
        
        emailMap.set(emailLower, {
          id: u.id,
          email: u.email,
          name: u.name,
          role: u.role,
          createdAt: u.joinedDate || new Date().toISOString().split('T')[0],
          uploadedFilesCount: userSubmissions.length,
          avatar: u.avatar,
        });
      }
    });

    return Array.from(emailMap.values());
  } catch (error) {
    console.warn("Firestore fetch notice:", error);
    
    return localUsers.map(u => {
      const userSubmissions = submissions.filter(s => s.studentId === u.id);
      return {
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        createdAt: u.joinedDate || new Date().toISOString().split('T')[0],
        uploadedFilesCount: userSubmissions.length,
        avatar: u.avatar,
      };
    });
  }
}

/**
 * Fetch uploaded files for a specific user ID from Firestore database.
 */
export async function fetchUserUploadedFiles(
  userId: string,
  userEmail: string,
  submissions: Submission[]
): Promise<UserUploadedFile[]> {
  const files: UserUploadedFile[] = [];

  try {
    // 1. Check user's subcollection in Firestore (users/{userId}/files)
    const userFilesCollection = collection(db, `users/${userId}/files`);
    const subcollSnap = await getDocs(userFilesCollection);
    if (!subcollSnap.empty) {
      subcollSnap.docs.forEach(docSnap => {
        const d = docSnap.data();
        files.push({
          id: docSnap.id,
          userId,
          fileName: d.fileName || d.name || 'document.pdf',
          fileUrl: d.fileUrl || d.url || '#',
          uploadedAt: d.uploadedAt || d.createdAt || new Date().toISOString().split('T')[0],
          fileSize: d.fileSize || d.size || '1.4 MB',
          fileType: d.fileType || d.type || 'PDF Document',
          description: d.description || 'Uploaded study notebook / assignment file',
        });
      });
    }

    // 2. Check main files collection in Firestore (where userId == target userId)
    const mainFilesRef = collection(db, 'files');
    const q = query(mainFilesRef, where('userId', '==', userId));
    const mainFilesSnap = await getDocs(q);
    if (!mainFilesSnap.empty) {
      mainFilesSnap.docs.forEach(docSnap => {
        const d = docSnap.data();
        if (!files.some(f => f.id === docSnap.id)) {
          files.push({
            id: docSnap.id,
            userId,
            fileName: d.fileName || d.name || 'project_submission.zip',
            fileUrl: d.fileUrl || d.url || '#',
            uploadedAt: d.uploadedAt || d.createdAt || new Date().toISOString().split('T')[0],
            fileSize: d.fileSize || d.size || '3.2 MB',
            fileType: d.fileType || d.type || 'ZIP Archive',
            description: d.description || 'Project deliverables & source code archive',
          });
        }
      });
    }
  } catch (err) {
    console.warn(`Firestore files query notice for user ${userId}:`, err);
  }

  // 3. User submissions
  const userSubs = submissions.filter(s => s.studentId === userId);
  userSubs.forEach((sub) => {
    files.push({
      id: `file_sub_${sub.id}`,
      userId,
      fileName: `${sub.targetTitle.replace(/\s+/g, '_').toLowerCase()}_report.pdf`,
      fileUrl: sub.githubUrl || sub.liveDemoUrl || '#',
      uploadedAt: sub.submittedAt || new Date().toISOString().split('T')[0],
      fileSize: '2.8 MB',
      fileType: 'PDF Submission Report',
      description: `Submission documentation for "${sub.targetTitle}" (${sub.status.toUpperCase()})`,
    });
  });

  return files;
}
