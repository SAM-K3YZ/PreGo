import Svg, { Path } from 'react-native-svg';

// Official four-color Google "G" logomark. Kept as its own tiny SVG rather
// than routed through Button's `icon` prop, since Button always recolors
// icons to match the button's text color — this logo must stay multi-color.
const GoogleLogo = ({ size = 20 }: { size?: number }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20">
      <Path
        d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.79h5.4a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.9-1.75 2.97-4.33 2.97-7.31z"
        fill="#4285F4"
      />
      <Path
        d="M10 20c2.7 0 4.96-.9 6.62-2.42l-3.23-2.5c-.9.6-2.05.95-3.39.95-2.6 0-4.8-1.76-5.59-4.12H1.07v2.59A10 10 0 0 0 10 20z"
        fill="#34A853"
      />
      <Path
        d="M4.41 11.9A5.99 5.99 0 0 1 4.09 10c0-.66.11-1.3.32-1.9V5.51H1.07A10 10 0 0 0 0 10c0 1.61.39 3.14 1.07 4.49l3.34-2.59z"
        fill="#FBBC05"
      />
      <Path
        d="M10 3.98c1.47 0 2.79.5 3.83 1.5l2.87-2.87C14.95.99 12.7 0 10 0 6.09 0 2.7 2.24 1.07 5.51l3.34 2.59C5.2 5.74 7.4 3.98 10 3.98z"
        fill="#EA4335"
      />
    </Svg>
  );
};

export default GoogleLogo;
