// src/pages/Services.tsx
import React, { useEffect } from 'react';
import ServiceCard from '../components/ServiceCard';
import { useServices } from './admin/ServicesContext';
import * as LucideIcons from 'lucide-react';
import { HeartPulse, Thermometer } from 'lucide-react';
import Lab from '/lab.jpeg';
import Physo from '/physo.jpeg';

const iconMap: Record<string, React.ElementType> = {
  Stethoscope: LucideIcons.Stethoscope,
  Brain: LucideIcons.Brain,
  HeartPulse: LucideIcons.HeartPulse,
  Thermometer: LucideIcons.Thermometer,
  Salad: LucideIcons.Salad,

};

const ServicesPage: React.FC = () => {
  const { services } = useServices();

  useEffect(() => {
    document.title = 'Our Services | Vedavayu';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-50 to-primary-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 bg-white text-primary-600 rounded-full mb-4 text-sm font-medium">
              Our Services
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-800 mb-6">
              Comprehensive Wellness Solutions
            </h1>
            <p className="text-xl text-neutral-700">
              Discover our range of holistic healthcare services designed to address your physical, mental, and spiritual wellbeing.
            </p>
          </div>
        </div>
      </section>

      {/* Physiotherapy Section */}
      <section id="physiotherapy" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 text-primary-600 mb-6">
                <HeartPulse size={28} className="stroke-current" />
              </div>
              <h2 className="text-3xl font-bold text-primary-800 leading-tight">
                Home Physiotherapy
              </h2>
              <p className="text-lg text-neutral-700">
                Our professional physiotherapy services are delivered in the comfort of your home, eliminating the need for travel and allowing for a more relaxed healing environment.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Rehabilitation after surgery or injury',
                  'Chronic pain management',
                  'Mobility improvement for elderly patients',
                  'Neurological rehabilitation',
                  'Sports injury treatment and prevention'
                ].map((item) => (
                  <li key={item} className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <span className="w-2 h-2 bg-primary-600 rounded-full" />
                    </span>
                    <span className="text-neutral-700 text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="https://wa.me/+919401986069?text=Hi, I would like to book an appointment at Vedavayu."
                className="btn btn-primary"
              >
                Book an Appointment
              </a>
            </div>
            <div>
              <img
                src={Physo}
                alt="Physiotherapy session"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Diagnostics Section */}
      <section id="diagnostics" className="py-16 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src={Lab}
                alt="Laboratory diagnostics"
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white text-primary-600 mb-6">
                <Thermometer size={28} className="stroke-current" />
              </div>
              <h2 className="text-3xl font-bold text-primary-800 leading-tight">
                Laboratory Diagnostics
              </h2>
              <p className="text-lg text-neutral-700">
                Our state-of-the-art diagnostic laboratory offers comprehensive testing services to provide accurate health assessments and early detection of potential health issues.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Comprehensive blood work analysis',
                  'Ayurvedic body constitution assessment',
                  'Nutritional deficiency testing',
                  'Allergy and sensitivity panels',
                  'Wellness screening packages'
                ].map((item) => (
                  <li key={item} className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <span className="w-2 h-2 bg-primary-600 rounded-full" />
                    </span>
                    <span className="text-neutral-700 text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="https://wa.me/+919401986069?text=Hi, I would like to book an appointment at Vedavayu."
                className="btn btn-primary"
              >
                Book an Appointment
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Other Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-800 mb-4">
              Our Other Services
            </h2>
            <p className="text-xl text-neutral-700">
              Explore our comprehensive range of holistic healthcare services
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((svc) => {
              const Icon = iconMap[svc.icon] || HeartPulse;
              return (
                <ServiceCard
                  key={svc._id}
                  icon={<Icon size={28} className="text-primary-600" />}
                  title={svc.name}
                  description={svc.description}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-primary-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-primary-800 mb-4">
              Ready to Experience Holistic Healthcare?
            </h2>
            <p className="text-lg text-neutral-700 mb-6">
              Book a consultation with our healthcare experts and take the first step towards comprehensive wellness.
            </p>
            <a
              href="#"
              className="btn btn-primary"
            >
              Book an Appointment
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;