import { Timestamp } from "firebase/firestore";

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  dates: { from: Timestamp; to: Timestamp | string };
  description: string[];
  tags: string[];
  position_type: string; // internship, full-time, part-time, etc.
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tools: string[];
  type: string; // professional, personal, group
  date: Timestamp;
  content: string;
  repository?: string;
  url?: string;
  image?: string;
  featured?: boolean;
  status?: string; // completed, in-progress, archived
}

export interface Publication {
  id: string;
  name: string;
  authors: string[];
  journal: string;
  date: Timestamp;
  abstract: string;
  paper_link?: string;
  type: string; // journal, conference, preprint, etc.
  tags: string[];
}

export interface ProjectFilters {
  searchTerm?: string;
  type?: string;
  technology?: string;
  status?: string;
  featured?: boolean;
}