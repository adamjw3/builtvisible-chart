import { useState } from 'react';
import Circle from './components/Circle';
import ComparisonDisplay from './components/ComparisonDisplay';
import ChartBg from './assets/chart-title.png'
import data from './data/data.json';

const App: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [gonorrheaRate, setGonorrheaRate] = useState<number>(0);
  const [chlamydiaRate, setChlamydiaRate] = useState<number>(0);
  const [gonorrheaUKRate, setGonorrheaUKRate] = useState<number>(0);
  const [chlamydiaUKRate, setChlamydiaUKRate] = useState<number>(0);

  const [chlamydiaComparison, setChlamydiaComparison] = useState<string>('');
  const [gonorrheaComparison, setGonorrheaComparison] = useState<string>('');

  const gonorrheaMin = Math.min(...data.map(d => parseFloat(d.GonorrheaDiagnosisRate)));
  const gonorrheaMax = Math.max(...data.map(d => parseFloat(d.GonorrheaDiagnosisRate)));
  const chlamydiaMin = Math.min(...data.map(d => parseFloat(d.ChlamydiaDiagnosisRate)));
  const chlamydiaMax = Math.max(...data.map(d => parseFloat(d.ChlamydiaDiagnosisRate)));
  
  const regions: string[] = [...new Set(data.map(item => item.Region))].sort();
  
  const locations: string[] = data
    .filter(item => selectedRegion === '' || item.Region === selectedRegion)
    .map(item => item.AreaName)
    .sort();

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const region = e.target.value;
    setSelectedRegion(region);
    setSelectedLocation(''); 
    setGonorrheaRate(0);
    setChlamydiaRate(0);
    setChlamydiaComparison('');
    setGonorrheaComparison('');
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const location = e.target.value;
    setSelectedLocation(location);

    if (location) {
      const selectedData = data.find(
        item => item.Region === selectedRegion && item.AreaName === location
      );
      if (selectedData) {
        setChlamydiaUKRate(parseInt("365.0211338"));
        setGonorrheaUKRate(parseInt("172.2033046"));
        setGonorrheaRate(parseInt(selectedData.GonorrheaDiagnosisRate));
        setChlamydiaRate(parseInt(selectedData.ChlamydiaDiagnosisRate));
        setChlamydiaComparison(selectedData.ChlamydiaComparedToEngland);
        setGonorrheaComparison(selectedData.GonorrheaComparedToEngland);
      }
    } else {
      setGonorrheaRate(0);
      setChlamydiaRate(0);
      setChlamydiaComparison('');
      setGonorrheaComparison('');
    }
  };

  const formatRate = (rate: number): string => {
    return rate !== 0 ? rate.toFixed(0) : "0";
  };


  const scaleToDiameter = (rate: number, min: number, max: number): number => {
    if (rate === 0) return 20;

    let minDiameter = 87;
    let maxDiameter = 270;
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
          <p className='chart-header__intro'>Discover how your area compares to the national average for STIs. Select your location to see if rates of Chlamydia and Gonorrhea are above or below the average in England</p>
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
            <span>Average across England</span></div>
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
             <div className='chart__results-item'>
              <span className='chart__results-item-stat'>{formatRate(gonorrheaUKRate)}</span>
              Per 100k People
            </div>
             <div className='chart__results-item'>
              <ComparisonDisplay value={gonorrheaComparison} />
              <span className='chart__results-item-stat'>{formatRate(gonorrheaRate)}</span>
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
            <div className='chart__results-item'>
              <span className='chart__results-item-stat'>{formatRate(chlamydiaUKRate)}</span>
              Per 100k People
            </div>
            <div className='chart__results-item'>
              <ComparisonDisplay value={chlamydiaComparison} />
              <span className='chart__results-item-stat'>{formatRate(chlamydiaRate)}</span>
              Per 100k People
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
