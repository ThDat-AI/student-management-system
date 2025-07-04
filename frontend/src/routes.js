import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import AuthGuard from './components/AuthGuard';

// Sử dụng lazy loading để tối ưu hiệu suất
const StudentManagement = lazy(() => import('./pages/GiaoVu/StudentManagement'));
const StudentSearch = lazy(() => import('./pages/GiaoVien/StudentSearch'));

const routes = [
  {
    path: '/giaovu/hoc-sinh',
    element: (
      <AuthGuard roles={['giaovu']}>
        <StudentManagement />
      </AuthGuard>
    ),
  },
  {
    path: '/giaovien/tra-cuu-hoc-sinh',
    element: (
      <AuthGuard roles={['giaovien']}>
        <StudentSearch />
      </AuthGuard>
    ),
  },
];

export default routes;