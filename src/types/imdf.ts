export interface IMDFFeature {
  type: 'Feature';
  geometry: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
  properties: {
    level?: string;
    name?: string;
    category?: string;
    [key: string]: any;
  };
}

export interface IMDFData {
  buildings: {
    type: 'FeatureCollection';
    features: IMDFFeature[];
  };
  units: {
    type: 'FeatureCollection';
    features: IMDFFeature[];
  };
  openings: {
    type: 'FeatureCollection';
    features: IMDFFeature[];
  };
  levels: {
    type: 'FeatureCollection';
    features: IMDFFeature[];
  };
} 