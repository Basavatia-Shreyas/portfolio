import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  where, 
  QueryConstraint,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { Experience, Project, Publication, ProjectFilters } from '@/types/types';
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';

// Resume functions
export async function uploadResume(file: File): Promise<string> {
  try {
    // Delete existing resume files first
    const resumeRef = ref(storage, 'resume/');
    const existingFiles = await listAll(resumeRef);
    
    // Delete all existing resume files
    for (const fileRef of existingFiles.items) {
      await deleteObject(fileRef);
    }
    
    // Upload new resume
    const timestamp = new Date().getTime();
    const fileRef = ref(storage, `resume/resume_${timestamp}.pdf`);
    
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    
    // Save resume metadata to Firestore
    const resumeDocRef = doc(db, 'settings', 'resume');
    await setDoc(resumeDocRef, {
      url: downloadURL,
      fileName: file.name,
      uploadedAt: Timestamp.now(),
      size: file.size
    });
    
    console.log('Resume uploaded successfully:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading resume:', error);
    throw new Error('Failed to upload resume');
  }
}

export async function getResumeURL(): Promise<string | null> {
  try {
    const resumeDocRef = doc(db, 'settings', 'resume');
    const resumeDoc = await getDoc(resumeDocRef);
    
    if (resumeDoc.exists()) {
      const data = resumeDoc.data();
      return data.url || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching resume URL:', error);
    throw new Error('Failed to fetch resume');
  }
}

export async function getResumeMetadata(): Promise<{
  url: string;
  fileName: string;
  uploadedAt: Timestamp;
  size: number;
} | null> {
  try {
    const resumeDocRef = doc(db, 'settings', 'resume');
    const resumeDoc = await getDoc(resumeDocRef);
    
    console.log("Resume metadata:", resumeDoc.data());
    if (resumeDoc.exists()) {
      return resumeDoc.data() as {
        url: string;
        fileName: string;
        uploadedAt: Timestamp;
        size: number;
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching resume metadata:', error);
    throw new Error('Failed to fetch resume metadata');
  }
}

// Experience functions
export async function addExperience(experience: Omit<Experience, 'id'>): Promise<string> {
  try {
    const experiencesRef = collection(db, 'experience');
    const docRef = await addDoc(experiencesRef, experience);
    console.log('Experience added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding experience:', error);
    throw new Error('Failed to add experience');
  }
}

export async function updateExperience(id: string, experience: Partial<Experience>): Promise<void> {
  try {
    const experienceRef = doc(db, 'experience', id);
    await updateDoc(experienceRef, experience);
    console.log('Experience updated:', id);
  } catch (error) {
    console.error('Error updating experience:', error);
    throw new Error('Failed to update experience');
  }
}

export async function deleteExperience(id: string): Promise<void> {
  try {
    const experienceRef = doc(db, 'experience', id);
    await deleteDoc(experienceRef);
    console.log('Experience deleted:', id);
  } catch (error) {
    console.error('Error deleting experience:', error);
    throw new Error('Failed to delete experience');
  }
}

export async function getExperiences(): Promise<Experience[]> {
  try {
    const experiencesRef = collection(db, 'experience');
    const q = query(experiencesRef, orderBy('dates.from', 'desc'));
    const querySnapshot = await getDocs(q);

    console.log("querySnapshot:", querySnapshot);
    
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Experience[];
    console.log("Fetched experiences:", data);
    return data;
  } catch (error) {
    console.error('Error fetching experiences:', error);
    throw new Error('Failed to fetch experiences');
  }
}

// Projects functions
export async function addProject(project: Omit<Project, 'id'>): Promise<string> {
  try {
    const projectsRef = collection(db, 'projects');
    const docRef = await addDoc(projectsRef, project);
    console.log('Project added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding project:', error);
    throw new Error('Failed to add project');
  }
}

export async function updateProject(id: string, project: Partial<Project>): Promise<void> {
  try {
    const projectRef = doc(db, 'projects', id);
    await updateDoc(projectRef, project);
    console.log('Project updated:', id);
  } catch (error) {
    console.error('Error updating project:', error);
    throw new Error('Failed to update project');
  }
}

export async function deleteProject(id: string): Promise<void> {
  try {
    const projectRef = doc(db, 'projects', id);
    await deleteDoc(projectRef);
    console.log('Project deleted:', id);
  } catch (error) {
    console.error('Error deleting project:', error);
    throw new Error('Failed to delete project');
  }
}

export async function getProjects(filters?: ProjectFilters): Promise<Project[]> {
  try {
    const projectsRef = collection(db, 'projects');
    const constraints: QueryConstraint[] = [orderBy('date', 'desc')];
    
    const q = query(projectsRef, ...constraints);
    const querySnapshot = await getDocs(q);
    
    let projects = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Project[];
    
    // Client-side filtering for search term and technology
    // (Firestore doesn't support complex text search or array-contains with other filters)
    if (filters?.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      projects = projects.filter(project =>
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.tools.some(tech => 
          tech.toLowerCase().includes(searchLower)
        )
      );
    }
    
    if (filters?.technology && filters.technology !== 'all') {
      projects = projects.filter(project =>
        project.tools.includes(filters.technology!)
      );
    }

    if (filters?.type && filters.type !== 'all') {
      projects = projects.filter(project => project.type === filters.type);
    }
    
    // Status filter
    if (filters?.status && filters.status !== 'all') {
      projects = projects.filter(project => project.status === filters.status);
    }
    
    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw new Error('Failed to fetch projects');
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const projectRef = doc(db, 'projects', id);
    const projectSnap = await getDoc(projectRef);
    
    if (projectSnap.exists()) {
      return {
        id: projectSnap.id,
        ...projectSnap.data()
      } as Project;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching project:', error);
    throw new Error('Failed to fetch project');
  }
}

// Get all unique technologies from projects
export async function getProjectTechnologies(): Promise<string[]> {
  try {
    const projects = await getProjects();
    const allTechnologies = projects.flatMap(project => project.tools);
    return Array.from(new Set(allTechnologies)).sort();
  } catch (error) {
    console.error('Error fetching project technologies:', error);
    return [];
  }
}

// Publications functions
export async function addPublication(publication: Omit<Publication, 'id'>): Promise<string> {
  try {
    const publicationsRef = collection(db, 'publications');
    const docRef = await addDoc(publicationsRef, publication);
    console.log('Publication added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding publication:', error);
    throw new Error('Failed to add publication');
  }
}

export async function updatePublication(id: string, publication: Partial<Publication>): Promise<void> {
  try {
    const publicationRef = doc(db, 'publications', id);
    await updateDoc(publicationRef, publication);
    console.log('Publication updated:', id);
  } catch (error) {
    console.error('Error updating publication:', error);
    throw new Error('Failed to update publication');
  }
}

export async function deletePublication(id: string): Promise<void> {
  try {
    const publicationRef = doc(db, 'publications', id);
    await deleteDoc(publicationRef);
    console.log('Publication deleted:', id);
  } catch (error) {
    console.error('Error deleting publication:', error);
    throw new Error('Failed to delete publication');
  }
}

export async function getPublications(): Promise<Publication[]> {
  try {
    const publicationsRef = collection(db, 'publications');
    const q = query(publicationsRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Publication[];
  } catch (error) {
    console.error('Error fetching publications:', error);
    throw new Error('Failed to fetch publications');
  }
}

// Get publications by type
export async function getPublicationsByType(type: string): Promise<Publication[]> {
  try {
    const publicationsRef = collection(db, 'publications');
    const q = query(
      publicationsRef, 
      where('type', '==', type),
      orderBy('order', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Publication[];
  } catch (error) {
    console.error('Error fetching publications by type:', error);
    throw new Error(`Failed to fetch ${type} publications`);
  }
}

// Get publications by year
export async function getPublicationsByYear(year: string): Promise<Publication[]> {
  try {
    const publicationsRef = collection(db, 'publications');
    const q = query(
      publicationsRef, 
      where('year', '==', year),
      orderBy('order', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Publication[];
  } catch (error) {
    console.error('Error fetching publications by year:', error);
    throw new Error(`Failed to fetch publications from ${year}`);
  }
}