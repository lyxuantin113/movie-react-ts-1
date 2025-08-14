export default function VimeoEmbed() {
  return (
    <div className="w-full h-full aspect-video relative">
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src="https://player.vimeo.com/video/936554382?badge=0&autopause=0&player_id=0&app_id=58479"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        title="A Waste of Life"
        allowFullScreen
      />
    </div>
  );
}
