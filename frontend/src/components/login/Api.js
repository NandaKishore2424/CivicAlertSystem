import axios from 'axios';

// Function to handle normal user signup
export const signupUser = async (formData) => {
    try {
        const response = await axios.post('http://localhost:5000/api/users/signup/user', formData, {
            headers: {
                'Content-Type': 'application/json',  // Use application/json for JSON data
            },
        });
        return response.data; // Modify based on your API's response structure
    } catch (error) {
        throw new Error(error.response?.data?.message || "Something went wrong");
    }
};

// Function to handle official user signup (for government officials)
export const signupOfficial = async (formData) => {
    try {
        const response = await axios.post('http://localhost:5000/api/users/signup/official', formData, {
            headers: {
                'Content-Type': 'application/json',  // Use application/json for JSON data
            },
        });
        return response.data; // Modify based on your API's response structure
    } catch (error) {
        throw new Error(error.response?.data?.message || "Something went wrong");
    }
};


export const signinUser = async (formData) => {
  try {
    const response = await axios.post('http://localhost:5000/api/users/signin/user', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data; // Modify based on your API's response structure
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};

// Function to handle official user sign-in (for government officials)
export const signinOfficial = async (formData) => {
  try {
    const response = await axios.post('http://localhost:5000/api/users/signin/official', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data; // Modify based on your API's response structure
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};
