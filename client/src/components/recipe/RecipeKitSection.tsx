import React, { useState } from 'react';
import { ChefHat, Clock, Sparkles, Plus, Check, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import { RECIPE_BUNDLES } from '../../data/recipeBundles';
import { PRODUCTS } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export const RecipeKitSection: React.FC = () => {
  const [selectedBundleId, setSelectedBundleId] = useState<string>('bundle-tiramisu');
  const [checkedItemIds, setCheckedItemIds] = useState<Record<string, boolean>>({
    'prod-03': true,
    'prod-02': true,
    'prod-07': true,
    'prod-09': true
  });
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  const { addItem } = useCart();
  const { showToast } = useToast();

  const currentBundle = RECIPE_BUNDLES.find((b) => b.id === selectedBundleId) || RECIPE_BUNDLES[0];

  // Resolve products in current bundle
  const bundleProducts = currentBundle.itemIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as typeof PRODUCTS;

  // Toggle item selection in bundle
  const handleToggleItem = (id: string) => {
    setCheckedItemIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Switch bundle
  const handleSelectBundle = (bundleId: string) => {
    setSelectedBundleId(bundleId);
    const bundle = RECIPE_BUNDLES.find((b) => b.id === bundleId);
    if (bundle) {
      const initialChecked: Record<string, boolean> = {};
      bundle.itemIds.forEach((id) => {
        initialChecked[id] = true;
      });
      setCheckedItemIds(initialChecked);
    }
  };

  // Calculate selected total
  const selectedProducts = bundleProducts.filter((p) => checkedItemIds[p.id]);
  const bundleTotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);

  // Add all selected to cart
  const handleAddBundleToCart = () => {
    if (selectedProducts.length === 0) {
      showToast({ type: 'error', message: 'Vui lòng chọn ít nhất một nguyên liệu trong bộ combo!' });
      return;
    }
    selectedProducts.forEach((p) => addItem(p, 1));
    showToast({
      type: 'success',
      message: `Đã thêm ${selectedProducts.length} nguyên liệu cho món "${currentBundle.name}" vào giỏ hàng!`
    });
  };

  return (
    <section className="bg-linear-to-b from-amber-50/50 to-white rounded-3xl border border-[#EFE4D6] p-6 sm:p-8 shadow-xs space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-[#92400E] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tiện ích độc quyền cho Thợ làm bánh</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2B1D14]">
            Bộ Combo Nguyên Liệu Theo Món Bánh
          </h2>
          <p className="text-sm text-[#6B5B4E] mt-1 max-w-2xl">
            Tự tin trổ tài làm bánh tại nhà chuẩn vị nhà hàng. Mua trọn bộ nguyên liệu theo định lượng chuẩn, có thể bỏ chọn những thứ bạn đã có sẵn ở nhà.
          </p>
        </div>

        {/* Recipe Switcher Tabs */}
        <div className="flex flex-wrap gap-2">
          {RECIPE_BUNDLES.map((bundle) => {
            const isSelected = bundle.id === currentBundle.id;
            return (
              <button
                key={bundle.id}
                type="button"
                onClick={() => handleSelectBundle(bundle.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#92400E] text-white shadow-md'
                    : 'bg-white text-stone-700 hover:bg-[#FEF3E2] border border-[#EFE4D6]'
                }`}
              >
                {bundle.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Bundle Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-2xl border border-[#EFE4D6] p-6 shadow-sm">
        {/* Left: Recipe Visual & Metadata (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-16/10 rounded-2xl overflow-hidden border border-[#EFE4D6]">
            <img
              src={currentBundle.imageUrl}
              alt={currentBundle.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-[#2B1D14]/85 text-white backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
              <ChefHat className="w-3.5 h-3.5 text-amber-300" />
              <span>Độ khó: {currentBundle.difficulty}</span>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-[#2B1D14]">{currentBundle.name}</h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              {currentBundle.description}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-stone-500 pt-2 border-t border-[#EFE4D6]">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#92400E]" />
              <span>{currentBundle.prepTime}</span>
            </div>
            <div>•</div>
            <div>Khẩu phần: <strong>{currentBundle.servings}</strong></div>
          </div>

          {/* Toggle Step-by-Step Instructions */}
          <div>
            <button
              type="button"
              onClick={() => setIsInstructionsOpen(!isInstructionsOpen)}
              className="w-full py-2.5 px-4 bg-[#FFFBF5] hover:bg-[#FEF3E2] text-[#92400E] border border-[#EFE4D6] rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>Xem hướng dẫn làm từng bước ({currentBundle.instructions.length} bước)</span>
              {isInstructionsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isInstructionsOpen && (
              <div className="mt-3 p-4 bg-amber-50/50 rounded-xl border border-amber-200/60 text-xs text-stone-700 space-y-2.5 animate-in fade-in duration-200">
                {currentBundle.instructions.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#92400E] text-white shrink-0 flex items-center justify-center font-bold text-2xs">
                      {idx + 1}
                    </span>
                    <p className="leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Ingredient Checklist & Add to Cart (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE4D6]">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#6B5B4E]">
                Danh sách nguyên liệu trong combo:
              </span>
              <span className="text-xs text-stone-500">
                Đã chọn {selectedProducts.length}/{bundleProducts.length} món
              </span>
            </div>

            {/* Checklist */}
            <div className="divide-y divide-stone-100 mt-2 space-y-2">
              {bundleProducts.map((product) => {
                const isChecked = !!checkedItemIds[product.id];
                return (
                  <div
                    key={product.id}
                    onClick={() => handleToggleItem(product.id)}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer select-none ${
                      isChecked
                        ? 'bg-[#FFFBF5] border border-amber-200/80 shadow-2xs'
                        : 'bg-stone-50/70 border border-transparent opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                          isChecked
                            ? 'bg-[#92400E] text-white'
                            : 'border-2 border-stone-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-11 h-11 object-cover rounded-lg border border-[#EFE4D6]"
                      />

                      <div>
                        <h4 className="text-xs font-bold text-[#2B1D14] line-clamp-1">
                          {product.name}
                        </h4>
                        <p className="text-2xs text-stone-500">
                          {product.unit} • {product.brand}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-[#92400E]">
                        {product.price.toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-[#EFE4D6] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFBF5] p-4 rounded-xl">
            <div>
              <span className="block text-2xs uppercase tracking-wider text-stone-500 font-bold">
                Tổng thanh toán combo:
              </span>
              <span className="text-2xl font-black text-[#92400E]">
                {bundleTotal.toLocaleString('vi-VN')}₫
              </span>
            </div>

            <button
              type="button"
              onClick={handleAddBundleToCart}
              className="py-3 px-6 bg-[#92400E] hover:bg-[#78350F] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Thêm {selectedProducts.length} nguyên liệu vào giỏ</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
