import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { validateTableId, setCurrentTableId } from "@/lib/tableContext";

/**
 * QRRedirect component handles direct QR code scans
 * Redirects directly to menu
 */
const QRRedirect = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't redirect if tableId looks like a route (contains hyphens, is a known route, or is not numeric)
    if (!tableId || tableId.includes('-') || isNaN(Number(tableId)) || ['proposta', 'landing-menu', 'menu-debug', 'payment-debug', 'auth', 'waiter', 'admin', 'kitchen', 'cashier', 'checkout', 'menu', 'order-lookup'].includes(tableId)) {
      navigate("/", { replace: true });
      return;
    }

    // Store table ID if provided and valid
    if (tableId && validateTableId(tableId)) {
      setCurrentTableId(tableId);
    }

    // Always redirect to menu
    navigate("/menu", { replace: true });
  }, [tableId, navigate]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-gradient-ocean flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        <p>Redirecionando...</p>
      </div>
    </div>
  );
};

export default QRRedirect;
