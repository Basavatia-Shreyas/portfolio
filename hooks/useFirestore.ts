import { useState, useEffect } from 'react';
import { 
  getExperiences, 
  getProjects, 
  getPublications, 
  getProjectTechnologies, 
  getProjectById
} from '@/lib/database';
import { Experience, Project, Publication, ProjectFilters } from '@/types/types';
import { useAuth } from '@/components/auth_context';

export function useExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const data = await getExperiences();
        setExperiences(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch experiences');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch data when user is authenticated
    if (user && !authLoading) {
      fetchExperiences();
    } else if (!authLoading && !user) {
      setLoading(false);
      setError('Authentication required');
    }
  }, [user, authLoading]);

  return { experiences, loading: loading || authLoading, error };
}

export function useProjects(filters?: ProjectFilters) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await getProjects(filters);
        setProjects(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch data when user is authenticated
    if (user && !authLoading) {
      fetchProjects();
    } else if (!authLoading && !user) {
      setLoading(false);
      setError('Authentication required');
    }
  }, [user, authLoading, filters?.type, filters?.status, filters?.featured, filters?.searchTerm, filters?.technology]);

  return { projects, loading: loading || authLoading, error };
}

export function useProjectTechnologies() {
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        setLoading(true);
        const data = await getProjectTechnologies();
        setTechnologies(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch technologies');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch data when user is authenticated
    if (user && !authLoading) {
      fetchTechnologies();
    } else if (!authLoading && !user) {
      setLoading(false);
      setError('Authentication required');
    }
  }, [user, authLoading]);

  return { technologies, loading: loading || authLoading, error };
}

export function usePublications() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        setLoading(true);
        const data = await getPublications();
        setPublications(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch publications');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch data when user is authenticated
    if (user && !authLoading) {
      fetchPublications();
    } else if (!authLoading && !user) {
      setLoading(false);
      setError('Authentication required');
    }
  }, [user, authLoading]);

  return { publications, loading: loading || authLoading, error };
}

export function useProject(id: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const data = await getProjectById(id);
        setProject(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch project');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch data when user is authenticated and id is provided
    if (id && user && !authLoading) {
      fetchProject();
    } else if (!authLoading && !user) {
      setLoading(false);
      setError('Authentication required');
    }
  }, [id, user, authLoading]);

  return { project, loading: loading || authLoading, error };
}