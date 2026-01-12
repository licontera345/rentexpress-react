const Config = {
  API_BASE_URL: "http://94.130.104.92:8084/rentexpress-rest-api/api",

  AUTH: {
    LOGIN_USER: "/users/open/authenticate",
    LOGIN_EMPLOYEE: "/employees/open/authenticate"
  },

  VEHICLES: {
    BASE: "/vehicles",
    OPEN: "/vehicles/open",
    BY_ID: (id) => `/vehicles/open/${id}`,
    SEARCH: "/vehicles/open/search",
    CREATE: "/vehicles",
    UPDATE: (id) => `/vehicles/${id}`,
    DELETE: (id) => `/vehicles/${id}`
  }
};

export default Config;
