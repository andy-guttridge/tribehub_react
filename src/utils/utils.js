import jwtDecode from "jwt-decode"

// data param is data returned from the API when user logs in.
export const setTokenTimestamp = (data) => {
  // Use jwtDecode to decode the refresh token. Token expiry date is returned with a key of exp.
  const refreshTokenTimestamp = jwtDecode(data?.refresh_token).exp;
  localStorage.setItem("refreshTokenTimestamp", refreshTokenTimestamp);
}

// Check if there is a refresh token, if yes return true as user has been logged in.
export const shouldRefreshToken = () => {
  return !!localStorage.getItem('refreshTokenTimestamp');
}

// Clean up local storage
export const removeTokenTimestamp = () => {
  localStorage.removeItem('refreshTokenTimestamp');
}
