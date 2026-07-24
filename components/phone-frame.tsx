import Image from "next/image";

type PhoneFrameProps = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
};

export function PhoneFrame({
  src,
  alt,
  priority = false,
  className = "",
}: PhoneFrameProps) {
  return (
    <div className={`phone ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={780}
        height={1688}
        priority={priority}
        sizes="(max-width: 640px) 66vw, 320px"
      />
    </div>
  );
}
