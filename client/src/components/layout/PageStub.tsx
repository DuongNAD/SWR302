import React from 'react'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const PageStub: React.FC<{ code: string; title: string; description?: string }> = ({
  code,
  title,
  description,
}) => {
  useDocumentTitle(title)
  return (
    <div className="wrap py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">{code}</Badge>
            <span className="text-xs text-ink-3">Màn hình nguyên mẫu</span>
          </div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-ink-2">
            Nội dung chi tiết của màn hình này đang được thiết lập theo đặc tả nghiệp vụ Topic 1.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
