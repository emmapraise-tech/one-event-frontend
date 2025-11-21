import { Building2, Camera, Utensils, Music, Sparkles, PartyPopper } from "lucide-react"
import { cn } from "@/lib/utils"

interface ListingImageProps {
  src?: string | null
  alt?: string
  className?: string
  type?: string
}

export function ListingImage({
  src,
  alt = "Venue image",
  className,
  type,
}: ListingImageProps) {
  // Get icon and gradient colors based on listing type
  const getTypeConfig = () => {
    const configs: Record<string, { icon: typeof Building2; fromColor: string; toColor: string }> = {
      VENUE: {
        icon: Building2,
        fromColor: "var(--primary-blue-100)",
        toColor: "var(--primary-blue-500)",
      },
      PHOTOGRAPHER: {
        icon: Camera,
        fromColor: "var(--accent-purple-100)",
        toColor: "var(--accent-purple-500)",
      },
      CATERING: {
        icon: Utensils,
        fromColor: "var(--secondary-gold-100)",
        toColor: "var(--secondary-gold-500)",
      },
      ENTERTAINMENT: {
        icon: Music,
        fromColor: "var(--accent-purple-100)",
        toColor: "var(--primary-blue-500)",
      },
      DECOR: {
        icon: Sparkles,
        fromColor: "var(--secondary-gold-100)",
        toColor: "var(--accent-purple-500)",
      },
      OTHER: {
        icon: PartyPopper,
        fromColor: "var(--primary-blue-100)",
        toColor: "var(--accent-purple-100)",
      },
    }
    return configs[type || "VENUE"] || configs.OTHER
  }

  const config = getTypeConfig()
  const Icon = config.icon

  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Hide image and show placeholder on error
            const target = e.target as HTMLImageElement
            target.style.display = "none"
            const placeholder = target.nextElementSibling as HTMLElement
            if (placeholder) {
              placeholder.style.display = "flex"
            }
          }}
        />
      ) : null}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center",
          src ? "hidden" : "flex"
        )}
        style={{
          background: `linear-gradient(to bottom right, ${config.fromColor}, ${config.toColor})`,
        }}
      >
        <div className="text-center">
          <Icon
            className="h-12 w-12 mx-auto mb-2"
            style={{ color: "var(--primary-blue-500)" }}
          />
          <span className="caption text-neutral-600">Event Space</span>
        </div>
      </div>
    </div>
  )
}

