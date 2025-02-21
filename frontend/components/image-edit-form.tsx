import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';

export default function ImageEditForm({
  propsSetDetailsUrl,
  initialDetailUrls = [],
}: {
  propsSetDetailsUrl: (v: string[]) => void;
  initialDetailUrls: string[];
}) {
  const supabase = createClient();
  const [details, setDetails] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailUrls, setDetailUrls] = useState<string[]>(initialDetailUrls);

  useEffect(() => {
    setDetailUrls(initialDetailUrls);
  }, [initialDetailUrls]);

  useEffect(() => {
    propsSetDetailsUrl(detailUrls);
  }, [detailUrls]);

  const handleDetailsChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDetails(Array.from(e.target.files));
    }
  };

  const sanitizeFileName = (fileName: string) => {
    const timestamp = new Date().toISOString(); // Get the current timestamp
    const dotIndex = fileName.lastIndexOf('.'); // Find the last dot in the file name
  
    if (dotIndex === -1) {
      // If no extension exists, sanitize the name and append the timestamp
      return fileName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9.\-_]/g, '_') + `_${timestamp}`;
    }
  
    // Separate the name and extension
    const name = fileName.slice(0, dotIndex); // Part before the last dot
    const extension = fileName.slice(dotIndex); // Part after the last dot, including the dot
  
    // Sanitize the name and keep the extension intact
    const sanitizedBase = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9.\-_]/g, '_');
  
    return `${sanitizedBase}_${timestamp}${extension}`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const urls: string[] = [];
      for (const detail of details) {
        const sanitizedFileName = sanitizeFileName(detail.name);
        const { error } = await supabase.storage
          .from('kollabee')
          .upload(`details/${sanitizedFileName}`, detail);

        if (error) throw error;

        const { data: publicData } = supabase.storage
          .from('kollabee')
          .getPublicUrl(`details/${sanitizedFileName}`);

        if (publicData?.publicUrl) {
          urls.push(publicData.publicUrl);
        }
      }
      setDetailUrls((prevUrls) => [...prevUrls, ...urls]);
      alert('Images uploaded successfully!');
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditImage = async (index: number, file: File) => {
    setLoading(true);
    try {
      const sanitizedFileName = sanitizeFileName(file.name);
      const { error } = await supabase.storage
        .from('kollabee')
        .upload(`details/${sanitizedFileName}`, file, { upsert: true });

      if (error) throw error;

      const { data: publicData } = supabase.storage
        .from('kollabee')
        .getPublicUrl(`details/${sanitizedFileName}`);

      if (publicData?.publicUrl) {
        setDetailUrls((prevUrls) => {
          const newUrls = [...prevUrls];
          newUrls[index] = publicData.publicUrl;
          return newUrls;
        });
      }

      alert('Image updated successfully!');
    } catch (error) {
      console.error('Error updating image:', error);
      alert('Failed to update image.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setDetailUrls((prevUrls) => {
      const newUrls = [...prevUrls];
      newUrls.splice(index, 1); // Remove the image at the specified index
      return newUrls;
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="details">Detail Images:</Label>
        <Input
          id="details"
          type="file"
          accept="image/*"
          multiple
          onChange={handleDetailsChange}
          className="mt-1"
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Uploading...' : 'Upload Images'}
      </Button>
      {detailUrls.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mt-4">Detail Images:</h2>
          <ul className="list-disc pl-5 flex flex-wrap gap-4 w-full">
            {detailUrls.map((url, index) => (
              <li key={index} className="flex flex-col items-center gap-2">
                <img src={url} alt={`Detail ${index + 1}`} className="h-20 w-20 object-cover border rounded" />
                <div className="flex gap-2">
                  <label htmlFor={`edit-image-${index}`}>
                    <Input
                      id={`edit-image-${index}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleEditImage(index, e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveImage(index)}
                  >
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}
