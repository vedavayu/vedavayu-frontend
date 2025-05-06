import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import api from '../Api/api';
import { getAboutInfo, AboutInfo } from '../Api/api';
import Banner from '../components/Banner';
import about from '/about.png'

// Lazy load non-critical components
const Gallery = lazy(() => import('../components/Gallery'));
const PartnerCard = lazy(() => import('../components/PartnerLogo'));
const StatisticsCounter = lazy(() => import('../components/StatisticsCounter'));
const DoctorCard = lazy(() => import('../components/DoctorCard'));
const ServiceCard = lazy(() => import('../components/ServiceCard'));

// Import only the specific icons we need
import {
  Users,
  FileText,
  Clock,
  Activity,
  HeartPulse,
  // Add other commonly used icons here
  Heart,
  Stethoscope,
  Scissors,
  UserPlus,
  BookOpen,
  Leaf
} from 'lucide-react';

import { getImageUrl } from '../utils/fileUtils';

// Simple loading component for suspense
const SectionLoader = () => (
  <div className="flex justify-center items-center py-16">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
  </div>
);

// Create a map of icon names to components
const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  Users,
  FileText,
  Clock,
  Activity,
  HeartPulse,
  Heart,
  Stethoscope,
  Scissors,
  UserPlus,
  BookOpen,
  Leaf
};

