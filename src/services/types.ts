// src/services/types.ts

import { ReactNode } from "react";


export interface AidRecordsResponse {
  results: AidRecord[];
  pagination: {
    total_count: number;
    page: number;
    limit: number;
  };
}


export interface NewsItem {
  image_url: ReactNode;
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
}
export interface Employee {
  id: number;
  name: string;
  manager: string;
  job_title: string;
  subordinates: { id: number; name: string }[];
  image_url?: string |null
          
}
export type FetchEmployeesResponse = {
  jsonrpc: string;
  id: number | null;
  result: {
    success: boolean;
    data: Employee[];
    error?:any
  };

};
export interface User {
  name: string;
  email: string;
  mobile: string;
  user_id: number;
  image_url: string;
}
export interface DonationType {
  id: number;
  name: string;
  is_zakat: boolean;
}
export interface DonationItem {
  daily_amount?: any;
  start_date?: any;
  end_date?: any;
  image_url?: any;
  id: string;
  name: string;
  amount: number;
  project: Project;
  donationType: DonationType; // Reference to DonationType
  isGift: boolean;
  visitorEmail?: string;
  visitorName?: string;
  isOnlinePaymentFeesOnMe: boolean;
  giftForPhoneNumber?: string;
  giftMessage?: string;
  cart_id?: number;
}
export interface Project {
  permit?: string | TrustedHTML;
  previous_projects?: any;
  image_url?: any;
  imageUrl?: string;
  id: number;
  name: string;
  description: string | false;
  target_amount: number;
  total_donations: number;
  remaining_amount: number;
  slug: string | false;
  accepted_donation_types: DonationType[];
  category_id: number;
    subordinates: [
      {
          id: number,
          name:string
      }
  ],
  report: string | null; // Added report field as string or null if there is no report
}
// {
//   "id": 1,
//   "name": "John Doe",
//   "manager": "",
//   "job_title": "CEO",
//   "subordinates": [
//       {
//           "id": 2,
//           "name": "Jane Smith"
//       }
//   ],
//   "image_url": "/web/image/organization_management.employee/1/image"
// },
export interface LocalStorageData {
  accessToken: string;
  user: User;
}

export interface AidCategory {
  questions: any;
  id: number;
  name: string;
}

export interface DraftQuestion {
  id: number;
  name: string;
  is_required_attachment: boolean;
}
export interface AidCategory {
  id: number;
  name: string;
}
export interface AidRecord {
  id: number;
  state: string;
  current_step: [number, string];
  interview_date: string | null;
  aid_category_name?:string,
  aid_amount: number;
  invoice_id: string | null;
  total_aids: number;
  aid_category_id: {
    id: number;
    name: string;
  };
  partner_id: {
    id: number;
    name: string;
  };
  create_date: string;
  category_image_url: string;
  aid_created_date: string;
}


export interface AidDetailResponse {
  charitable_aid: AidRecord;
  answered_questions: AidItem[];
  unanswered_questions: DraftQuestion[];
}

export interface AidItem {
  id: number;
  name: string;
  is_required_attachment: boolean;
  answer_text: string;
  attachment: string | null;
}
export interface ApiResponse<T> {
  data: any;
  jsonrpc: string;
  id: null | number;
  result: {
    error: string;
    success: boolean;
    data: T;
  };
}

export interface ProjectsResponseData {
  id: number;
  name: string;
  is_approved: boolean;
  state: string;
  project_type: string;
  donor_id: number;
  location_id: number;
  aid_type_id: number;
  type_id: number;
  sponsor_id: number;
  start_date: string;
  end_date: string;
  estimated_cost: number;
  actual_cost: number;
  currency_id: number;
  is_active: boolean;
  total_donations: number;
}

// Define the type for each donation project
type DonationProject = {
  id: number;
  name: string;
  description: string | boolean;
  target_amount: number;
  total_donations: number;
  remaining_amount: number;
  slug: string | boolean;
  accepted_donation_types: {
    id: number;
    name: string;
    is_zakat: boolean;
  }[];
  category_id: number | boolean;
  is_featured_on_homepage: boolean;
  previous_projects: {
    id: number;
    name: string;
  }[];
  report: string | boolean;
  permit: string | boolean;
  pdf_attachment_id: boolean;
  image_url?: string;
};

// Define the type for the `result` object in the response
type FetchDonationProjectsResult = {
  success: boolean;
  data: {
    projects: DonationProject[];
    total_projects: number;
    page: number;
    limit: number;
  };
};

// Define the type for the full response
export type FetchDonationProjectsResponse = {
  jsonrpc: string;
  id: number | null;
  result: FetchDonationProjectsResult;
};

export interface CategoryResponseData {
  id: number;
  name: string;
  image: string;
  parent_id: boolean;
}

export interface CategoriesResponse {
  jsonrpc: string;
  id: null | number;
  result: {
    success: boolean;
    data: {
      parent_categories: CategoryResponseData[];
      subcategories: CategoryResponseData[] | null;
    };
  };
}
export interface AidCategoriesResponse {
  jsonrpc: string;
  id: null | number;
  result: {
    success: boolean;
    data: {
      id: number;
      name: string;
      subtitle: string;
      image_url: string;
    };
  };
}
