const getJWTToken = async (idToken) => {
      try {
      const response = await fetch(     
          "http://daw2526.informaticapinguela.es:8081/rentexpress-rest-api/api/open/auth/google",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: idToken }),
      }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching JWT token:", error);
      throw error;
    }
  };

export default getJWTToken;