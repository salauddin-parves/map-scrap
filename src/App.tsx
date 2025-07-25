import React, { useState, useRef } from 'react';
import { Search, Download, StopCircle, Play, MapPin, Phone, Mail, Globe, FileSpreadsheet, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';

interface BusinessData {
  id: string;
  name: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  rating: number;
  reviews: number;
}

const MOCK_DATA: BusinessData[] = [
  {
    id: '1',
    name: 'The Golden Spoon Restaurant',
    phone: '+880-1234-567890',
    email: 'contact@goldenspoon.com',
    website: 'https://goldenspoon.com',
    address: 'Gulshan 2, Dhaka 1212',
    rating: 4.5,
    reviews: 324
  },
  {
    id: '2',
    name: 'Dhaka Delights',
    phone: '+880-1234-567891',
    email: 'info@dhakadelights.com',
    website: 'https://dhakadelights.com',
    address: 'Dhanmondi 27, Dhaka 1209',
    rating: 4.2,
    reviews: 187
  },
  {
    id: '3',
    name: 'Spice Garden',
    phone: '+880-1234-567892',
    email: 'hello@spicegarden.bd',
    website: 'https://spicegarden.bd',
    address: 'Uttara Sector 7, Dhaka 1230',
    rating: 4.7,
    reviews: 456
  },
  {
    id: '4',
    name: 'Royal Feast',
    phone: '+880-1234-567893',
    email: 'reservations@royalfeast.com',
    website: 'https://royalfeast.com',
    address: 'Banani DOHS, Dhaka 1213',
    rating: 4.3,
    reviews: 298
  },
  {
    id: '5',
    name: 'Urban Kitchen',
    phone: '+880-1234-567894',
    email: 'orders@urbankitchen.bd',
    website: 'https://urbankitchen.bd',
    address: 'Mirpur DOHS, Dhaka 1216',
    rating: 4.1,
    reviews: 143
  }
];

function App() {
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [isScrapingActive, setIsScrapingActive] = useState(false);
  const [results, setResults] = useState<BusinessData[]>([]);
  const [progress, setProgress] = useState(0);
  const [currentlyScrapingIndex, setCurrentlyScrapingIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startScraping = () => {
    if (!keyword.trim() || !city.trim()) {
      alert('Please enter both keyword and city');
      return;
    }

    setIsScrapingActive(true);
    setResults([]);
    setProgress(0);
    setCurrentlyScrapingIndex(0);

    // Simulate scraping process
    let currentIndex = 0;
    intervalRef.current = setInterval(() => {
      const businessData = MOCK_DATA[currentIndex % MOCK_DATA.length];
      if (businessData) {
        // Create a unique business entry by adding index to avoid duplicates
        const uniqueBusinessData = {
          ...businessData,
          id: `${businessData.id}-${Math.floor(currentIndex / MOCK_DATA.length)}-${currentIndex % MOCK_DATA.length}`,
          name: `${businessData.name} ${currentIndex > MOCK_DATA.length - 1 ? `(${Math.floor(currentIndex / MOCK_DATA.length) + 1})` : ''}`
        };
        setResults(prev => [...prev, uniqueBusinessData]);
        setCurrentlyScrapingIndex(currentIndex + 1);
      }
      currentIndex++;
    }, 1500); // Add new result every 1.5 seconds
  };

  const stopScraping = () => {
    setIsScrapingActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const exportToExcel = () => {
    if (results.length === 0) {
      alert('No data to export');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(results);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Business Data');
    
    const fileName = `${keyword}_${city}_businesses.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const exportToXML = () => {
    if (results.length === 0) {
      alert('No data to export');
      return;
    }

    let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<businesses>\n';
    
    results.forEach(business => {
      xmlContent += '  <business>\n';
      xmlContent += `    <id>${business.id}</id>\n`;
      xmlContent += `    <name><![CDATA[${business.name}]]></name>\n`;
      xmlContent += `    <phone>${business.phone}</phone>\n`;
      xmlContent += `    <email>${business.email}</email>\n`;
      xmlContent += `    <website>${business.website}</website>\n`;
      xmlContent += `    <address><![CDATA[${business.address}]]></address>\n`;
      xmlContent += `    <rating>${business.rating}</rating>\n`;
      xmlContent += `    <reviews>${business.reviews}</reviews>\n`;
      xmlContent += '  </business>\n';
    });
    
    xmlContent += '</businesses>';

    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${keyword}_${city}_businesses.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MapPin className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-800">Business Data Extractor</h1>
          </div>
          <p className="text-gray-600 text-lg">Extract business information from Google Maps with ease</p>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 max-w-2xl mx-auto">
            <strong>Note:</strong> This is a demonstration interface. For production use, please use official Google Places API to comply with terms of service.
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-white/20">
          <div className="grid md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Keyword
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g., restaurants, hotels, pharmacies"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                disabled={isScrapingActive}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                City/Location
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g., Dhaka, New York, London"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                disabled={isScrapingActive}
              />
            </div>
            
            <div className="flex gap-3">
              {!isScrapingActive ? (
                <button
                  onClick={startScraping}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Play className="w-5 h-5" />
                  Start Search
                </button>
              ) : (
                <button
                  onClick={stopScraping}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <StopCircle className="w-5 h-5" />
                  Stop Search
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {isScrapingActive && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Extracting businesses... ({currentlyScrapingIndex} found)
                </span>
                <span className="text-sm font-medium text-indigo-600">In Progress...</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse" />
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            {/* Export Controls */}
            <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-200/50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search Results ({results.length} businesses found)
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={exportToExcel}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Export Excel
                </button>
                <button
                  onClick={exportToXML}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  <FileText className="w-4 h-4" />
                  Export XML
                </button>
              </div>
            </div>

            {/* Results Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200/50">Business Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200/50">Phone</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200/50">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200/50">Website</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200/50">Address</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200/50">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((business, index) => (
                    <tr 
                      key={business.id} 
                      className={`hover:bg-indigo-50/50 transition-colors duration-200 ${
                        index % 2 === 0 ? 'bg-white/30' : 'bg-gray-50/30'
                      }`}
                    >
                      <td className="px-6 py-4 border-b border-gray-200/30">
                        <div className="font-semibold text-gray-900">{business.name}</div>
                        <div className="text-sm text-gray-600">{business.reviews} reviews</div>
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200/30">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {business.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200/30">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <a href={`mailto:${business.email}`} className="text-indigo-600 hover:text-indigo-800 transition-colors">
                            {business.email}
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200/30">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <a 
                            href={business.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 transition-colors truncate max-w-32"
                          >
                            {business.website.replace('https://', '')}
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200/30">
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {business.address}
                        </div>
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200/30">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-gray-900">{business.rating}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-sm ${
                                  i < Math.floor(business.rating) 
                                    ? 'text-yellow-400' 
                                    : 'text-gray-300'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p className="text-sm">
            Built with React + TypeScript • Professional Business Data Extraction Tool
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;