// components/withAuth.tsx
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const withAuth = (WrappedComponent: React.FC) => {
  const AuthenticatedComponent = (props: any) => {
    const router = useRouter();
    const isAuthenticated = !!localStorage.getItem("token"); // Example check (replace with your logic)

    useEffect(() => {
      if (!isAuthenticated) {
        router.push("/login"); // Redirect if not authenticated
      }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
      return null; // Optionally render a loading spinner or nothing
    }

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
