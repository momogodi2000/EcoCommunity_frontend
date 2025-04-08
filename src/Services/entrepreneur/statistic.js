import api from '../api';

export const getEntrepreneurDashboard = async () => {
  try {
    const response = await api.get('/entrepreneur/dashboard/');
    return response.data;
  } catch (error) {
    console.error('Error fetching entrepreneur dashboard:', error);
    throw error;
  }
};

export const getEntrepreneurProjects = async () => {
  try {
    const response = await api.get('/entrepreneur/projects/');
    return response.data;
  } catch (error) {
    console.error('Error fetching entrepreneur projects:', error);
    throw error;
  }
};

export const getEntrepreneurHelpRequests = async () => {
  try {
    const response = await api.get('/entrepreneur/help-requests/');
    return response.data;
  } catch (error) {
    console.error('Error fetching entrepreneur help requests:', error);
    throw error;
  }
};

export const getEntrepreneurContracts = async () => {
  try {
    const response = await api.get('/entrepreneur/contracts/');
    return response.data;
  } catch (error) {
    console.error('Error fetching entrepreneur contracts:', error);
    throw error;
  }
};

export const getEntrepreneurCollaborations = async () => {
  try {
    const response = await api.get('/entrepreneur/collaborations/');
    return response.data;
  } catch (error) {
    console.error('Error fetching entrepreneur collaborations:', error);
    throw error;
  }
};

export const createProject = async (projectData) => {
  try {
    const response = await api.post('/projects/', projectData);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const createHelpRequest = async (helpRequestData) => {
  try {
    const response = await api.post('/help-requests/', helpRequestData);
    return response.data;
  } catch (error) {
    console.error('Error creating help request:', error);
    throw error;
  }
};

export const signContract = async (contractId) => {
  try {
    const response = await api.patch(`/contracts/${contractId}/sign/`);
    return response.data;
  } catch (error) {
    console.error('Error signing contract:', error);
    throw error;
  }
};