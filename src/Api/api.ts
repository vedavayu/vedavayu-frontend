import axios, {
  AxiosResponse,
  AxiosError,
} from 'axios';

// Add error response interface
interface ErrorResponse {
  message?: string;
  error?: string;
}

// Define type for import.meta.env
interface ImportMeta {
  env: {
    VITE_API_BASE_URL?: string;
  };
}

function getBaseURL(): string {
  if (typeof import.meta !== 'undefined' && (import.meta as ImportMeta).env?.VITE_API_BASE_URL) {
    return `${(import.meta as ImportMeta).env.VITE_API_BASE_URL}/api`;
  }
  if (typeof process !== 'undefined' && process.env?.REACT_APP_API_BASE_URL) {
    return `${process.env.REACT_APP_API_BASE_URL}/api`;
  }
  return 'http://localhost:5000/api'; // Use fixed base URL for development
}

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add authorization token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res: AxiosResponse) => res,
  (err: AxiosError<ErrorResponse>) => {
    if (err.response) {
      const originalRequest = err.config;
      const isPublicRoute = originalRequest?.url?.startsWith('/banners');
      
      const errorMessage = err.response.data?.error ||
        err.response.data?.message ||
        'Unknown error';

      if (err.response.status === 401 && !isPublicRoute) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = `/login?error=${encodeURIComponent(errorMessage)}`;
      }

      switch (err.response.status) {
        case 401:
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = `/login?error=${encodeURIComponent(errorMessage)}`;
          break;
        case 403:
          alert(`Forbidden: ${errorMessage}`);
          window.location.href = '/';
          break;
        case 413:
          console.error('Payload too large:', errorMessage);
          break;
        default:
          console.error(`API Error ${err.response.status}:`, errorMessage);
      }

      // Attach server response details to error object
      err.message = errorMessage;
    }
    return Promise.reject(err);
  }
);

// ——— Auth ———
export interface AuthResponse {
  token: string;
  user: UserData;
}

// Define proper user type
export interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  lastLogin?: string;
  name?: string; // Add optional name property to fix TypeScript errors
}

export const loginUser = (creds: { email: string; password: string }) =>
  api.post<AuthResponse>('/auth/login', creds)
    .then((r) => {
      // Map the response data to ensure it has the name field that the UI expects
      const responseData = r.data;
      
      // Check if we have a user with firstName/lastName but no name field
      if (responseData.user && 
          !responseData.user.name && 
          responseData.user.firstName) {
        
        // Create a name field from firstName and lastName
        const userData = {
          ...responseData.user,
          name: `${responseData.user.firstName} ${responseData.user.lastName || ''}`.trim()
        };
        
        return {
          token: responseData.token,
          user: userData
        };
      }
      
      return responseData;
    });

export const registerUser = (data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}) =>
  api.post<AuthResponse>('/auth/signup', data)
    .then((r) => {
      // Map the response data to ensure it has the name field that the UI expects
      const responseData = r.data;
      
      // Check if we have a user with firstName/lastName but no name field
      if (responseData.user && 
          !responseData.user.name && 
          responseData.user.firstName) {
        
        // Create a name field from firstName and lastName
        const userData = {
          ...responseData.user,
          name: `${responseData.user.firstName} ${responseData.user.lastName || ''}`.trim()
        };
        
        return {
          token: responseData.token,
          user: userData
        };
      }
      
      return responseData;
    });

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// ——— Users CRUD ———
export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  lastLogin?: string;
}

export const fetchUsers = () =>
  api.get<User[]>('/users').then((r) => r.data);
export const fetchUserById = (id: string) =>
  api.get<User>(`/users/${id}`).then((r) => r.data);
export const createUser = (
  data: Omit<User, '_id' | 'lastLogin'> & { password: string }
) => api.post<User>('/users', data).then((r) => r.data);
export const updateUser = (
  id: string,
  data: Partial<Omit<User, '_id' | 'lastLogin'>>
) => api.put<User>(`/users/${id}`, data).then((r) => r.data);
export const deleteUser = (id: string) =>
  api.delete(`/users/${id}`).then((r) => r.data);

// ——— Doctors CRUD ———
export interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  image: string;
  status?: string;
}

// Define the API response structure
export interface DoctorsApiResponse {
  success?: boolean;
  doctors?: Doctor[];
  data?: Doctor[];
}

