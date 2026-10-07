import Image from "next/image";

type ChurchLogoProps = {
  size?: number;
  alt?: string;
  className?: string;
  priority?: boolean;
};

export function ChurchLogo({ size = 40, alt = "", className = "", priority = false }: ChurchLogoProps) {
  return <Image
    alt={alt}
    className={className}
    height={size}
    priority={priority}
    src="/logo-c.png"
    width={size}
  />;
}
