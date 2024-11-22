export interface Restaurant{
    id?: number,
    type?: string,
    name: string,
    location: string,
    qualification: number,
    reviewers: number,
    currentOpenStatusText: string
}

export interface Award {
    award_type: string;
    year: string;
    images: {
      small: string;
      large: string;
    };
    display_name: string;
  }