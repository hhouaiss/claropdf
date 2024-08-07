export interface KeyInfo {
    text: string;
    page: number;
  }
  
  export interface KeyNumber {
    value: number;
    label: string;
    page: number;
  }
  
  export interface ChartData {
    type: 'bar' | 'line' | 'pie';
    data: any;
    page: number;
  }