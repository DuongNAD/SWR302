import React, { createContext, useContext, useState } from 'react';
import { User } from '../types';
import { useToast } from './ToastContext';

interface AuthContextType {
  currentUser: User | null;
  role: 'customer' | 'wholesale_client' | 'staff' | 'admin';
  isLoggedIn: boolean;
  loginAs: (role: 'customer' | 'wholesale_client' | 'admin') => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  activeView: 'store' | 'admin';
  setActiveView: (view: 'store' | 'admin') => void;
}

const DEMO_USERS: Record<string, User> = {
  customer: {
    id: 'user-01',
    name: 'Trần Mai Anh',
    email: 'maianh.baker@gmail.com',
    phone: '0912 345 678',
    role: 'customer',
    addresses: [
      {
        id: 'addr-1',
        label: 'Nhà riêng',
        address: 'Số 42 Ngõ 178 Tây Sơn, Đống Đa, Hà Nội',
        isDefault: true
      },
      {
        id: 'addr-2',
        label: 'Xưởng bánh nhỏ',
        address: 'Tầng 2, 88 Hoàng Cầu, Đống Đa, Hà Nội',
        isDefault: false
      }
    ]
  },
  wholesale_client: {
    id: 'user-02',
    name: 'Lê Hoàng Tuấn',
    email: 'tuan.le@leparisienbakery.vn',
    phone: '0988 777 999',
    role: 'wholesale_client',
    businessName: 'Chuỗi Tiệm Bánh Le Parisien Bakery & Café',
    addresses: [
      {
        id: 'addr-3',
        label: 'Kho Trung Tâm',
        address: 'Lô B4 Cụm Công Nghiệp Từ Liêm, Bắc Từ Liêm, Hà Nội',
        isDefault: true
      }
    ]
  },
  admin: {
    id: 'user-03',
    name: 'Nguyễn Anh Dương',
    email: 'duong.admin@giahoaphat.com.vn',
    phone: '0904 123 456',
    role: 'admin',
    addresses: [
      {
        id: 'addr-admin',
        label: 'Văn Phòng Tổng Gia Hòa Phát',
        address: 'Tòa nhà GHP Supply, 120 Cầu Giấy, Hà Nội',
        isDefault: true
      }
    ]
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(DEMO_USERS.customer);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'store' | 'admin'>('store');
  const { showToast } = useToast();

  const loginAs = (role: 'customer' | 'wholesale_client' | 'admin') => {
    const user = DEMO_USERS[role];
    setCurrentUser(user);
    if (role === 'admin') {
      setActiveView('admin');
      showToast({
        type: 'success',
        message: `Chào mừng Quản trị viên: ${user.name}! Đã mở bảng điều khiển Admin.`
      });
    } else {
      setActiveView('store');
      showToast({
        type: 'success',
        message: `Đăng nhập thành công với vai trò: ${
          role === 'wholesale_client' ? 'Khách mua sỉ đại lý' : 'Thợ làm bánh tại gia'
        }!`
      });
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveView('store');
    showToast({
      type: 'info',
      message: 'Đã đăng xuất khỏi hệ thống Gia Hòa Phát.'
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || 'customer',
        isLoggedIn: !!currentUser,
        loginAs,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        activeView,
        setActiveView
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
