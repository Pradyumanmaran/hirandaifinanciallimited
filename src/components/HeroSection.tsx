import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useSubmitLoanRequest, BRANCH_PINCODES } from "@/lib/api";
import { toast } from "sonner";

const HeroSection = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    branch: "",
    agreed: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string | null>(null);
  const { mutate, isPending, isError, error } = useSubmitLoanRequest();

  useEffect(() => {
    // Listen for console logs to update loading steps
    const originalConsoleLog = console.log;
    console.log = function(...args) {
      originalConsoleLog.apply(console, args);
      
      // Check if the log is about workflow steps
      if (typeof args[0] === 'string') {
        if (args[0].includes('Loan application created')) {
          setLoadingStep('Building workflow...');
        } else if (args[0].includes('Workflow built')) {
          setLoadingStep('Executing workflow...');
        } else if (args[0].includes('Workflow execution')) {
          setLoadingStep('Completing...');
        }
      }
    };

    return () => {
      console.log = originalConsoleLog;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreed) {
      toast.error("Agreement Required", {
        description: "Please agree to be contacted for loan enquiry"
      });
      return;
    }
    
    setIsSubmitting(true);
    setLoadingStep("Creating loan application...");
    
    try {
      await mutate({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        branch: formData.branch,
      }, {
        onSuccess: () => {
          // Reset form after successful submission
          setFormData({
            fullName: "",
            email: "",
            phone: "",
            branch: "",
            agreed: false,
          });
          setLoadingStep(null);
        },
        onError: () => {
          setLoadingStep(null);
        }
      });
    } catch (error) {
      console.error("Error in form submission:", error);
      setLoadingStep(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="relative bg-cover bg-center py-16" 
      style={{
        backgroundImage: `url('https://cdn.lendingstack.in/lendingstack/system/hfs-login-background.png')`
      }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="w-[70%]">
          <h1 className="text-6xl font-bold text-gray-50y mb-6">
            {/*Welcome to HFS Finance*/}
          </h1>
          <p className="text-2xl text-gray-50/90">
            {/*Your trusted partner in home financing solutions*/}
          </p>
        </div>
        <div className="w-[30%] bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-primary mb-6">
            Request For A New Loan
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
              disabled={isSubmitting || isPending}
            />
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              disabled={isSubmitting || isPending}
            />
            <Input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
              disabled={isSubmitting || isPending}
            />
            <select
              className="w-full p-2 border rounded"
              value={formData.branch}
              onChange={(e) =>
                setFormData({ ...formData, branch: e.target.value })
              }
              required
              disabled={isSubmitting || isPending}
            >
              <option value="">Select Branch</option>
              <option value="agra">Agra</option>
              <option value="akurdi">Akurdi</option>
              <option value="ambala">Ambala</option>
              <option value="bangalore">Bangalore</option>
              <option value="bhopal">Bhopal</option>
              <option value="bikaner">Bikaner</option>
              <option value="bilaspur">Bilaspur</option>
              <option value="chennai">Chennai</option>
              <option value="CBE-GANDHIPURAM">Cbe Gandhipuram</option>
              <option value="gwalior">Gwalior</option>
              <option value="hyderabad">Hyderabad</option>
              <option value="indore">Indore</option>
              <option value="itarsi">Itarsi</option>
              <option value="jabalpur">Jabalpur</option>
              <option value="jaipur">Jaipur</option>
              <option value="jodhpur">Jodhpur</option>
              <option value="kalyan">Kalyan</option>
              <option value="lucknow">Lucknow</option>
              <option value="MADURAI">Madurai</option>
              <option value="mumbai">Mumbai</option>
              <option value="nagpur">Nagpur</option>
              <option value="nashik">Nashik</option>
              <option value="new-delhi">New Delhi</option>
              <option value="noida">Noida</option>
              <option value="panchkula">Panchkula</option>
              <option value="pune">Pune</option>
              <option value="pithampur">Pithampur (M.P)</option>
              <option value="raipur">Raipur</option>
              <option value="ratlam">Ratlam</option>
              <option value="rohtak">Rohtak</option>
              <option value="surat">Surat</option>
              <option value="vadodara">Vadodara</option>
              <option value="vasai">Vasai</option>
              <option value="vidisha">Vidisha</option>
              <option value="vijaywada">Vijaywada</option>
            </select>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreed}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, agreed: checked as boolean })
                }
                disabled={isSubmitting || isPending}
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to be contacted by representative for loan enquiry
              </label>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary text-white"
              disabled={isSubmitting || isPending}
            >
              {isSubmitting || isPending ? (loadingStep || "Processing...") : "SUBMIT"}
            </Button>
            
            {isError && (
              <div className="text-sm text-red-500">
                {error instanceof Error ? error.message : "An error occurred during submission"}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
