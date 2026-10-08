import React, { useState } from 'react';
import {
  Package,
  TrendingUp,
  AlertTriangle,
  Snowflake,
  ShoppingBag,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Plus,
  ArrowUpRight,
  ShieldAlert,
  Building
} from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { Order, OrderStatus, Product } from '../../types';
import { StorageBadge } from '../common/Badge';
import { useToast } from '../../context/ToastContext';

interface AdminDashboardProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onBackToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  onUpdateOrderStatus,
  onBackToStore
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'cold-alerts'>('orders');
  const [searchOrderQuery, setSearchOrderQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);
  const { showToast } = useToast();

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0) + 148500000;
  const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'confirmed').length;
  const coldChainOrders = orders.filter((o) => o.requiresColdChain).length;
  const lowStockCount = productsList.filter((p) => p.stockQty <= p.lowStockThreshold).length;

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchQuery =
      o.orderNumber.toLowerCase().includes(searchOrderQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchOrderQuery.toLowerCase());
    const matchStatus = selectedStatusFilter === 'all' || o.status === selectedStatusFilter;
    return matchQuery && matchStatus;
  });

  const handleQuickStockUpdate = (productId: string, delta: number) => {
    setProductsList((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newQty = Math.max(0, p.stockQty + delta);
          return { ...p, stockQty: newQty, inStock: newQty > 0 };
        }
        return p;
      })
    );
    showToast({ type: 'success', message: 'Đã cập nhật số lượng tồn kho thành công!' });
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#2B1D14] p-4 sm:p-8 space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EFE4D6] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-[#92400E] text-2xs font-extrabold uppercase tracking-wider">
              Phân Hệ Quản Trị & Kho Vận (SWR302 FR-ADM-08)
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#2B1D14] mt-1">
            Gia Hòa Phát — Trung Tâm Điều Hành Kho & Đơn Hàng
          </h1>
          <p className="text-xs text-stone-500">
            Giám sát thời gian thực chuỗi cung ứng lạnh, tồn kho nguyên liệu và xử lý đơn sỉ/lẻ
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToStore}
          className="py-2.5 px-5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
        >
          ← Trở lại giao diện Khách Hàng
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-[#EFE4D6] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
            <span>Tổng Doanh Thu Tháng</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#2B1D14] font-mono">
            {totalRevenue.toLocaleString('vi-VN')}₫
          </div>
          <div className="text-2xs text-emerald-700 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% so với tháng trước
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-[#EFE4D6] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
            <span>Đơn Cần Xử Lý</span>
            <div className="p-2 rounded-xl bg-amber-50 text-[#92400E]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#92400E] font-mono">
            {pendingOrders} đơn
          </div>
          <div className="text-2xs text-amber-800 font-semibold">
            Bao gồm {coldChainOrders} đơn yêu cầu xe lạnh
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-[#EFE4D6] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
            <span>Cảnh Báo Tồn Kho Thấp</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 font-mono">
            {lowStockCount} mặt hàng
          </div>
          <div className="text-2xs text-rose-700 font-semibold">
            Cần bổ sung nguồn bột mì & men nở
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-[#EFE4D6] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
            <span>Đơn Vận Chuyển Xe Lạnh</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Snowflake className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-sky-800 font-mono">
            {coldChainOrders} chuyến xe
          </div>
          <div className="text-2xs text-sky-700 font-semibold">
            Nhiệt kế thùng lạnh ổn định 2-4°C
          </div>
        </div>
      </div>

      {/* Tabs Control */}
      <div className="flex gap-2 border-b border-[#EFE4D6] bg-white p-2 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-[#92400E] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-50'
          }`}
        >
          Xử Lý Đơn Hàng ({orders.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inventory')}
          className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'inventory'
              ? 'bg-[#92400E] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-50'
          }`}
        >
          Quản Lý Kho & Giá Sỉ ({productsList.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cold-alerts')}
          className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'cold-alerts'
              ? 'bg-sky-700 text-white shadow-xs'
              : 'text-sky-900 bg-sky-50 hover:bg-sky-100'
          }`}
        >
          <Snowflake className="w-3.5 h-3.5" />
          <span>Giám Sát Chuỗi Lạnh & Hạn Dùng</span>
        </button>
      </div>

      {/* Tab 1: Orders Management */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-[#EFE4D6] p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                value={searchOrderQuery}
                onChange={(e) => setSearchOrderQuery(e.target.value)}
                placeholder="Tìm mã đơn (#GHP...), tên khách hàng..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-[#EFE4D6] rounded-xl focus:outline-none focus:border-[#92400E]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-stone-400" />
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="text-xs bg-stone-50 border border-[#EFE4D6] rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="packing">Đang đóng gói</option>
                <option value="shipping">Đang giao xe lạnh</option>
                <option value="delivered">Đã hoàn thành</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FFFBF5] text-stone-700 font-bold border-b border-[#EFE4D6]">
                  <th className="p-3">Mã Đơn</th>
                  <th className="p-3">Khách Hàng</th>
                  <th className="p-3">Sản Phẩm & Quy Cách</th>
                  <th className="p-3">Vận Chuyển</th>
                  <th className="p-3">Tổng Tiền</th>
                  <th className="p-3">Trạng Thái Đơn</th>
                  <th className="p-3 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE4D6]">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-stone-400">
                      Không tìm thấy đơn hàng nào phù hợp với bộ lọc.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="p-3 font-mono font-bold text-[#92400E]">
                        #{ord.orderNumber}
                        <span className="block text-3xs font-normal text-stone-400 font-sans mt-0.5">
                          {ord.createdAt}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-[#2B1D14]">{ord.customerName}</div>
                        <div className="text-2xs text-stone-500">{ord.customerPhone}</div>
                        <div className="text-3xs text-stone-400 truncate max-w-48">{ord.shippingAddress}</div>
                      </td>

                      <td className="p-3">
                        <span className="font-semibold">{ord.items.length} mặt hàng</span>
                        <div className="text-2xs text-stone-500 line-clamp-1">
                          {ord.items.map((i) => i.productName).join(', ')}
                        </div>
                      </td>

                      <td className="p-3">
                        {ord.requiresColdChain ? (
                          <span className="inline-flex items-center gap-1 text-2xs font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                            <Snowflake className="w-3 h-3" /> Xe Lạnh 2-4h
                          </span>
                        ) : (
                          <span className="text-2xs text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                            Tiêu chuẩn
                          </span>
                        )}
                      </td>

                      <td className="p-3 font-mono font-bold text-[#92400E]">
                        {ord.totalAmount.toLocaleString('vi-VN')}₫
                      </td>

                      <td className="p-3">
                        <select
                          value={ord.status}
                          onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className={`text-2xs font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                            ord.status === 'confirmed'
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : ord.status === 'packing'
                              ? 'bg-purple-100 text-purple-900 border-purple-300'
                              : ord.status === 'shipping'
                              ? 'bg-sky-100 text-sky-900 border-sky-300'
                              : ord.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : 'bg-stone-100 text-stone-700 border-stone-300'
                          }`}
                        >
                          <option value="pending">Chờ xác nhận</option>
                          <option value="confirmed">Đã xác nhận</option>
                          <option value="packing">Đang đóng gói lạnh</option>
                          <option value="shipping">Đang giao xe lạnh</option>
                          <option value="delivered">Đã giao thành công</option>
                          <option value="cancelled">Hủy đơn</option>
                        </select>
                      </td>

                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateOrderStatus(ord.id, 'shipping');
                            showToast({ type: 'success', message: `Đã xuất kho đơn #${ord.orderNumber} cho tài xế xe lạnh!` });
                          }}
                          className="px-2.5 py-1 bg-[#92400E] text-white text-3xs font-bold rounded-lg hover:bg-[#78350F] transition-colors cursor-pointer"
                        >
                          Bàn giao xe lạnh
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Inventory Management */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-[#EFE4D6] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EFE4D6]">
            <div>
              <h3 className="font-bold text-sm text-[#2B1D14]">Danh Mục Tồn Kho & Quản Lý Lô Hàng</h3>
              <p className="text-2xs text-stone-500">Cập nhật số lượng khả dụng và theo dõi hạn sử dụng nguyên liệu</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FFFBF5] text-stone-700 font-bold border-b border-[#EFE4D6]">
                  <th className="p-3">Sản Phẩm & SKU</th>
                  <th className="p-3">Danh Mục</th>
                  <th className="p-3">Bảo Quản</th>
                  <th className="p-3">Hạn Dùng / Lô</th>
                  <th className="p-3">Giá Lẻ / Giá Sỉ</th>
                  <th className="p-3">Tồn Kho Hiện Tại</th>
                  <th className="p-3 text-right">Điều Chỉnh Kho</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE4D6]">
                {productsList.map((prod) => (
                  <tr key={prod.id} className="hover:bg-amber-50/20">
                    <td className="p-3 flex items-center gap-3">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-10 h-10 object-cover rounded-lg border border-[#EFE4D6]"
                      />
                      <div>
                        <div className="font-bold text-[#2B1D14] line-clamp-1">{prod.name}</div>
                        <div className="text-3xs font-mono text-stone-400">{prod.sku} • {prod.brand}</div>
                      </div>
                    </td>

                    <td className="p-3 text-stone-600">{prod.categoryName}</td>

                    <td className="p-3">
                      <StorageBadge condition={prod.storageCondition} />
                    </td>

                    <td className="p-3">
                      <span className="font-bold text-stone-800">{prod.expiryDate}</span>
                      <span className="block text-3xs font-mono text-stone-400">{prod.batchNumber}</span>
                    </td>

                    <td className="p-3">
                      <span className="font-bold text-[#92400E] font-mono">
                        {prod.price.toLocaleString('vi-VN')}₫
                      </span>
                      {prod.wholesaleTiers && prod.wholesaleTiers.length > 1 && (
                        <span className="block text-3xs text-emerald-700 font-semibold">
                          Sỉ: {prod.wholesaleTiers[prod.wholesaleTiers.length - 1].price.toLocaleString('vi-VN')}₫
                        </span>
                      )}
                    </td>

                    <td className="p-3">
                      <span
                        className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                          prod.stockQty <= prod.lowStockThreshold
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {prod.stockQty} {prod.unit}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleQuickStockUpdate(prod.id, -10)}
                          className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-3xs font-bold cursor-pointer"
                        >
                          -10
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickStockUpdate(prod.id, +25)}
                          className="px-2 py-1 bg-[#92400E] hover:bg-[#78350F] text-white rounded text-3xs font-bold cursor-pointer"
                        >
                          +25 nhập kho
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Cold Chain & Expiration Monitoring */}
      {activeTab === 'cold-alerts' && (
        <div className="bg-white rounded-2xl border border-[#EFE4D6] p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#EFE4D6]">
            <div>
              <h3 className="font-bold text-base text-sky-950 flex items-center gap-2">
                <Snowflake className="w-5 h-5 text-sky-600" />
                <span>Hệ Thống Giám Sát Chuỗi Cung Ứng Lạnh Gia Hòa Phát</span>
              </h3>
              <p className="text-xs text-stone-500">
                Tuân thủ nghiêm ngặt tiêu chuẩn bảo quản bơ động vật và kem sữa tươi không bị tách nước hay chua men
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 space-y-2">
              <h4 className="text-xs font-bold text-sky-900 uppercase">Kho Lạnh Trung Tâm (Hà Nội)</h4>
              <div className="text-3xl font-black text-sky-800 font-mono">3.4°C</div>
              <p className="text-2xs text-sky-700">Trạng thái: Hoạt động tối ưu (Độ ẩm 65%)</p>
            </div>

            <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 space-y-2">
              <h4 className="text-xs font-bold text-sky-900 uppercase">Đội Xe Tải Lạnh (3 Xe Hoạt Động)</h4>
              <div className="text-3xl font-black text-sky-800 font-mono">2.8°C</div>
              <p className="text-2xs text-sky-700">GPS & Cảm biến nhiệt gửi tín hiệu mỗi 60 giây</p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
              <h4 className="text-xs font-bold text-amber-900 uppercase">Kho Đá Gel & Thùng Cách Nhiệt</h4>
              <div className="text-3xl font-black text-amber-800 font-mono">450 bộ</div>
              <p className="text-2xs text-amber-700">Sẵn sàng phục vụ đơn hàng hỏa tốc trong ngày</p>
            </div>
          </div>

          {/* Critical Expiring Batches Table */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-stone-700 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Lô Hàng Cần Ưu Tiên Xuất Kho Trong Tháng (FIFO Rule):</span>
            </h4>

            <div className="border border-[#EFE4D6] rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#FFFBF5] text-stone-700 font-bold border-b border-[#EFE4D6]">
                  <tr>
                    <th className="p-3">Sản Phẩm</th>
                    <th className="p-3">Mã Lô Hàng</th>
                    <th className="p-3">Hạn Sử Dụng</th>
                    <th className="p-3">Số Lượng Còn Lại</th>
                    <th className="p-3">Khuyến Nghị Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE4D6]">
                  <tr className="bg-amber-50/40">
                    <td className="p-3 font-bold text-stone-800">Kem Tươi Tatua Dairy Cream 1L</td>
                    <td className="p-3 font-mono">LOT-TAT2604</td>
                    <td className="p-3 text-rose-600 font-bold">12/10/2026</td>
                    <td className="p-3 font-mono font-bold">95 hộp</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded font-semibold text-3xs">
                        Kích hoạt Flash Sale giảm 15%
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-stone-800">Phô Mai Mascarpone Tatua 500g</td>
                    <td className="p-3 font-mono">LOT-MASC26-9</td>
                    <td className="p-3 text-amber-700 font-bold">05/11/2026</td>
                    <td className="p-3 font-mono font-bold">48 hộp</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-sky-100 text-sky-900 rounded font-semibold text-3xs">
                        Ghép vào Combo Tiramisu
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-stone-800">Bơ Lạt Anchor 227g</td>
                    <td className="p-3 font-mono">LOT-NZ2026-88B</td>
                    <td className="p-3 text-stone-700 font-bold">28/11/2026</td>
                    <td className="p-3 font-mono font-bold">180 thỏi</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded font-semibold text-3xs">
                        Đang bán chạy bình thường
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
