import { useState } from 'react';
import Circle from './components/Circle';
import ChartBg from './assets/chart-title.png'
import data from './data/data.json';

const App: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [gonorrheaRate, setGonorrheaRate] = useState<number | null>(null);
  const [chlamydiaRate, setChlamydiaRate] = useState<number | null>(null);
  const [gonorrheaUKRate, setGonorrheaUKRate] = useState<number | null>(null);
  const [chlamydiaUKRate, setChlamydiaUKRate] = useState<number | null>(null);
  
  // Get unique regions and sort them alphabetically
  const regions: string[] = [...new Set(data.map(item => item.Region))].sort();
  
  // Get locations for selected region
  const locations: string[] = data
    .filter(item => selectedRegion === '' || item.Region === selectedRegion)
    .map(item => item.AreaName)
    .sort();

  // Handle region selection
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const region = e.target.value;
    setSelectedRegion(region);
    setSelectedLocation(''); // Reset location when region changes
    // Reset rates when region changes
    setGonorrheaRate(null);
    setChlamydiaRate(null);
  };

  // Handle location selection
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const location = e.target.value;
    setSelectedLocation(location);
    
    // Update rates when location is selected
    if (location) {
      const selectedData = data.find(
        item => item.Region === selectedRegion && item.AreaName === location
      );
      if (selectedData) {
        setChlamydiaUKRate(parseFloat("365.0211338"));
        setGonorrheaUKRate(parseFloat("172.2033046"));
        setGonorrheaRate(parseFloat(selectedData.GonorrheaDiagnosisRate));
        setChlamydiaRate(parseFloat(selectedData.ChlamydiaDiagnosisRate));
      }
    } else {
      // Reset rates if no location is selected
      setGonorrheaRate(null);
      setChlamydiaRate(null);
    }
  };

  const formatRate = (rate: number | null): string => {
    return rate !== null ? rate.toFixed(1) : "0";
  };


 const scaleToDiameter = (value: number, minRate: number, maxRate: number): number => {
  const MIN_DIAMETER = 50;
  const MAX_DIAMETER = 280;
  
  // Prevent division by zero and handle edge cases
  if (minRate === maxRate) return MIN_DIAMETER;
  if (value <= minRate) return MIN_DIAMETER;
  if (value >= maxRate) return MAX_DIAMETER;

  const scaledDiameter = MIN_DIAMETER + (value - minRate) * (MAX_DIAMETER - MIN_DIAMETER) / (maxRate - minRate);
  
  return Math.round(scaledDiameter);
};

  return (
    <div className="chart-container">
      <header className='chart-header'>
        <div>
          <h1 className='chart-header__heading'>STI Risk Tracker</h1>
          <p className='chart-header__intro'>This tool is designed to help you stay informed about sexual health in your area.</p>
        </div>
      </header>
      <div className="chart-form">
          <div className='select select--region'>
            <select value={selectedRegion}
            onChange={handleRegionChange}>
             <option value="">Select a region</option>
            {regions.map(region => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
            </select>  
          </div>
          <div className='select select--location'>
           <select 
            value={selectedLocation}
            onChange={handleLocationChange}
            disabled={!selectedRegion}
          >
            <option value="">Pick a location</option>
            {locations.map(location => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
          </div>
      </div>
      <div className="chart-legend">
          <div>
            <span>England</span></div>
          <div><span>Region</span></div>
      </div>
      <div className='chart'>
        <div className='chart__item'>
          <div className='chart__graph'>
            <Circle diameter={scaleToDiameter(gonorrheaUKRate, 33.3856, 1295.0898)} clipPathName="Gonorrhea-England"/>
            <Circle diameter={scaleToDiameter(gonorrheaRate, 33.3856, 1295.0898)} maskedSide='left' fillColor="#E33283" clipPathName="Gonorrhea-Region"/>
            <img src={ChartBg} alt='' className='chart__title'/>
            <span className='chart__header'>Gonorrhea</span>
          </div>
          <div className='chart__results'>
            <div>
              <span>{formatRate(gonorrheaUKRate)}</span>
              Per 100k People
            </div>
            <div>
              <span>{formatRate(gonorrheaRate)}</span>
              Per 100k People
            </div>
          </div>
        </div>
        <div className='chart__item'>
          <div className='chart__graph'>
            <Circle diameter={scaleToDiameter(chlamydiaUKRate, 148.6296, 1419.7694)} clipPathName="Chlamydia-England"/>
            <Circle diameter={scaleToDiameter(chlamydiaRate, 148.6296, 1419.7694)} maskedSide='left' fillColor="#E33283" clipPathName="Chlamydia-Region"/>
            <img src={ChartBg} alt='' className='chart__title'/>
            <span className='chart__header'>Chlamydia</span>          
          </div>
         <div className='chart__results'>
            <div>
              <span>{formatRate(chlamydiaUKRate)}</span>
              Per 100k People
            </div>
            <div>
              <span>{formatRate(chlamydiaRate)}</span>
              Per 100k People
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
