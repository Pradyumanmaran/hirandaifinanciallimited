import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

// Loan application types based on the payload reference
export type LoanApplicant = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employmentType: string;
  gender?: string;
  dateOfBirth?: string;
  pincode?: string;
};

export type LoanRequest = {
  fullName: string;
  email: string;
  phone: string;
  branch: string;
  loanAmount?: number;
  loanType?: string;
};

// Mapping of branches to pincodes
export const BRANCH_PINCODES: Record<string, string> = {
  "agra": "282001",
  "akurdi": "411035",
  "ambala": "133001",
  "bangalore": "560001",
  "bhopal": "462001",
  "bikaner": "334001",
  "bilaspur": "495001",
  "chennai": "600001",
  "CBE-GANDHIPURAM": "641014",
  "gwalior": "474001",
  "hyderabad": "500001",
  "indore": "452001",
  "itarsi": "461111",
  "jabalpur": "482001",
  "jaipur": "302001",
  "jodhpur": "342001",
  "kalyan": "421301",
  "lucknow": "226001",
  "MADURAI": "625001",
  "mumbai": "400001",
  "nagpur": "440001",
  "nashik": "422001",
  "new-delhi": "110001",
  "noida": "201301",
  "panchkula": "134109",
  "pune": "411001",
  "pithampur": "454775",
  "raipur": "492001",
  "ratlam": "457001",
  "rohtak": "124001",
  "surat": "395001",
  "vadodara": "390001",
  "vasai": "401202",
  "vidisha": "464001",
  "vijaywada": "520001",
};

// API endpoints from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050";
const AUTH_ENDPOINT = `${API_BASE_URL}/alpha/v1/auth/client`;
const LOAN_ENDPOINT = `${API_BASE_URL}/alpha/v1/application/short`;
const WORKFLOW_BUILD_ENDPOINT = `${API_BASE_URL}/alpha/v1/workflow/build`;
const WORKFLOW_EXECUTION_ENDPOINT = `${API_BASE_URL}/alpha/v1/workflow/execution`;

// Authentication credentials from environment variables
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
const X_TENANT_DOMAIN = import.meta.env.VITE_X_TENANT_DOMAIN;


