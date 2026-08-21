import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth, ADMIN_USER_ID } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { UserActionsAuditLog } from '../../components/admin/UserActionsAuditLog';
import { fetchAllFirestoreUsers, fetchUserUploadedFiles } from '../../services/firestoreService';
import { FirestoreUserData, UserUploadedFile } from '../../types';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users,
  FileCheck,
  BookOpen,
  FolderGit2,
  ArrowRight,
  Shield,
  Plus,
  Clock,
  Search,
  FileText,
  ExternalLink,
  Download,
  Calendar,
  Database,
  Lock,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { users, modules, resources, submissions } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Firestore Users State
  const [firestoreUsers, setFirestoreUsers] = useState<FirestoreUserData[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected User Files Modal State
  const [selectedUser, setSelectedUser] = useState<FirestoreUserData | null>(null);
  const [userFiles, setUserFiles] = useState<UserUploadedFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState<boolean>(false);
  const [filesModalOpen, setFilesModalOpen] = useState<boolean>(false);

  const studentsList = users.filter(u => u.role === 'student');
  const activeStudentsCount = studentsList.filter(s => s.status === 'active').length;
  const pendingReviews = submissions.filter(s => s.status === 'under_review');

  // Load Firestore Users
  useEffect(() => {
    let mounted = true;
    async function loadUsers() {
      setLoadingUsers(true);
      const fetched = await fetchAllFirestoreUsers(users, submissions);
      if (mounted) {
        const cleaned = fetched.filter(u =>
          u.id !== 'user_student_01' &&
          u.id !== 'user_student_02' &&
          u.email !== 'naushad@neuralinks.club' &&
          u.email !== 'rahul@neuralinks.club'
        );
        setFirestoreUsers(cleaned);
        setLoadingUsers(false);
      }
    }
    loadUsers();
    return () => { mounted = false; };
  }, [users, submissions]);

  // Open User Files Modal
  const handleOpenUserFiles = async (user: FirestoreUserData) => {
    setSelectedUser(user);
    setFilesModalOpen(true);
    setLoadingFiles(true);
    const files = await fetchUserUploadedFiles(user.id, user.email, submissions);
    setUserFiles(files);
    setLoadingFiles(false);
  };

  // Filtered Firestore Users
  const filteredUsers = firestoreUsers.filter(u =>
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Prominent Admin Header Banner with ADMIN BADGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#674846]/90 via-[#1e1e1e] to-[#161616] border border-[#674846] p-6 rounded-lg shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Glowing Background Accent */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#674846]/50 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 z-10">
          <div className="flex items-center space-x-3">
            {/* PROMINENT ADMIN BADGE INDICATOR */}
            <div className="inline-flex items-center space-x-1.5 bg-[#674846] text-[#FFF8DC] border border-[#FFF8DC]/60 px-3 py-1 rounded-full font-mono text-xs uppercase tracking-widest font-extrabold shadow-[0_0_15px_rgba(103,72,70,0.8)]">
              <Shield className="w-4 h-4 text-[#FFF8DC] animate-pulse" />
              <span>ADMIN VIEW ACTIVE</span>
            </div>

            <span className="font-mono text-[11px] text-[#FFF8DC] bg-[#161616]/80 px-2.5 py-0.5 rounded border border-[#674846]/40">
              UID: {currentUser?.id || ADMIN_USER_ID}
            </span>
          </div>

          <h1 className="font-cornsilk text-3xl sm:text-4xl font-normal text-[#FFF8DC] tracking-wide uppercase flex items-center space-x-2">
            <span>Club Master Admin Console</span>
          </h1>

          <p className="text-sm text-[#FFF8DC]/80 font-sans max-w-2xl">
            You are currently logged in as Administrator. Monitor all Firestore database users, inspect user uploaded files, evaluate submissions, and broadcast platform updates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 z-10">
          <button
            onClick={() => navigate('/admin/modules')}
            className="bg-[#674846] hover:bg-[#7e5957] text-[#FFF8DC] border border-[#FFF8DC]/40 font-heading text-xs uppercase tracking-wider font-bold py-2.5 px-4 rounded-md transition-all shadow-[0_0_15px_rgba(103,72,70,0.5)] flex items-center space-x-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#FFF8DC]" />
            <span>Create Content</span>
          </button>
        </div>
      </div>

      {/* Top Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="space-y-2 border-[#674846]/40 bg-[#161616]">
          <div className="flex justify-between items-center text-gray-400 font-inconsolata text-[10px] uppercase">
            <span>Registered Users</span>
            <Users className="w-4 h-4 text-[#FFF8DC]" />
          </div>
          <div className="font-cornsilk text-3xl font-normal text-[#FFF8DC]">
            {firestoreUsers.length} <span className="text-xs text-gray-400 font-normal">Firestore Records</span>
          </div>
          <Badge variant="rose">{activeStudentsCount} Active Students</Badge>
        </Card>

        <Card className="space-y-2 border-[#674846]/40 bg-[#161616]">
          <div className="flex justify-between items-center text-gray-400 font-inconsolata text-[10px] uppercase">
            <span>Pending Reviews</span>
            <FileCheck className="w-4 h-4 text-[#FFF8DC]" />
          </div>
          <div className="font-cornsilk text-3xl font-normal text-[#FFF8DC]">
            {pendingReviews.length} <span className="text-xs text-gray-400 font-normal">Submissions</span>
          </div>
          <Badge variant={pendingReviews.length > 0 ? 'rose' : 'cornsilk'}>
            {pendingReviews.length > 0 ? 'Review Required' : 'Queue Clear'}
          </Badge>
        </Card>

        <Card className="space-y-2 border-[#674846]/40 bg-[#161616]">
          <div className="flex justify-between items-center text-gray-400 font-inconsolata text-[10px] uppercase">
            <span>Published Modules</span>
            <BookOpen className="w-4 h-4 text-[#FFF8DC]" />
          </div>
          <div className="font-cornsilk text-3xl font-normal text-[#FFF8DC]">
            {modules.filter(m => m.published).length} <span className="text-xs text-gray-400 font-normal">Modules</span>
          </div>
          <div className="font-inconsolata text-[11px] text-gray-400">across 8 Learning Levels</div>
        </Card>

        <Card className="space-y-2 border-[#674846]/40 bg-[#161616]">
          <div className="flex justify-between items-center text-gray-400 font-inconsolata text-[10px] uppercase">
            <span>Resource Materials</span>
            <FolderGit2 className="w-4 h-4 text-[#FFF8DC]" />
          </div>
          <div className="font-cornsilk text-3xl font-normal text-[#FFF8DC]">
            {resources.filter(r => r.published).length} <span className="text-xs text-gray-400 font-normal">Files</span>
          </div>
          <div className="font-inconsolata text-[11px] text-gray-400">PDFs, Videos & Notebooks</div>
        </Card>
      </div>

      {/* FEATURE 1 & 2 & 3: FIRESTORE DATABASE USERS LIST & UPLOADED FILES INSPECTOR */}
      <div className="bg-[#161616] border border-[#674846]/60 p-6 rounded-lg shadow-2xl backdrop-blur-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#674846]/40 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 font-mono text-xs text-[#FFF8DC] uppercase font-bold">
              <Database className="w-4 h-4 text-[#FFF8DC]" />
              <span>FIRESTORE DATABASE // READ ACCESS ENABLED</span>
            </div>
            <h2 className="font-cornsilk text-2xl font-normal text-[#FFF8DC] uppercase tracking-wider">
              Firestore Users & Uploaded Files Overview
            </h2>
            <p className="text-xs text-gray-300 font-inconsolata">
              Displaying all users from Firestore. Click on any user row to view their uploaded files, creation timestamp, and file metrics.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user email or name..."
              className="w-full pl-9 pr-3 py-2 bg-[#1e1e1e] border border-[#674846]/40 focus:border-[#FFF8DC] rounded-md text-xs text-[#FFF8DC] placeholder-gray-500 font-inconsolata focus:outline-none"
            />
          </div>
        </div>

        {/* Users Roster Table */}
        {loadingUsers ? (
          <div className="p-8 text-center text-xs font-mono text-[#FFF8DC] animate-pulse">
            Fetching user database records from Firestore...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-gray-400 bg-[#161616] rounded-md border border-[#674846]/40">
            No matching users found in Firestore database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-inconsolata text-xs">
              <thead>
                <tr className="border-b border-[#674846]/40 text-gray-400 uppercase text-[10px] tracking-wider bg-[#1e1e1e]">
                  <th className="py-3 px-4">User / Avatar</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Account Creation Date</th>
                  <th className="py-3 px-4">Uploaded Files</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#674846]/30">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => handleOpenUserFiles(user)}
                    className="hover:bg-[#674846]/20 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 flex items-center space-x-3">
                      <img
                        src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                        alt={user.name || 'User'}
                        className="w-8 h-8 rounded-full object-cover border border-[#FFF8DC]/40"
                      />
                      <div>
                        <div className="font-bold text-[#FFF8DC] group-hover:text-white transition-colors">
                          {user.name || 'Club Member'}
                        </div>
                        <div className="text-[10px] text-gray-400">ID: {user.id}</div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-[#FFF8DC] font-mono font-semibold">
                      {user.email}
                    </td>

                    <td className="py-3.5 px-4 text-gray-300">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#FFF8DC]" />
                        <span>{user.createdAt}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-[#1e1e1e] border border-[#674846]/40 rounded-md text-[#FFF8DC] font-bold">
                        <FileText className="w-3.5 h-3.5 text-[#FFF8DC]" />
                        <span>{user.uploadedFilesCount} {user.uploadedFilesCount === 1 ? 'file' : 'files'}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenUserFiles(user);
                        }}
                        className="px-3 py-1.5 bg-[#674846] hover:bg-[#7e5957] text-[#FFF8DC] border border-[#FFF8DC]/30 font-heading text-[10px] uppercase font-bold tracking-wider rounded transition-all shadow-md flex items-center space-x-1 ml-auto cursor-pointer"
                      >
                        <FolderGit2 className="w-3 h-3" />
                        <span>View Files</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FEATURE 3 MODAL: USER UPLOADED FILES INSPECTOR */}
      <Modal
        isOpen={filesModalOpen}
        onClose={() => setFilesModalOpen(false)}
        title={`Uploaded Files — ${selectedUser?.name || selectedUser?.email}`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-[#141414] border border-[#2a2224] rounded-md text-xs font-inconsolata">
            <div>
              <div className="text-gray-400 text-[10px] uppercase">Selected Account</div>
              <div className="font-bold text-[#F2F1ED]">{selectedUser?.email}</div>
            </div>
            <div className="text-right">
              <div className="text-gray-400 text-[10px] uppercase">Account Created</div>
              <div className="text-[#B38F6F] font-mono">{selectedUser?.createdAt}</div>
            </div>
          </div>

          {loadingFiles ? (
            <div className="p-8 text-center text-xs font-mono text-[#B38F6F] animate-pulse">
              Querying Firestore files collection for {selectedUser?.email}...
            </div>
          ) : userFiles.length === 0 ? (
            /* EMPTY STATE FOR FILES */
            <div className="p-8 text-center space-y-2 bg-[#141414] border border-[#2a2224] rounded-md">
              <FileText className="w-8 h-8 text-gray-600 mx-auto" />
              <div className="font-heading text-sm font-bold text-gray-300 uppercase">No Files Uploaded</div>
              <p className="text-xs text-gray-500 font-inconsolata">
                This user has not uploaded any files or homework assignments to the Firestore database yet.
              </p>
            </div>
          ) : (
            /* LIST OF UPLOADED FILES */
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {userFiles.map((file) => (
                <div
                  key={file.id}
                  className="p-4 bg-[#141414] border border-[#2a2224] hover:border-[#710014] rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-[#710014]" />
                      <span className="font-bold text-xs text-[#F2F1ED] font-inconsolata">{file.fileName}</span>
                      <span className="text-[10px] bg-[#1e1e1e] text-[#B38F6F] px-2 py-0.5 rounded border border-[#2a2224] font-mono">
                        {file.fileType || 'File'}
                      </span>
                    </div>

                    <div className="text-[11px] text-gray-400 font-inconsolata">
                      {file.description}
                    </div>

                    <div className="flex items-center space-x-3 text-[10px] text-gray-500 font-mono pt-1">
                      <span>Uploaded: {file.uploadedAt}</span>
                      <span>•</span>
                      <span>Size: {file.fileSize || 'Unknown'}</span>
                    </div>
                  </div>

                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#710014] hover:bg-[#90001a] text-[#F2F1ED] font-heading text-[10px] uppercase font-bold tracking-wider rounded transition-all shadow-[0_0_10px_rgba(113,0,20,0.4)] flex items-center justify-center space-x-1.5 self-start sm:self-auto cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View / Open File</span>
                  </a>
                </div>
              ))}
            </div>
          )}

          <div className="pt-3 border-t border-[#2a2224] flex justify-end">
            <button
              type="button"
              onClick={() => setFilesModalOpen(false)}
              className="px-4 py-2 bg-[#141414] hover:bg-[#252535] text-gray-300 font-heading text-xs uppercase tracking-wider rounded-md cursor-pointer"
            >
              Close Drawer
            </button>
          </div>
        </div>
      </Modal>

      {/* LIVE USER ACTION AUDIT LOG SECTION */}
      <div className="bg-[#161616] border border-[#674846]/40 p-6 rounded-lg shadow-2xl backdrop-blur-md">
        <UserActionsAuditLog maxItems={5} title="Live User Actions Feed (Real-Time Student Activity)" />
        <div className="mt-4 pt-3 border-t border-[#674846]/40 flex justify-end">
          <Link to="/admin/students" className="font-inconsolata text-xs text-[#FFF8DC] hover:underline flex items-center space-x-1 font-bold">
            <span>View Full Roster & Student Activity Drawer</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#FFF8DC]" />
          </Link>
        </div>
      </div>

      {/* Quick Action Shortcuts Grid */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 border-b border-[#674846]/40 pb-2">
          <Shield className="w-5 h-5 text-[#FFF8DC]" />
          <h2 className="font-cornsilk text-xl font-normal text-[#FFF8DC] tracking-wide uppercase">
            Admin Management Hub Shortcuts
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/students"
            className="p-5 bg-[#161616] border border-[#674846]/40 hover:border-[#FFF8DC]/60 rounded-lg space-y-2 group transition-all backdrop-blur-md"
          >
            <div className="flex justify-between items-center">
              <Users className="w-6 h-6 text-[#FFF8DC]" />
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#FFF8DC] transition-colors" />
            </div>
            <h3 className="font-cornsilk text-lg font-normal text-[#FFF8DC] uppercase tracking-wide">
              Student Management
            </h3>
            <p className="text-xs text-gray-300 font-inconsolata">
              Manage student registrations, activate/deactivate accounts, inspect user action audit history, and assign XP.
            </p>
          </Link>

          <Link
            to="/admin/submissions"
            className="p-5 bg-[#161616] border border-[#674846]/40 hover:border-[#FFF8DC]/60 rounded-lg space-y-2 group transition-all backdrop-blur-md"
          >
            <div className="flex justify-between items-center">
              <FileCheck className="w-6 h-6 text-[#FFF8DC]" />
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#FFF8DC] transition-colors" />
            </div>
            <h3 className="font-cornsilk text-lg font-normal text-[#FFF8DC] uppercase tracking-wide">
              Submissions Review Queue ({pendingReviews.length})
            </h3>
            <p className="text-xs text-gray-300 font-inconsolata">
              Inspect GitHub repos and live demo apps submitted by students. Approve, reject, or request changes.
            </p>
          </Link>

          <Link
            to="/admin/modules"
            className="p-5 bg-[#161616] border border-[#674846]/40 hover:border-[#FFF8DC]/60 rounded-lg space-y-2 group transition-all backdrop-blur-md"
          >
            <div className="flex justify-between items-center">
              <BookOpen className="w-6 h-6 text-[#FFF8DC]" />
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#FFF8DC] transition-colors" />
            </div>
            <h3 className="font-cornsilk text-lg font-normal text-[#FFF8DC] uppercase tracking-wide">
              Learning Content CMS
            </h3>
            <p className="text-xs text-gray-300 font-inconsolata">
              Create, edit, publish, or unpublish Levels, Modules, Lessons, Notes markdown, and Video URLs.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};
