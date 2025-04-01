export interface VideoProps {
  videoURL: string;
  playStatus: boolean;
  loop: boolean;
  className?: string;
  muted?: boolean;
  controls?: boolean;
}