// Function to get authentication token
const getAuthToken = async (): Promise<string> => {
  try {
    const response = await fetch(AUTH_ENDPOINT, {
      method: "POST",
      headers: {
        "X-Platform": "EMPLOYEE_API",
        "Content-Type": "application/json",
        "X-tenant-domain": X_TENANT_DOMAIN
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    });

    if (!response.ok) {
      throw new Error(`Auth error: ${response.status}`);
    }

    const data = await response.json();
    if (data.status !== 1 || !data.data.token) {
      throw new Error("Failed to get authentication token");
    }

    return data.data.token;
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
};

// Function to build the workflow
const buildWorkflow = async (applicationId: string, token: string): Promise<any> => {
  try {
    console.log("Building workflow for application ID:", applicationId);
    const payload = {
      workflow_type: "LEAD_CREATION",
      source_id: String(applicationId)
    };

    console.log("Workflow build payload:", payload);

    const response = await fetch(WORKFLOW_BUILD_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "X-tenant-domain": X_TENANT_DOMAIN,
        "X-Platform": "EMPLOYEE_API"
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Workflow build error: ${response.status}`);
    }

    const data = await response.json();
    if (data.status !== 1) {
      throw new Error("Failed to build workflow");
    }

    return data;
  } catch (error) {
    console.error("Workflow build error:", error);
    throw error;
  }
};

// Function to execute the workflow
const executeWorkflow = async (applicationId: string, stepId: string, token: string): Promise<any> => {
  try {
    console.log("Executing workflow for application ID:", applicationId, "with step ID:", stepId);
    const payload = {
      workflow_type: "LEAD_CREATION",
      source_id: String(applicationId),
      execute_step_id: String(stepId)
    };

    console.log("Workflow execution payload:", payload);

    const response = await fetch(WORKFLOW_EXECUTION_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "X-tenant-domain": X_TENANT_DOMAIN,
        "X-Platform": "EMPLOYEE_API"
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Workflow execution error: ${response.status}`);
    }

    const data = await response.json();
    if (data.status !== 1) {
      throw new Error("Failed to execute workflow");
    }

    return data;
  } catch (error) {
    console.error("Workflow execution error:", error);
    throw error;
  }
};

// Function to submit loan request and process workflow
export const submitLoanRequest = async (data: LoanRequest): Promise<any> => {
  try {
    // Get authentication token first
    const token = await getAuthToken();

    // Split fullName into first and last name
    const nameParts = data.fullName.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Get the pincode for the selected branch
    const pincode = BRANCH_PINCODES[data.branch] || "";

    // Create payload according to the API requirements
    const payload = {
      "application.type": "ENQUIRY_APPLICATION",
      "application.apply_capacity": "PERSON",
      "application.employment_type": "SALARIED",
      "application.salutation": "Mrs",
      "application.loan_type_code": "LAP",
      "application.loan_info[0].sub_loan_type": "203",
      "application.applicant_name": `${firstName} ${lastName}`,
      "application.mobile": data.phone,
      "application.email": data.email,
      "application.contact_name": `${firstName} ${lastName}`,
      "applicants[0].applicant_category": "PERSON",
      "applicants[0].applicant_type": "PRIMARY",
      "applicants[0].personal.primary_id_type": "PAN",
      "applicants[0].personal.salutation": "Mrs",
      "applicants[0].personal.addresses[0].address_type": "CURRENT_RESIDENCE",
      "applicants[0].personal.addresses[0].pincode": pincode,
      "applicants[0].personal.mobile": data.phone,
      "applicants[0].personal.email": data.email,
      "applicants[0].personal.first_name": firstName,
      "applicants[0].personal.last_name": lastName,
      "application.loan_amount": String(data.loanAmount || "3500000"),
      // "application.terms_and_conditions": 1
    };

    // Make the API request with the bearer token
    const response = await fetch(LOAN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "X-tenant-domain": X_TENANT_DOMAIN,
        "X-Platform": "EMPLOYEE_API"

      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const createResponse = await response.json();
    if (createResponse.status !== 1 || !createResponse.application_id) {
      throw new Error("Failed to create loan application");
    }

    // Ensure the application_id is treated as a string
    const applicationId = String(createResponse.application_id);
    console.log("Loan application created successfully with ID:", applicationId);

    // Step 2: Build the workflow using the application_id
    const buildResponse = await buildWorkflow(applicationId, token);
    console.log("Workflow built successfully:", buildResponse);

    // Step 3: Extract the first stage's first step ID
    const firstStage = buildResponse.data.stages[0];
    if (!firstStage || !firstStage.steps || !firstStage.steps.length) {
      throw new Error("No stages or steps found in the workflow response");
    }

    const firstStep = firstStage.steps[0];
    if (!firstStep || !firstStep.id) {
      throw new Error("First step ID not found in the workflow response");
    }

    const firstStepId = String(firstStep.id);
    console.log("First step ID:", firstStepId);

    // Step 4: Execute the workflow with the first step ID
    const executeResponse = await executeWorkflow(applicationId, firstStepId, token);
    console.log("Workflow execution successful:", executeResponse);

    return {
      createResponse,
      buildResponse,
      executeResponse
    };
  } catch (error) {
    console.error("Error in loan request process:", error);
    throw error;
  }
};

// React Query hook for submitting loan request
export const useSubmitLoanRequest = () => {
  return useMutation({
    mutationFn: submitLoanRequest,
    onSuccess: (data) => {
      toast.success("Loan request submitted successfully!", {
        description: `Application ID: ${data.createResponse.application_id}`,
      });
    },
    onError: (error) => {
      toast.error("Failed to submit loan request", {
        description: error instanceof Error ? error.message : "Please try again later.",
      });
    },
  });
}; 