export const getDoctors = (filters?: {
  name?: string;
  specialty?: string;
}) => api.get<DoctorsApiResponse>('/doctors', { params: filters })
  .then((r) => {
    // Extract doctors array, handling different response formats
    const doctorsArray = r.data.doctors || r.data.data || r.data;
    
    // Make sure we're returning an array
    if (Array.isArray(doctorsArray)) {
      return doctorsArray;
    } else {
      console.error('Unexpected doctors response format:', r.data);
      return [];
    }
  });

export const getDoctorById = (id: string) =>
  api.get<{success?: boolean, doctor?: Doctor, data?: Doctor}>(`/doctors/${id}`)
  .then((r) => r.data.doctor || r.data.data || r.data);

export const createDoctor = (formData: FormData) =>
  api.post<Doctor>('/doctors', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then((r) => r.data);

export const updateDoctor = (id: string, formData: FormData) =>
  api.put<Doctor>(`/doctors/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then((r) => r.data);

export const deleteDoctor = (id: string) =>
  api.delete<{ message: string }>(`/doctors/${id}`).then((r) => r.data);

// ——— Services CRUD ———
export interface Service {
  _id: string;
  name: string;
  description: string;
  icon: string;
}

export const getServices = () =>
  api.get<Service[]>('/services').then((r) => r.data);
export const getServiceById = (id: string) =>
  api.get<Service>(`/services/${id}`).then((r) => r.data);
export const createService = (data: Omit<Service, '_id'>) =>
  api.post<Service>('/services', data).then((r) => r.data);
export const updateService = (
  id: string,
  data: Partial<Omit<Service, '_id'>>
) => api.put<Service>(`/services/${id}`, data).then((r) => r.data);
export const deleteService = (id: string) =>
  api.delete<{ message: string }>(`/services/${id}`).then((r) => r.data);

// ——— Search Helper ———
export const searchDoctors = (q: string) =>
  api.get<Doctor[]>('/doctors', { params: { name: q, specialty: q } })
    .then((r) => r.data);

// Add Banner interface
export interface Banner {
  _id: string;
  title: string;
  date: string;
  time: string;
  registrationLink: string;
}

// Add Banner CRUD functions
export const getBanners = () => api.get<Banner[]>('/banners').then(r => r.data);
export const createBanner = (data: Omit<Banner, '_id'>) => 
  api.post<Banner>('/banners', data).then(r => r.data);
export const updateBanner = (id: string, data: Partial<Banner>) => 
  api.put<Banner>(`/banners/${id}`, data).then(r => r.data);
export const deleteBanner = (id: string) => 
  api.delete<{ message: string }>(`/banners/${id}`).then(r => r.data);

// ——— Gallery CRUD ———
export interface GalleryImage {
  _id: string;
  title?: string;
  description?: string;
  url: string;
  createdAt?: string;
}

export const fetchGalleryImages = () => 
  api.get<{success?: boolean, gallery?: GalleryImage[], data?: GalleryImage[]}>('/gallery')
    .then((r) => {
      // Extract gallery array, handling different response formats
      const galleryArray = r.data.gallery || r.data.data || r.data;
      
      // Make sure we're returning an array
      if (Array.isArray(galleryArray)) {
        return galleryArray;
      } else {
        console.error('Unexpected gallery response format:', r.data);
        return [];
      }
    });

export const uploadGalleryImage = (formData: FormData) => 
  api.post<{success?: boolean, image?: GalleryImage, data?: GalleryImage}>('/gallery', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then((r) => r.data.image || r.data.data || r.data);

export const deleteGalleryImage = (id: string) => 
  api.delete(`/gallery/${id}`).then((r) => r.data);

// ——— About Page ———
export interface AboutInfo {
  _id?: string;
  title: string;
  content: string;
  mission?: string;
  vision?: string;
  journeyImage?: string;
  statistics?: {
    doctors: number;
    therapies: number;
  };
  updatedAt?: string;
}

export const getAboutInfo = () => 
  api.get<AboutInfo>('/about').then((r) => r.data);

export const updateAboutInfo = (formData: FormData) => 
  api.post<{success: boolean, about: AboutInfo}>('/about', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then((r) => r.data.about || r.data);

// ——— Partners CRUD ———
export interface Partner {
  _id: string;
  name: string;
  logo: string;
  ownerPhoto: string;
}

export const getPartners = () => 
  api.get<Partner[]>('/partners').then(r => r.data);

export const createPartner = (formData: FormData) => 
  api.post<Partner>('/partners', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(r => r.data);

export const updatePartner = (id: string, formData: FormData) => 
  api.put<Partner>(`/partners/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(r => r.data);

export const deletePartner = (id: string) => 
  api.delete<{ message: string }>(`/partners/${id}`).then(r => r.data);

export default api;