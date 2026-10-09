import React, { useState } from 'react'
import { Review, getReviewsByProductId } from '@/mocks/reviews'
import { Star, CheckCircle2, MessageSquarePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'

interface ReviewListProps {
  productId: string
  productRating: number
  reviewCount: number
}

export const ReviewList: React.FC<ReviewListProps> = ({
  productId,
  productRating,
  reviewCount,
}) => {
  const { currentUser, isLoggedIn } = useAuth()
  const { showToast } = useToast()

  const [reviews, setReviews] = useState<Review[]>(() => getReviewsByProductId(productId))
  const [modalOpen, setModalOpen] = useState(false)
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState('')
  const [authorName, setAuthorName] = useState(currentUser?.name || '')

  // Rating breakdown distribution (mock deterministic calculation)
  const ratingDistribution = [
    { stars: 5, percent: 78, count: Math.round(reviewCount * 0.78) },
    { stars: 4, percent: 16, count: Math.round(reviewCount * 0.16) },
    { stars: 3, percent: 4, count: Math.round(reviewCount * 0.04) },
    { stars: 2, percent: 1, count: Math.round(reviewCount * 0.01) },
    { stars: 1, percent: 1, count: Math.round(reviewCount * 0.01) },
  ]

  const handleOpenModal = () => {
    if (!isLoggedIn) {
      showToast({
        type: 'info',
        message: 'Bạn đang thao tác với tư cách khách mua hàng.',
      })
    }
    setModalOpen(true)
  }

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) {
      showToast({ type: 'error', message: 'Vui lòng nhập nội dung đánh giá.' })
      return
    }

    const createdReview: Review = {
      id: `rev-${Date.now()}`,
      productId,
      author: authorName.trim() || currentUser?.name || 'Khách hàng',
      rating: newRating,
      date: new Date().toLocaleDateString('vi-VN'),
      isVerified: true,
      content: newComment.trim(),
    }

    setReviews([createdReview, ...reviews])
    setNewComment('')
    setModalOpen(false)
    showToast({
      type: 'success',
      message: 'Cảm ơn bạn đã gửi đánh giá sản phẩm.',
    })
  }

  return (
    <div className="space-y-6">
      {/* Rating summary & distribution */}
      <div className="border border-line rounded-lg p-5 bg-surface grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Average Score */}
        <div className="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-line pb-4 md:pb-0 md:pr-6">
          <div className="text-3xl font-bold text-ink tabular-nums flex items-center justify-center md:justify-start gap-2">
            <span>{productRating.toFixed(1)}</span>
            <span className="text-sm font-normal text-ink-3">/ 5</span>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-1 text-warn my-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${
                  s <= Math.round(productRating) ? 'fill-warn text-warn' : 'text-stone-300'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-ink-3">
            Dựa trên {reviewCount} đánh giá từ khách hàng đã mua
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenModal}
            className="mt-3 w-full sm:w-auto"
          >
            <MessageSquarePlus className="w-3.5 h-3.5 mr-1.5" />
            Viết đánh giá
          </Button>
        </div>

        {/* Right: Star progress bars */}
        <div className="md:col-span-8 space-y-2">
          {ratingDistribution.map((item) => (
            <div key={item.stars} className="flex items-center gap-3 text-xs text-ink-2">
              <span className="w-12 text-right shrink-0 font-medium tabular-nums">
                {item.stars} sao
              </span>
              <div className="flex-1 h-2 bg-line rounded-full overflow-hidden">
                <div
                  className="h-full bg-warn rounded-full"
                  style={{ width: `${item.percent}%` }}
                />
              </div>
              <span className="w-10 text-right tabular-nums text-ink-3 shrink-0">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review items */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-ink">
          Nhận xét gần đây ({reviews.length})
        </h4>

        <div className="divide-y divide-line border border-line rounded-lg bg-surface">
          {reviews.map((r) => (
            <div key={r.id} className="p-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-ink">{r.author}</span>
                  {r.isVerified && (
                    <Badge variant="outline" className="text-xs text-ok border-ok/40 gap-1 py-0">
                      <CheckCircle2 className="w-3 h-3 text-ok" />
                      Đã mua hàng
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-ink-3 tabular-nums">{r.date}</span>
              </div>

              <div className="flex items-center gap-0.5 text-warn">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${
                      s <= r.rating ? 'fill-warn text-warn' : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>

              <p className="text-xs text-ink-2 leading-relaxed">{r.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Write review modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Đánh giá sản phẩm</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmitReview} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="author-name">Họ và tên của bạn</Label>
              <Input
                id="author-name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Lan Anh"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label>Đánh giá mức độ hài lòng</Label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setNewRating(star)}
                    className="p-1 transition-colors cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= newRating ? 'fill-warn text-warn' : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-xs font-medium text-ink">
                  {newRating === 5
                    ? 'Rất hài lòng'
                    : newRating === 4
                    ? 'Hài lòng'
                    : newRating === 3
                    ? 'Bình thường'
                    : newRating === 2
                    ? 'Chưa hài lòng'
                    : 'Rất tệ'}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="review-content">Nhận xét chi tiết</Label>
              <Textarea
                id="review-content"
                rows={4}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm về chất lượng nguyên liệu, độ nở, mùi vị hoặc quy cách giao hàng..."
                required
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Hủy
              </Button>
              <Button type="submit">Gửi nhận xét</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
