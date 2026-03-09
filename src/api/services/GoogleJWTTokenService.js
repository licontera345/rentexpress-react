import Config from '../../config/apiConfig';

const getJWTToken = async (idToken) => {
  try {
    const response = await fetch(
      `${Config.API_BASE_URL}${Config.AUTH.LOGIN_GOOGLE}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching JWT token:', error);
    throw error;
  }
};

export default getJWTToken;