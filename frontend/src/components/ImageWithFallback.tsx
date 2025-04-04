import noImage from "../assets/noImage.png"; // Placeholder image for when the profile image fails to load

const ImageWithFallback = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        (e.target as HTMLImageElement).src = noImage; // Fallback to placeholder image if the original fails to load
      }}
    />
  );
};

export default ImageWithFallback;
