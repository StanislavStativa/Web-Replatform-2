/**
 * A React component that renders a video player with customizable properties.
 *
 * @param videoURL - The URL of the video to be played.
 * @param playStatus - A boolean indicating whether the video should be playing or not.
 * @param loop - A boolean indicating whether the video should loop.
 * @param className - An optional CSS class name to be applied to the video player.
 * @param muted - A boolean indicating whether the video should be muted.
 * @param controls - A boolean indicating whether the video player controls should be displayed.
 */

import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { type VideoProps } from './Video.type';

const Video: React.FC<VideoProps> = ({
  videoURL,
  playStatus,
  loop,
  className,
  muted,
  controls,
}) => {
  const [hasWindow, setHasWindow] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasWindow(true);
    }
  }, []);

  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    const attachContextMenuHandler = () => {
      const videoElement = playerRef.current?.getInternalPlayer() as HTMLVideoElement;
      if (videoElement) {
        videoElement.addEventListener('contextmenu', handleContextMenu);
      }
    };

    const detachContextMenuHandler = () => {
      const videoElement = playerRef.current?.getInternalPlayer() as HTMLVideoElement;
      if (videoElement) {
        videoElement.removeEventListener('contextmenu', handleContextMenu);
      }
    };

    attachContextMenuHandler();

    return () => {
      detachContextMenuHandler();
    };
  }, [hasWindow]);

  return (
    <>
      {hasWindow ? (
        <ReactPlayer
          ref={playerRef}
          url={videoURL}
          playing={playStatus}
          loop={loop}
          muted={muted ?? true}
          width="100%"
          height="100%"
          controls={controls ?? false}
          className={className}
          config={{
            file: {
              attributes: {
                controlsList: 'nodownload', // Disable download button
                playsInline: true, // Allow inline playback on iOS
              },
            },
          }}
        />
      ) : null}
    </>
  );
};

export default Video;
