import React from 'react';
import { X, CheckCircle2, ShieldCheck, FileCheck2, Sparkles, BookOpen } from 'lucide-react';
import { SWR_REQUIREMENTS } from '../../data/swrRequirements';

interface SWRMatrixDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SWRMatrixDrawer: React.FC<SWRMatrixDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="matrix-title"
      className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-white rounded-3xl border border-[#EFE4D6] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 bg-[#2B1D14] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500 text-stone-950 font-black text-3xs uppercase tracking-wider">
                  SWR302 Course Standard
                </span>
                <span className="text-2xs text-amber-200">ISO/IEC/IEEE 29148 & Alistair Cockburn</span>
              </div>
              <h2 id="matrix-title" className="text-lg font-black mt-0.5">
                Ma Trận Truy Vết Yêu Cầu Đồ Án (SWR302 Requirements Matrix)
              </h2>
              <p className="text-2xs text-stone-300">
                Topic 1 — Hệ Thống Mua Sắm Nguyên Liệu & Thiết Bị Làm Bánh Trực Tuyến (Gia Hoa Phat Bakery Supply)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng bảng ma trận"
            className="p-2 text-stone-400 hover:text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Matrix Table Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/80 text-xs text-amber-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Toàn bộ các yêu cầu chức năng (FR), phi chức năng (NFR) và quy tắc nghiệp vụ (BR) của đề tài Topic 1 đã được xây dựng hoàn chỉnh trên giao diện Client.
              </span>
            </div>
            <span className="font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full text-3xs uppercase shrink-0">
              100% Hoàn Thiện
            </span>
          </div>

          <div className="border border-[#EFE4D6] rounded-2xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FFFBF5] text-stone-700 font-bold border-b border-[#EFE4D6]">
                  <th className="p-3">Mã Yêu Cầu</th>
                  <th className="p-3">Tên & Phân Loại</th>
                  <th className="p-3">Mô Tả Tiêu Chuẩn</th>
                  <th className="p-3">Minh Chứng Trực Tiếp Trên Client</th>
                  <th className="p-3 text-center">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE4D6]">
                {SWR_REQUIREMENTS.map((req) => (
                  <tr key={req.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#92400E] shrink-0">
                      {req.id}
                      <span className="block text-3xs font-semibold text-stone-500 uppercase">
                        {req.priority}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-[#2B1D14]">{req.name}</div>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-3xs font-bold uppercase tracking-wider bg-stone-100 text-stone-700">
                        {req.type === 'FR' ? 'Chức năng (FR)' : req.type === 'NFR' ? 'Phi chức năng (NFR)' : 'Quy tắc (BR)'}
                      </span>
                    </td>

                    <td className="p-3 text-stone-600 leading-relaxed max-w-xs">
                      {req.description}
                    </td>

                    <td className="p-3 font-medium text-amber-900 bg-amber-50/40 rounded-lg">
                      {req.verifiedInClient}
                    </td>

                    <td className="p-3 text-center">
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100/70 font-bold px-2 py-0.5 rounded-full text-3xs">
                        <CheckCircle2 className="w-3 h-3" /> Đạt
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EFE4D6] bg-[#FFFBF5] flex items-center justify-between text-xs text-stone-600">
          <span>Tài liệu SRS chuẩn hóa IEEE Std 830 được lưu trữ trong thư mục <code>docs/</code> của đồ án.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#92400E] text-white font-bold rounded-xl text-xs hover:bg-[#78350F] cursor-pointer"
          >
            Đóng bảng truy vết
          </button>
        </div>
      </div>
    </div>
  );
};
