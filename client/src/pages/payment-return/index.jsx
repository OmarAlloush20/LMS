import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { captureAndFinalizePaymentService } from "@/services";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function StripePaymentReturnPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const sessionId = params.get("session_id");
  const orderId = params.get("order_id");
  const [isProcessing, setIsProcessing] = useState(true);
  const [message, setMessage] = useState("Processing payment... Please wait");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (sessionId && orderId) {
      async function capturePayment() {
        try {
          // If no orderId in URL, try getting from session storage (for backward compatibility)
          const orderIdToUse =
            orderId || JSON.parse(sessionStorage.getItem("currentOrderId"));

          const response = await captureAndFinalizePaymentService(
            sessionId,
            orderIdToUse
          );

          if (response?.success) {
            sessionStorage.removeItem("currentOrderId");
            setSuccess(true);
            setMessage("Payment successful! Redirecting to your courses...");

            // Redirect after a short delay
            setTimeout(() => {
              window.location.href = "/student-courses";
            }, 2000);
          } else {
            setSuccess(false);
            setMessage("Payment verification failed. Please contact support.");
          }
        } catch (error) {
          console.error("Payment capture error:", error);
          setSuccess(false);
          setMessage("An error occurred while processing your payment.");
        } finally {
          setIsProcessing(false);
        }
      }

      capturePayment();
    } else {
      setIsProcessing(false);
      setSuccess(false);
      setMessage("Invalid payment session. Missing required parameters.");
    }
  }, [sessionId, orderId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{message}</CardTitle>
      </CardHeader>
      <CardContent>
        {isProcessing && (
          <div className="animate-pulse">
            Please do not close this window...
          </div>
        )}
        {!isProcessing && success && (
          <div className="text-green-600">
            Your course purchase was successful!
          </div>
        )}
        {!isProcessing && !success && (
          <div className="text-red-600">
            There was an issue with your payment.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default StripePaymentReturnPage;
