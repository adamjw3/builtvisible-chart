import { useState } from 'react';
import Circle from './components/Circle';
import ChartBg from './assets/chart-title.png'
import data from './data/data.json';

const App: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [gonorrheaRate, setGonorrheaRate] = useState<number>(0);
  const [chlamydiaRate, setChlamydiaRate] = useState<number>(0);
  const [gonorrheaUKRate, setGonorrheaUKRate] = useState<number>(0);
  const [chlamydiaUKRate, setChlamydiaUKRate] = useState<number>(0);

  const gonorrheaMin = Math.min(...data.map(d => parseFloat(d.GonorrheaDiagnosisRate)));
  const gonorrheaMax = Math.max(...data.map(d => parseFloat(d.GonorrheaDiagnosisRate)));
  const chlamydiaMin = Math.min(...data.map(d => parseFloat(d.ChlamydiaDiagnosisRate)));
  const chlamydiaMax = Math.max(...data.map(d => parseFloat(d.ChlamydiaDiagnosisRate)));
  
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
    setGonorrheaRate(0);
    setChlamydiaRate(0);
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
        setChlamydiaUKRate(parseInt("365.0211338"));
        setGonorrheaUKRate(parseInt("172.2033046"));
        setGonorrheaRate(parseInt(selectedData.GonorrheaDiagnosisRate));
        setChlamydiaRate(parseInt(selectedData.ChlamydiaDiagnosisRate));
      }
    } else {
      // Reset rates if no location is selected
      setGonorrheaRate(0);
      setChlamydiaRate(0);
    }
  };

  const formatRate = (rate: number): string => {
    return rate !== 0 ? rate.toFixed(1) : "0";
  };


  const scaleToDiameter = (rate: number, min: number, max: number): number => {
    if (rate === 0) return 0;

    let minDiameter = 87;
    let maxDiameter = 270; // Cap the diameter at 279
    let additional = 80

    if (window.innerWidth < 480) {
      minDiameter = 60;
      maxDiameter = 150;
      additional = 60;
    }

    const calculatedDiameter = minDiameter + ((rate - min) / (max - min)) * (maxDiameter - minDiameter) + additional;

    return Math.min(calculatedDiameter, maxDiameter);
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
            <Circle diameter={scaleToDiameter(gonorrheaUKRate, gonorrheaMin, gonorrheaMax)} clipPathName="Gonorrhea-England"/>
            <Circle diameter={scaleToDiameter(gonorrheaRate, gonorrheaMin, gonorrheaMax)} maskedSide='left' fillColor="#E33283" clipPathName="Gonorrhea-Region"/>
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
            <Circle diameter={scaleToDiameter(chlamydiaUKRate, chlamydiaMin, chlamydiaMax)} clipPathName="Chlamydia-England"/>
            <Circle diameter={scaleToDiameter(chlamydiaRate, chlamydiaMin, chlamydiaMax)} maskedSide='left' fillColor="#E33283" clipPathName="Chlamydia-Region"/>
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
