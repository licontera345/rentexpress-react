import { BrowserRouter, useNavigate } from 'react-router-dom';
import AppRoutes from './routes/Routes';
import useLocale from './hooks/core/useLocale';
import useAuth from './hooks/core/useAuth';
import AuthAxiosSetup from './components/auth/AuthAxiosSetup';
import ErrorBoundary from './components/common/ErrorBoundary';
//import { GoogleLogin } from '@react-oauth/google';

function AppContent() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <>
      <AuthAxiosSetup logout={logout} navigate={navigate} />
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </>
  );
}

function App() {
   useLocale();
  return (
     <BrowserRouter basename="/">
       <AppContent />
    </BrowserRouter>
  );
}

export default App;



/* <GoogleLogin
    onSuccess={async (credentialResponse) => {
      const idToken = credentialResponse.credential;

      try {
        const response = await fetch(
          "http://localhost:8081/rentexpress-rest-api/api/open/auth/google",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: idToken }),
          }
        );
        console.log("HTTP Status:", response.status);

        // If backend returns JSON
        const data = await response.json();
        console.log("Response body:", data);

      } catch (error) {
        console.error("Fetch error:", error);
      }
    }}
    onError={() => console.log("Login Failed")}
  /> */


