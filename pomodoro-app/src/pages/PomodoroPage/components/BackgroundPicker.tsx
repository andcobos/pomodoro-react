import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BackgroundPicker({
  images,
  selected,
  onSelect,
  onUpload,
}: {
  images: string[];
  selected: string | null;
  onSelect: (url: string) => void;
  onUpload: (file: File) => void;
}) {
  return (
    <div className="space-y-4">
      <Label className="text-gray-700 font-medium block">Default Images</Label>
      <div className="flex gap-4 mb-2">
        {images.map((img) => (
          <img
            key={img}
            src={img}
            alt="background option"
            onClick={() => onSelect(img)}
            className={`w-20 h-14 rounded-lg cursor-pointer border-2 object-cover ${
              selected === img ? "border-blue-500" : "border-transparent"
            }`}
          />
        ))}
      </div>

      <Label className="text-gray-700 font-medium block">Upload Image</Label>
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onUpload(f);
        }}
      />
    </div>
  );
}
