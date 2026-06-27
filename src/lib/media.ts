export type MediaValue =
  | number
  | string
  | null
  | undefined
  | {
      alt?: string | null
      filename?: string | null
      height?: number | null
      mimeType?: string | null
      title?: string | null
      url?: string | null
      width?: number | null
      sizes?: Record<
        string,
        {
          height?: number | null
          url?: string | null
          width?: number | null
        }
      > | null
    }

export type MediaInfo = {
  alt: string
  height?: number
  mimeType?: string
  url: string
  width?: number
}

export function getMediaInfo(media: MediaValue, preferredSize?: string): MediaInfo | null {
  if (!media || typeof media === 'number') return null
  if (typeof media === 'string') return { url: media, alt: '', width: undefined, height: undefined }

  const sized = preferredSize && media.sizes ? media.sizes[preferredSize] : null
  const url = sized?.url || media.url || (media.filename ? `/api/media/file/${media.filename}` : '')
  if (!url) return null

  return {
    url,
    alt: media.alt || media.title || '',
    width: sized?.width || media.width || undefined,
    height: sized?.height || media.height || undefined,
    mimeType: media.mimeType || undefined,
  }
}
