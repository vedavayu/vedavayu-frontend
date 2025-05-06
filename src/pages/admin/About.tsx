import { useState, useRef, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useReports } from './ReportsContext';
import { getAboutInfo, updateAboutInfo, AboutInfo } from '../../Api/api';
import { readFileAsDataURL } from '../../utils/fileUtils';

const AdminAbout = () => {
  const { addReport } = useReports();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [aboutContent, setAboutContent] = useState<AboutInfo>({
    title: "Blending Ancient Wisdom With Modern Healthcare",
    content: `Founded in 2025, Vedavayu is a holistic wellness center dedicated to providing comprehensive healthcare solutions that go beyond conventional medicine. Our approach combines the ancient wisdom of Ayurveda, Yoga, and natural healing with modern medical practices.

At Vedavayu, we believe true healing addresses the root causes of ailments rather than just treating symptoms. Our team of experienced doctors, therapists, and wellness experts work collaboratively to create personalized treatment plans that nurture your physical, mental, and spiritual well-being.`,
    statistics: {
      doctors: 15,
      therapies: 10,
    },
    journeyImage: "https://images.pexels.com/photos/1325681/pexels-photo-1325681.jpeg?auto=compress&cs=tinysrgb&w=1600",
  });

  // Fetch current about data when component mounts
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const data = await getAboutInfo();
        console.log('Fetched about data:', data);
        if (data) {
          setAboutContent({
            ...data,
            statistics: data.statistics || { doctors: 0, therapies: 0 }
          });
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      console.log('Saving about content:', aboutContent);
      
      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append('title', aboutContent.title);
      formData.append('content', aboutContent.content);
      
      // Include mission and vision if they exist
      if (aboutContent.mission) formData.append('mission', aboutContent.mission);
      if (aboutContent.vision) formData.append('vision', aboutContent.vision);
      
      // Add statistics as stringified JSON
      formData.append('statistics', JSON.stringify(aboutContent.statistics));
      
      // Add the journey image file if a new one was uploaded
      if (uploadedImage) {
        formData.append('journeyImage', uploadedImage);
      } else if (aboutContent.journeyImage && !aboutContent.journeyImage.startsWith('blob:')) {
        // Keep existing remote image URL
        formData.append('journeyImage', aboutContent.journeyImage);
      }
      
      const response = await updateAboutInfo(formData);
      console.log('Update response:', response);
      addReport('Updated About section successfully', 'About');
      
      // Clear uploaded image state after successful save
      setUploadedImage(null);
      
      // Update content with saved data
      if (response) {
        setAboutContent(response);
      }
    } catch (error) {
      console.error('Error saving about content:', error);
      addReport('Failed to update About section', 'About', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Store the file for form submission
      setUploadedImage(file);
      
      // Create a preview URL
      const previewUrl = await readFileAsDataURL(file);
      setPreviewImage(previewUrl);
      
      // Update the state to show preview
      setAboutContent((prev) => ({ ...prev, journeyImage: previewUrl }));
    } catch (error) {
      console.error('Error handling image upload:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">Edit About Section</h1>
        <button
          onClick={handleSave}
          disabled={loading}
          className={`flex items-center px-4 py-2 ${
            loading ? 'bg-gray-400' : 'bg-primary-600 hover:bg-primary-700'
          } text-white rounded-md transition-colors`}
        >
          {loading ? (
            <>Processing...</>
          ) : (
            <>
              <Save size={20} className="mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Section Title
              </label>
              <input
                type="text"
                value={aboutContent.title}
                onChange={(e) => setAboutContent({ ...aboutContent, title: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                About Content
              </label>
              <textarea
                value={aboutContent.content}
                onChange={(e) => setAboutContent({ ...aboutContent, content: e.target.value })}
                rows={10}
                className="w-full px-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Journey Section Image
              </label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mb-2 px-4 py-2 bg-primary-100 text-primary-600 rounded-md hover:bg-primary-200 transition-colors"
              >
                Upload New Image
              </button>
              {aboutContent.journeyImage && (
                <div className="relative">
                  <img
                    src={aboutContent.journeyImage}
                    alt="Journey section preview"
                    className="mt-2 w-full h-64 object-cover rounded-lg"
                  />
                  {previewImage && (
                    <div className="absolute top-2 left-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      New image (not saved yet)
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-neutral-800 mb-4">Statistics</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Number of Doctors
                </label>
                <input
                  type="number"
                  value={aboutContent.statistics?.doctors || 0}
                  onChange={(e) =>
                    setAboutContent({
                      ...aboutContent,
                      statistics: { 
                        ...(aboutContent.statistics || {}), 
                        doctors: parseInt(e.target.value) || 0 
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Number of Therapies
                </label>
                <input
                  type="number"
                  value={aboutContent.statistics?.therapies || 0}
                  onChange={(e) =>
                    setAboutContent({
                      ...aboutContent,
                      statistics: { 
                        ...(aboutContent.statistics || {}), 
                        therapies: parseInt(e.target.value) || 0 
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Mission Statement (Optional)
                </label>
                <textarea
                  value={aboutContent.mission || ''}
                  onChange={(e) => setAboutContent({ ...aboutContent, mission: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Vision Statement (Optional)
                </label>
                <textarea
                  value={aboutContent.vision || ''}
                  onChange={(e) => setAboutContent({ ...aboutContent, vision: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAbout;