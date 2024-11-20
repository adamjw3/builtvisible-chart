import aboveAverage from '../assets/above-average.png';
import belowAverage from '../assets/below-average.png';
import average from '../assets/average.png';

type ComparisonValue = '' | 'Above average' | 'Below average' | 'Average';

interface ComparisonDisplayProps {
  value?: ComparisonValue;
}

const ComparisonDisplay: React.FC<ComparisonDisplayProps> = ({ value }) => {
  if (!value) return null;

  const getImage = (comparison: ComparisonDisplayProps['value']) => {
    switch (comparison) {
      case 'Above average':
        return aboveAverage;
      case 'Below average':
        return belowAverage;
      default:
        return average;
    }
  };

  return (
      <div className="chart__results-score">
        <span>{value}</span>
        <img 
        src={getImage(value)} 
        alt={value}
      />
      </div>
  );
};

export default ComparisonDisplay;