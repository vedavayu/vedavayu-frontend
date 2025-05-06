import React, { useEffect, useState } from 'react';
import DoctorCard from '../components/DoctorCard';
import api from '../Api/api';
import { getImageUrl } from '../utils/fileUtils';

interface Doctor {
  _id: string;
  image: string;
  name: string;
  specialty: string;
  status?: string;
}

// Define possible API response structures
interface DoctorsApiResponse {
  success?: boolean;
  doctors?: Doctor[];
  data?: Doctor[];
}

const Doctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoading(true);
        const response = await api.get<DoctorsApiResponse>('/doctors');

        // Correctly access doctors from response structure
        // Handle both potential response formats for robustness
        let doctorArray: Doctor[] = [];

        if (response.data.doctors && Array.isArray(response.data.doctors)) {
          doctorArray = response.data.doctors;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          doctorArray = response.data.data;
        } else if (Array.isArray(response.data)) {
          doctorArray = response.data;
        }

        // Filter to only show active doctors (or those with undefined status which we treat as active)
        const activeDoctors = doctorArray.filter((doctor: Doctor) =>
          doctor.status === 'active' || doctor.status === undefined
        );

        const processedDoctors = activeDoctors.map((doctor: Doctor) => ({
          ...doctor,
          image: getImageUrl(doctor.image),
        }));

        setDoctors(processedDoctors);
        setError('');
      } catch (err) {
        console.error('Doctors load error:', err);
        setError('Failed to load doctors. Please try again later.');
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    document.title = 'Our Doctors | Vedavayu';
    window.scrollTo(0, 0);
    loadDoctors();
  }, []);

  return (
    <div className="pt-24">
      {/* Updated Header Section */}
      <section className="bg-gradient-to-r from-primary-50 to-primary-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 bg-white text-primary-600 rounded-full mb-4 text-sm font-medium">
              Our Team
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-800 mb-6">
              Meet Our Expert Doctors
            </h1>
            <p className="text-xl text-neutral-700">
              Our team of experienced healthcare professionals is dedicated to providing you with the highest quality of holistic care.
            </p>
          </div>
        </div>
      </section>

      {/* Updated Doctors Grid Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center text-lg text-primary-600 py-12">
              Loading our medical experts...
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-12">
              ⚠️ {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctors.map((doctor) => (
                <DoctorCard
                  key={doctor._id}
                  image={doctor.image}
                  name={doctor.name}
                  specialty={doctor.specialty}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Updated Join Team Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Holistic Wellness Journey?
            </h2>
            <p className="text-lg text-primary-100 mb-8">
              Schedule a consultation with our healthcare experts today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/+919401986069?text=Hi, I would like to book an appointment at Vedavayu."
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-white text-primary-700 hover:bg-neutral-100 px-8 py-3 font-semibold shadow-lg transition-all"
              >
                Book an Appointment
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};


export default Doctors;