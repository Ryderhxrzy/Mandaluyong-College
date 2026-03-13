export interface ApplyLocationMapProps {
  embedUrl?: string
  title?: string
}

export default function ApplyLocationMap({
  embedUrl = 'https://www.google.com/maps/embed?pb=!4v1754211980746!6m8!1m7!1sCaLoGEj9IdCMcv0fA2d-Nw!2m2!1d14.58445422793973!2d121.0350214413535!3f235.9863274654789!4f5.327640846470601!5f0.7820865974627469',
  title = 'Mandaluyong College of Science and Technology',
}: ApplyLocationMapProps) {
  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        allow="fullscreen"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
      />
    </div>
  )
}