const Home: React.FC = () => {
  interface Partner {
    id: number;
    name: string;
    logo: string;
    ownerPhoto: string;
  }

  interface Statistics {
    patientsTreated: number;
    testReports: number;
    hoursSupport: number;
    recoveryRate: number;
  }

  interface Doctor {
    _id: string;
    image: string;
    name: string;
    specialty: string;
  }

  interface Service {
    _id: string;
    name: string;
    description: string;
    icon: string;
  }

  // API response interfaces
  interface ApiResponse {
    success: boolean;
    message?: string;
  }

  interface DoctorsResponse extends ApiResponse {
    doctors: Doctor[];
  }

  interface PartnersResponse extends ApiResponse {
    partners?: Partner[];
  }

  interface ServicesResponse extends ApiResponse {
    services?: Service[];
  }

  interface StatisticsResponse extends ApiResponse {
    statistics?: Statistics;
  }

  const [partners, setPartners] = useState<Partner[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({ patientsTreated: 0, testReports: 0, hoursSupport: 0, recoveryRate: 0 });
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [aboutInfo, setAboutInfo] = useState<AboutInfo>({ title: "", content: "" });

  useEffect(() => {
    document.title = 'Vedavayu - Healing Beyond Medicine';
    window.scrollTo(0, 0);

    const fetchPublicData = async () => {
      try {
        const [partnersRes, statsRes, doctorsRes, servicesRes, aboutData] = await Promise.all([
          api.get<PartnersResponse | Partner[]>('/partners'),
          api.get<StatisticsResponse | Statistics>('/statistics'),
          api.get<DoctorsResponse | Doctor[]>('/doctors'),
          api.get<ServicesResponse | Service[]>('/services'),
          getAboutInfo()
        ]);

        // Handle partners data
        if ('partners' in partnersRes.data && Array.isArray(partnersRes.data.partners)) {
          setPartners(partnersRes.data.partners);
        } else if (Array.isArray(partnersRes.data)) {
          setPartners(partnersRes.data);
        }

        // Handle statistics data
        if ('statistics' in statsRes.data) {
          // This means we have a StatisticsResponse object
          // Use type assertion to tell TypeScript this is a StatisticsResponse
          const response = statsRes.data as StatisticsResponse;
          // Use functional update to avoid the statistics dependency
          setStatistics(prevStats => response.statistics || prevStats);
        } else {
          // Direct statistics object
          setStatistics(statsRes.data as Statistics);
        }

        // Safely access doctors data with proper structure handling
        if ('doctors' in doctorsRes.data && Array.isArray(doctorsRes.data.doctors)) {
          // Access the correct doctors array from the response structure
          setDoctors(doctorsRes.data.doctors.map(d => ({ ...d, image: getImageUrl(d.image) })));
        } else if (Array.isArray(doctorsRes.data)) {
          // Fallback for direct array response
          setDoctors(doctorsRes.data.map(d => ({ ...d, image: getImageUrl(d.image) })));
        } else {
          console.error('Doctor fetch error: Invalid response format', doctorsRes.data);
          setDoctors([]);
        }

        // Handle services data
        if ('services' in servicesRes.data && Array.isArray(servicesRes.data.services)) {
          setServices(servicesRes.data.services);
        } else if (Array.isArray(servicesRes.data)) {
          setServices(servicesRes.data);
        }

        // Set about info data
        setAboutInfo(aboutData);
      } catch (err) {
        console.error('Error loading public data:', err);
      }
    };

    fetchPublicData();
  }, []); // Empty dependency array is fine now that we use functional updates

  const getIconComponent = (iconName: string) => {
    // Look up the icon in our map, or use HeartPulse as fallback
    const IconComponent = iconMap[iconName] || HeartPulse;
    return <IconComponent className="text-primary-600 w-7 h-7" />;
  };



  return (
    <div className="min-h-screen">
      {/* Updated Hero Section */}
      <section className="pt-24 bg-gradient-to-r from-primary-50 to-primary-100">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="inline-block px-4 py-2 bg-primary-100 text-primary-600 rounded-full mb-4 font-medium">
              Healing Beyond Medicine
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-900 mb-6">
              Your Journey To <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">Holistic</span> Wellness Begins Here
            </h1>
            <p className="text-xl text-neutral-700 mb-8 max-w-3xl">
              At Vedavayu, we combine ancient wisdom with modern healthcare practices to provide holistic healing that nurtures your mind, body, and soul.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a
                href="https://wa.me/+919401986069?text=Hi, I would like to book an appointment at Vedavayu."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-primary-200/50 transition-all"
              >
                Book Appointment
              </a>
              <Link
                to="/about"
                className="btn btn-outline px-8 py-3 text-lg font-semibold hover:bg-primary-50/50 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
        <Banner className="mt-6" />
      </section>

      {/* Gallery Section */}
      <section className="w-full bg-white">
        <Suspense fallback={<SectionLoader />}>
          <Gallery />
        </Suspense>
      </section>

      {/* Updated About Section */}
      <section className="section bg-white" id="about">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <span className="inline-block px-3 py-1 bg-primary-50 text-primary-600 rounded-full mb-4 text-sm font-medium">
              About Vedavayu
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              {aboutInfo.title || "Blending Ancient Wisdom With Modern Healthcare"}
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Healing Beyond Medicine

            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <img
                src={about}
                alt="Woman doing yoga exercise"
                className="w-full h-full object-cover aspect-video"
              />
            </div>
            <div className="space-y-6">
              <div className="text-lg text-neutral-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: aboutInfo.content || "Founded in 2025, Vedavayu is a holistic wellness center dedicated to providing comprehensive healthcare solutions that go beyond conventional medicine. Our approach combines the ancient wisdom of Ayurveda, Yoga, and natural healing with modern medical practices." }}>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 bg-primary-50 rounded-xl hover:bg-primary-100/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                      <span className="text-2xl font-bold">{aboutInfo.statistics?.doctors || 0}+</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-primary-800">Experienced Doctors</h3>
                      <p className="text-neutral-600">Expert healthcare specialists dedicated to your wellbeing</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-primary-50 rounded-xl hover:bg-primary-100/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                      <span className="text-2xl font-bold">{aboutInfo.statistics?.therapies || 0}+</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary-900">Healing Therapies</h3>
                      <p className="text-neutral-600">Comprehensive treatment options for holistic care</p>
                    </div>
                  </div>
                </div>
              </div>
              <Link
                to="/about"
                className="inline-flex items-center btn btn-primary px-6 py-3 font-semibold hover:-translate-y-0.5 transition-transform"
              >
                Discover Our Philosophy
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Updated Partners Section */}
      <section className="section bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <span className="inline-block px-3 py-1 bg-white text-primary-600 rounded-full mb-4 text-sm font-medium">
              Our Supporters
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              Trusted by Healthcare Leaders
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              We collaborate with renowned healthcare organizations and medical professionals
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="group p-4 bg-primary-100 rounded-xl border-2 border-primary-100 hover:bg-primary-50 hover:border-primary-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col items-center">
                  <div className="relative w-full mb-4" style={{ paddingBottom: '100%' }}>
                    <img
                      src={partner.ownerPhoto}
                      alt={`${partner.name} logo`}
                      className="absolute inset-0 w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <span className="text-base font-semibold text-primary-800 group-hover:text-primary-600 transition-colors duration-300">
                    {partner.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Updated Doctors Section */}
      <section className="section bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <span className="inline-block px-3 py-1 bg-primary-50 text-primary-600 rounded-full mb-4 text-sm font-medium">
              Expert Team
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              Meet Our Specialist Doctors
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Our team of highly qualified healthcare professionals is dedicated to your wellbeing
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Suspense fallback={<SectionLoader />}>
              {doctors.slice(0, 4).map((doctor) => (
                <DoctorCard
                  key={doctor._id}
                  image={doctor.image}
                  name={doctor.name}
                  specialty={doctor.specialty}
                />
              ))}
            </Suspense>
          </div>
          <div className="text-center mt-12">
            <Link
              to="/doctors"
              className="btn btn-outline px-8 py-3 font-semibold hover:bg-primary-50/50 transition-colors"
            >
              View All Doctors
            </Link>
          </div>
        </div>
      </section>

      {/* Updated Services Section */}
      <section className="section bg-gradient-to-r from-primary-50 to-primary-100">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <span className="inline-block px-3 py-1 bg-white text-primary-600 rounded-full mb-4 text-sm font-medium">
              Our Services
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              Comprehensive Wellness Solutions
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              We offer a wide range of holistic healthcare services tailored to your unique needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Suspense fallback={<SectionLoader />}>
              {services.slice(0, 6).map((service) => (
                <ServiceCard
                  key={service._id}
                  icon={getIconComponent(service.icon)}
                  title={service.name}
                  description={service.description}
                />
              ))}
            </Suspense>
          </div>
          <div className="text-center mt-12">
            <Link
              to="/services"
              className="btn btn-primary px-8 py-3 font-semibold hover:-translate-y-0.5 transition-transform"
            >
              Explore All Services
            </Link>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div key="patients-treated">
              <StatisticsCounter
                value={statistics.patientsTreated}
                label="Lives Transformed"
                icon={<Users className="text-primary-600" size={32} />}
              />
            </div>
            <div key="test-reports">
              <StatisticsCounter
                value={statistics.testReports}
                label="Precision Reports"
                icon={<FileText className="text-primary-600" size={32} />}
              />
            </div>
            <div key="hours-support">
              <StatisticsCounter
                value={statistics.hoursSupport}
                label="Support Hours"
                icon={<Clock className="text-primary-600" size={32} />}
                suffix="/7"
              />
            </div>
            <div key="recovery-rate">
              <StatisticsCounter
                value={statistics.recoveryRate}
                label="Recovery Success"
                icon={<Activity className="text-primary-600" size={32} />}
                suffix="%"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary-0 to-primary-100">
        <div className="container mx-auto px-4">
          <style>
            {`
              @keyframes marquee {
                0% {
                  transform: translateX(100%);
                }
                100% {
                  transform: translateX(-100%);
                }
              }
              .marquee-content {
                display: flex;
                align-items: center;
                flex-wrap: nowrap;
                animation: marquee 30s linear infinite;
              }
              .marquee-content:hover {
                animation-play-state: paused;
              }
            `}
          </style>
          <div className="overflow-hidden">
            <div className="marquee-content">
              {partners.map((partner, index) => (
                <img
                  key={`${partner.id}-${index}`}
                  src={partner.logo}
                  alt={partner.name}
                  className="h-32 mx-6 grayscale hover:scale-105 transition-transform duration-300"
                />
              ))}
                 {partners.map((partner, index) => (
                <img
                  key={`${partner.id}-${index}`}
                  src={partner.logo}
                  alt={partner.name}
                  className="h-32 mx-6 grayscale hover:scale-105 transition-transform duration-300"
                />
              ))}
                 {partners.map((partner, index) => (
                <img
                  key={`${partner.id}-${index}`}
                  src={partner.logo}
                  alt={partner.name}
                  className="h-32 mx-6 grayscale hover:scale-105 transition-transform duration-300"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Updated CTA Section */}
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

export default Home;