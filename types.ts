
export interface Finding {
  indicator: string;
  details: string;
  severity: 'Info' | 'Low' | 'Medium' | 'High';
}

export interface ExtractedLink {
  url: string;
  analysis: string;
  risk: 'Safe' | 'Suspicious' | 'Malicious';
}

export interface AnalysisResult {
  isPhishing: boolean;
  probabilityScore: number;
  riskLevel: 'Safe' | 'Low' | 'Medium' | 'High' | 'Critical';
  summary: string;
  findings: Finding[];
  extractedLinks: ExtractedLink[];
}
