import React, { useEffect, useState } from 'react';
import { getAboutInfo, AboutInfo } from '../Api/api';

const About: React.FC = () => {
  const [aboutContent, setAboutContent] = useState<AboutInfo>({
    title: "Blending Ancient Wisdom With Modern Healthcare",
    content: "Founded in 2025, Vedavayu is a holistic wellness center dedicated to providing comprehensive healthcare solutions.",
    mission: "To provide accessible, holistic healthcare that empowers individuals to achieve optimal wellness through the integration of traditional healing systems and modern medical practices.",
    vision: "To be recognized globally as a pioneering institution that revolutionizes healthcare through the successful integration of ancient healing wisdom and modern medical science.",
    statistics: {
      doctors: 15,
      therapies: 10,
    }
  });

  useEffect(() => {
    document.title = 'About Us | Vedavayu';
    window.scrollTo(0, 0);
    getAboutInfo()
      .then(response => {
        console.log('Fetched about info:', response);
        setAboutContent(response);
      })
      .catch(error => {
        console.error('Error fetching about content:', error);
      });
  }, []);

  return (
    <div className="pt-24">
      <section className="bg-gradient-to-r from-primary-50 to-primary-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 bg-white text-primary-600 rounded-full mb-4 text-sm font-medium">
              About Us
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-800 mb-6">
              {aboutContent.title || "Our Story & Mission"}
            </h1>
            <p className="text-xl text-neutral-700">
              Discover how Vedavayu is revolutionizing healthcare through holistic healing and integrated wellness approaches.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary-800 mb-6">
                Our Journey
              </h2>
              <div className="text-lg text-neutral-700 space-y-4">
                {aboutContent.content.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src={aboutContent.journeyImage}
                alt="Vedavayu Center"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-8 -left-8 hidden lg:block">
                <div className="bg-primary-50 p-8 rounded-lg shadow-lg">
                  <h3 className="text-xl font-bold text-primary-800 mb-3">
                    Our Core Values
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                      <span className="text-neutral-700">Holistic Approach</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                      <span className="text-neutral-700">Patient-Centered Care</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                      <span className="text-neutral-700">Preventive Healthcare</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                      <span className="text-neutral-700">Ethics & Integrity</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                      <span className="text-neutral-700">Continuous Innovation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-primary-800 mb-6">
              Our Mission & Vision
            </h2>
            <p className="text-xl text-neutral-700">
              We are committed to transforming healthcare through an integrative approach that honors both ancient wisdom and modern science.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-primary-800 mb-4 text-center">Our Mission</h3>
              <p className="text-neutral-700 text-center">
                {aboutContent.mission || "To provide accessible, holistic healthcare that empowers individuals to achieve optimal wellness through the integration of traditional healing systems and modern medical practices."}
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-primary-800 mb-4 text-center">Our Vision</h3>
              <p className="text-neutral-700 text-center">
                {aboutContent.vision || "To be recognized globally as a pioneering institution that revolutionizes healthcare through the successful integration of ancient healing wisdom and modern medical science."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-primary-800 mb-6 text-center">
              Why Choose Vedavāyu?

            </h2>
            <p className="text-lg text-neutral-700 mb-8 text-center">
              Let Vedavāyu be your partner in health—mindful, personalized, and nature-inspired.
            </p>

            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-1/3 mb-4 md:mb-0">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto md:mx-0">
                    <span className="text-2xl font-bold text-primary-600">1</span>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold text-primary-800 mb-2">Holistic Integration</h3>
                  <p className="text-neutral-700">
                    Rooted in natural healing, modern science, and technology.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-1/3 mb-4 md:mb-0">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto md:mx-0">
                    <span className="text-2xl font-bold text-primary-600">2</span>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold text-primary-800 mb-2">Community Trust</h3>
                  <p className="text-neutral-700">
                    Trusted by communities for home healthcare & online wellness.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-1/3 mb-4 md:mb-0">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto md:mx-0">
                    <span className="text-2xl font-bold text-primary-600">3</span>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold text-primary-800 mb-2">Preventive Focus</h3>
                  <p className="text-neutral-700">
                    Dedicated to preventive care, not just treatment.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-1/3 mb-4 md:mb-0">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto md:mx-0">
                    <span className="text-2xl font-bold text-primary-600">4</span>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold text-primary-800 mb-2">Regional Reach</h3>
                  <p className="text-neutral-700">
                  Serving across Assam and beyond.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-1/3 mb-4 md:mb-0">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto md:mx-0">
                    <span className="text-2xl font-bold text-primary-600">5</span>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold text-primary-800 mb-2">Eco-Health Innovation</h3>
                  <p className="text-neutral-700">
                    Expanding into eco-health with divisions like Vedāhār (traditional foods) & Vedapatra (eco-products).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;