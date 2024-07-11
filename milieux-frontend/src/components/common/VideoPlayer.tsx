const VideoPlayer = ({
  src,
  className,
  width,
  controls,
  autoPlay,
}: {
  src: string;
  className?: string;
  width: number;
  controls: boolean;
  autoPlay: boolean;
}) => {
  return (
    <div className={className}>
      <video
        width={width}
        controls={controls}
        height={0}
        className="rounded-lg h-full w-full object-cover"
        autoPlay={autoPlay}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
