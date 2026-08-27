import type { SyntheticEvent } from "react";

interface AvatarProps {
  className?: string;
  image: string;
  username: string;
}

const defaultAvatar = `${process.env.PUBLIC_URL}/default-avatar.svg`;

export default function Avatar({ className, image, username }: AvatarProps): JSX.Element {
  const handleImageError = (event: SyntheticEvent<HTMLImageElement>): void => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = defaultAvatar;
  };

  return (
    <img alt={`${username}'s avatar`} className={className} onError={handleImageError} src={image || defaultAvatar} />
  );
}
