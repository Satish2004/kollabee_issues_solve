import Image from "next/image";

interface ThumbnailProps {
  images: string[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function ThumbnailNav({
  images,
  activeIndex,
  onSelect,
}: ThumbnailProps) {
  return (
    <div className="flex flex-col gap-2 p-2">
      {images.map((image, index) => (
        <button
          key={image}
          onClick={() => onSelect(index)}
          className={`relative w-16 h-16 border-2 rounded overflow-hidden
            ${activeIndex === index ? "border-primary" : "border-transparent"}`}
        >
          <Image
            src={image}
            alt={`Product view ${index + 1}`}
            fill
            className="object-cover"
          />
        </button>
      ))}
      {/* <button className="relative w-16 h-16 border rounded overflow-hidden">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Aman__3E_KollaBee_V.1-pz3a261FSpr6oy02zIsALkBbGWpOC2.png"
          alt="Size guide"
          fill
          className="object-cover"
        />
      </button>
      <button className="relative w-16 h-16 border rounded overflow-hidden">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Aman__3E_KollaBee_V.1-pz3a261FSpr6oy02zIsALkBbGWpOC2.png"
          alt="Logo customization"
          fill
          className="object-cover"
        />
      </button> */}
    </div>
  );
}
