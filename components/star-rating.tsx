import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

export function StarRating({ rating, size = "md", showLabel = false }: StarRatingProps) {
  const sizeMap = {
    sm: 16,
    md: 20,
    lg: 24,
  }

  const starSize = sizeMap[size]

  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => {
          const fillPercentage = Math.min(Math.max(rating - i + 1, 0), 1)
          const isFilled = fillPercentage === 1
          const isPartial = fillPercentage > 0 && fillPercentage < 1

          return (
            <div key={i} className="relative" style={{ width: starSize, height: starSize }}>
              <Star size={starSize} className="absolute text-gray-300" />
              {(isFilled || isPartial) && (
                <div className="absolute overflow-hidden" style={{ width: `${fillPercentage * 100}%` }}>
                  <Star size={starSize} className="fill-yellow-400 text-yellow-400" />
                </div>
              )}
            </div>
          )
        })}
      </div>
      {showLabel && <span className="ml-2 font-semibold text-foreground">{rating.toFixed(1)}/5</span>}
    </div>
  )
}
