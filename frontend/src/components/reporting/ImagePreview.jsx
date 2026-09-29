// ImagePreview — a thumbnail preview of an evidence image.

export default function ImagePreview({ src, alt = 'Evidence' }) {
  return (
    <div className="image-preview">
      <img src={src} alt={alt} />
    </div>
  )
}