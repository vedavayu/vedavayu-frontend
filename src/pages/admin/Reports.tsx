import { useState } from 'react';
import { useReports } from './ReportsContext';
import { FileText, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AdminReports = () => {
  const { reports } = useReports();
  const [selectedSection, setSelectedSection] = useState('All Sections');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Filter reports based on selected section and date
  const filteredReports = reports.filter((report) => {
    const matchesSection = selectedSection === 'All Sections' || report.section === selectedSection;
    
    if (!selectedDate) return matchesSection;
    
    const reportDate = new Date(report.timestamp);
    return (
      matchesSection &&
      reportDate.getDate() === selectedDate.getDate() &&
      reportDate.getMonth() === selectedDate.getMonth() &&
      reportDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">Update Reports</h1>
        <div className="flex items-center space-x-4">
          {/* Section filter dropdown */}
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="px-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option>All Sections</option>
            <option>Doctors</option>
            <option>Services</option>
            <option>About</option>
            <option>Partners</option>
            <option>Gallery</option>
            <option>Banners</option>
            <option>Users</option>
            <option>Statistics</option> 
          </select>

          {/* Date picker with calendar icon */}
          <div className="relative">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="MMMM d, yyyy"
              placeholderText="Select date"
              className="pl-10 pr-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Calendar className="absolute left-3 top-2.5 text-neutral-400" size={20} />
          </div>

          {/* Clear date filter button */}
          {selectedDate && (
            <button
              onClick={() => setSelectedDate(null)}
              className="px-3 py-2 text-red-600 hover:text-red-700 transition-colors"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-6">
          {filteredReports.map((report) => (
            <div key={report.id} className="flex items-start space-x-4 pb-6 border-b border-neutral-200 last:border-0">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <FileText className="text-primary-600" size={20} />
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-neutral-800">{report.action}</h3>
                  <span className="text-sm text-neutral-500">{report.timestamp}</span>
                </div>
                <p className="text-neutral-600 mt-1">
                  Updated by {report.user} in {report.section} section
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;