import { useState, useRef, useEffect } from 'react';
import { Plus, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { useReports } from './ReportsContext';
import { fetchGalleryImages, uploadGalleryImage, deleteGalleryImage, GalleryImage } from '../../Api/api';
import { getImageUrl, optimizeCloudinaryUrl } from '../../utils/fileUtils';

const AdminGallery = () => {
  const { addReport } = useReports();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      console.log('Fetching gallery images...');
      const response = await fetchGalleryImages();
      console.log('Gallery images loaded:', response);
      setImages(response);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', file.name.split('.')[0]); // Use filename as title

    try {
      setUploading(true);
      console.log('Uploading new gallery image...');
      const response = await uploadGalleryImage(formData);
      console.log('Upload response:', response);
      
      setImages((prev) => [response, ...prev]);
      addReport('Added new image', 'Gallery');
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    
    try {
      console.log('Deleting gallery image:', id);
      await deleteGalleryImage(id);
      setImages((prev) => prev.filter((img) => img._id !== id));
      addReport('Deleted image', 'Gallery');
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image. Please try again.');
    }
  };

  const processImageUrl = (url: string) => {
    return url.includes('cloudinary.com') 
      ? optimizeCloudinaryUrl(url, 600, 400, 'fill') 
      : getImageUrl(url);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">Image Gallery</h1>
        <div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleAddImage}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            disabled={uploading}
          >
            {uploading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Uploading...
              </>
            ) : (
              <>
                <Plus size={20} className="mr-2" />
                Add New Image
              </>
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block p-4 rounded-full bg-primary-100">
            <ImageIcon size={40} className="text-primary-600 animate-pulse" />
          </div>
          <p className="mt-4 text-neutral-600">Loading gallery images...</p>
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-16 bg-neutral-50 rounded-lg border border-dashed border-neutral-300">
          <ImageIcon size={48} className="mx-auto text-neutral-400" />
          <p className="mt-4 text-neutral-600">No images in the gallery yet</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Upload First Image
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div key={image._id} className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-white">
              <div className="relative h-64">
                <img
                  src={processImageUrl(image.url)}
                  alt={image.title || 'Gallery image'}
                  className="w-full h-full object-cover transition-transform duration-500 transform group-hover:scale-105"
                  onError={(e) => {
                    console.error(`Failed to load image: ${image.url}`);
                    e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    {image.title && <p className="text-white font-medium truncate">{image.title}</p>}
                    {image.description && <p className="text-white/80 text-sm truncate">{image.description}</p>}
                  </div>
                </div>
              </div>
              
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDeleteImage(image._id)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  title="Delete image"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-neutral-300 rounded-xl h-64 flex flex-col items-center justify-center text-neutral-500 hover:border-primary-500 hover:text-primary-500 hover:bg-primary-50/30 transition-all duration-300 cursor-pointer"
          >
            <Upload size={32} />
            <span className="mt-2 font-medium">Upload Image</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;