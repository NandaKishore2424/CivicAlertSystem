// Simple placeholder API functions for auth operations

export const signinUser = async (userData) => {
  // This would be replaced with an actual API call in production
  console.log("Signing in user:", userData);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // For demo purposes, we'll accept any valid-looking email/password
  if (!userData.email || !userData.password) {
    throw new Error('Email and password are required');
  }
  
  // Mock successful response
  return {
    token: "mock-user-auth-token",
    user: {
      id: "user123",
      email: userData.email,
      name: "Test User"
    }
  };
};

export const signinOfficial = async (userData) => {
  // This would be replaced with an actual API call in production
  console.log("Signing in official:", userData);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // For demo purposes, we'll accept any valid-looking email/password
  if (!userData.email || !userData.password) {
    throw new Error('Email and password are required');
  }
  
  // Mock successful response
  return {
    token: "mock-official-auth-token",
    user: {
      id: "official123",
      email: userData.email,
      name: "Government Official",
      department: "Emergency Services"
    }
  };
};

export const signupUser = async (userData) => {
  // This would be replaced with an actual API call in production
  console.log("Signing up user:", userData);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // For demo purposes, we'll accept any valid-looking data
  if (!userData.email || !userData.password) {
    throw new Error('Email and password are required');
  }
  
  // Mock successful response
  return {
    success: true,
    message: "User registered successfully"
  };
};

export const signupOfficial = async (userData) => {
  // This would be replaced with an actual API call in production
  console.log("Signing up official:", userData);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // For demo purposes, we'll accept any valid-looking data
  if (!userData.email || !userData.password || !userData.verificationDoc) {
    throw new Error('Email, password and verification document are required');
  }
  
  // Mock successful response
  return {
    success: true,
    message: "Official registration submitted for verification"
  };
};