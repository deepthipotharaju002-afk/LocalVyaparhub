import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://localvyaparhub.com/LocalVyaparHub/public/api";

// 🔐 API Keys
const SECRET = "localvyaparhubroute";
const KEY = "localvyaparhub@1234#";

// --------------------------------------------------
// Helpers
// --------------------------------------------------
const getToken = async () => {
  return await AsyncStorage.getItem("token");
};

const getJsonHeaders = async () => {
  const token = await getToken();
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Secret: SECRET,
    Key: KEY,
    "X-Secret": SECRET,
    "X-Key": KEY,
    Authorization: token ? `Bearer ${token}` : "",
  };
};

const getFormHeaders = async () => {
  const token = await getToken();
  return {
    Accept: "application/json",
    Secret: SECRET,
    Key: KEY,
    "X-Secret": SECRET,
    "X-Key": KEY,
    Authorization: token ? `Bearer ${token}` : "",
  };
};

// ==================================================
// AUTH
// ==================================================
export const sendOtp = async (mobile) => {
  const res = await fetch(`${BASE_URL}/v1/auth/send-otp`, {
    method: "POST",
    headers: await getJsonHeaders(),
    body: JSON.stringify({ mobile }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to send OTP");
  return data;
};

export const verifyOtp = async (mobile, otp) => {
  const res = await fetch(`${BASE_URL}/v1/auth/verify-otp`, {
    method: "POST",
    headers: await getJsonHeaders(),
    body: JSON.stringify({ mobile, otp }),
  });
  const data = await res.json();

  if (data.token) {
    await AsyncStorage.setItem("token", data.token);
    await AsyncStorage.setItem("user", JSON.stringify(data.user));
  }

  if (!res.ok) throw new Error(data.message || "Invalid OTP");
  return data;
};

export const getMe = async () => {
  const res = await fetch(`${BASE_URL}/v1/auth/me`, {
    headers: await getJsonHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Unauthorized");
  return data;
};

export const logout = async () => {
  await fetch(`${BASE_URL}/v1/auth/logout`, {
    method: "POST",
    headers: await getJsonHeaders(),
  });
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("user");
};

// ==================================================
// LISTINGS (PAGINATED)
// ==================================================

// ✅ ALL LISTINGS (SEE ALL)
// utils/api.js
export const fetchListings = async (page = 1, filters = {}) => {
  const query = new URLSearchParams({
    page,
    per_page: 20,
    ...filters,
  }).toString();

  const url = `${BASE_URL}/listings?${query}`;

  const res = await fetch(url, {
    method: "GET",
    headers: await getJsonHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch listings");
  }

  return await res.json(); // ✅ return FULL object
};

// ==================================================
// CREATE LISTING (SAVE BUSINESS)
// ==================================================
export const saveListing = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/listings`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        // ✅ DO NOT set Content-Type for FormData
      },
      body: formData,
    });

    // Read raw response first (important for debugging)
    const rawText = await res.text();
    console.log("SAVE LISTING RAW RESPONSE:", rawText);

    let data;
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch (parseErr) {
      console.error("JSON PARSE ERROR:", parseErr);
      throw new Error("Server returned invalid JSON");
    }

    if (!res.ok) {
      console.error("SAVE LISTING BACKEND ERROR:", data);
      throw new Error(
        data?.message ||
        data?.error ||
        "Failed to save business"
      );
    }

    console.log("SAVE LISTING SUCCESS:", data);
    return data;

  } catch (err) {
    console.error("saveListing error:", err.message || err);
    throw err;
  }
};


// ==================================================
// SINGLE LISTING (DEEP LINK / DETAILS)
// ==================================================
export const fetchListingById = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/listings/${id}`, {
      method: "GET",
      headers: await getJsonHeaders(),
    });

    if (!res.ok) {
      throw new Error("Listing not found");
    }

    const json = await res.json();

    // Laravel returns {status: true, data: {...}}
    return json.data || json;

  } catch (err) {
    console.error("fetchListingById error:", err);
    throw err;
  }
};



// ✅ FEATURED LISTINGS (HOME)
export const fetchFeaturedListings = async (limit = 10) => {
  const res = await fetch(
    `${BASE_URL}/listings/featured?limit=${limit}`,
    {
      headers: await getJsonHeaders(),
    }
  );

  const json = await res.json();
  return json.data || [];
};

// ✅ LOCATION FILTER (HOT LOCATIONS)
export const getListingsByLocation = async (page = 1, filters = {}) => {
  const params = { 
    page,
    per_page: 20, // ✅ ADD THIS
    ...filters 
  };
  const query = new URLSearchParams(params).toString();

  const res = await fetch(
    `${BASE_URL}/listings/by-location?${query}`,
    {
      headers: await getJsonHeaders(),
    }
  );

  if (!res.ok) throw new Error("Failed to fetch location listings");
  return await res.json();
};

// ✅ CATEGORY FILTER (PAGINATED)
export const getListingsByCategory = async (page = 1, categoryId) => {
  const query = new URLSearchParams({
    page,
    category_id: categoryId,
  }).toString();

  const res = await fetch(
    `${BASE_URL}/listings/by-category?${query}`,
    {
      headers: await getJsonHeaders(),
    }
  );

  if (!res.ok) throw new Error("Failed to fetch category listings");
  return await res.json();
};

// ✅ USER LISTINGS (PAGINATED)
export const getListingsByUser = async (page = 1) => {
  const userData = await AsyncStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  if (!user?.id) throw new Error("User not logged in");

  const res = await fetch(
    `${BASE_URL}/listings/by-user/${user.id}?page=${page}`,
    {
      headers: await getJsonHeaders(),
    }
  );

  if (!res.ok) throw new Error("Failed to fetch user listings");
  return await res.json();
};

export const getCategoryListings = async (categoryId) => {
  try {
    const res = await fetch(`${BASE_URL}/categories/${categoryId}`, {
      method: "GET",
      headers: await getJsonHeaders(),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch category listings");
    }

    return data.data || data; // Laravel returns {status: true, data: []}
  } catch (err) {
    console.error("Get Category Listings error:", err);
    throw err;
  }
};
export const getCategories = async () => {
  try {
    const res = await fetch(`${BASE_URL}/categories`, {
      method: "GET",
      headers: await getJsonHeaders(),  // must exist
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch categories");
    }

    return data.data || data; // Laravel returns {status: true, data: []}
  } catch (err) {
    console.error("Get Categories error:", err);
    throw err;
  }
};
// ==================================================
// MAP – LISTINGS WITH VILLAGE LOCATION
// ==================================================
export const getListingsWithVillages = async () => {
  const res = await fetch(`${BASE_URL}/listings-with-villages`, {
    headers: await getJsonHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch map listings");

  const json = await res.json();
  return json.data || [];
};


// ==================================================
// LOCATIONS
// ==================================================
export const getCountries = async () =>
  (await fetch(`${BASE_URL}/locations/countries`, { headers: await getJsonHeaders() })).json();

export const getStates = async (countryId) =>
  (await fetch(`${BASE_URL}/locations/states/${countryId}`, { headers: await getJsonHeaders() })).json();

export const getDistricts = async (stateId) =>
  (await fetch(`${BASE_URL}/locations/districts/${stateId}`, { headers: await getJsonHeaders() })).json();

export const getMandals = async (districtId) =>
  (await fetch(`${BASE_URL}/locations/mandals/${districtId}`, { headers: await getJsonHeaders() })).json();

export const getVillages = async (mandalId) =>
  (await fetch(`${BASE_URL}/locations/villages/${mandalId}`, { headers: await getJsonHeaders() })).json();

// ==================================================
// BOOKMARKS
// ==================================================
export const addBookmark = async (listingId) => {
  const token = await AsyncStorage.getItem("token");

  if (!token) {
    throw new Error("User not logged in");
  }

  const res = await fetch(`${BASE_URL}/bookmark`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      listing_id: listingId,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  return await res.json();
};


export const removeBookmark = async (bookmarkId) =>
  (await fetch(`${BASE_URL}/bookmarks/${bookmarkId}`, {
    method: "DELETE",
    headers: await getJsonHeaders(),
  })).json();

export const getBookmarks = async () => {
  const token = await AsyncStorage.getItem("token");
  if (!token) return [];

  const res = await fetch(`${BASE_URL}/bookmarks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch bookmarks");
  }

  return await res.json();
};


// ==================================================
// REVIEWS
// ==================================================
export const addReview = async ({ listing_id, rating, comment }) => {
  const token = await AsyncStorage.getItem("token");

  if (!token) {
    throw new Error("User not logged in");
  }

  const res = await fetch(`${BASE_URL}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      listing_id,
      rating,
      comment,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  return await res.json();
};


export const getReviews = async (listingId) => {
  const res = await fetch(
    `${BASE_URL}/reviews?listing_id=${listingId}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch reviews");
  }

  const data = await res.json();
  return data.data || [];
};


export const updateReview = async ({ reviewId, rating, comment }) =>
  (await fetch(`${BASE_URL}/reviews/${reviewId}`, {
    method: "PUT",
    headers: await getJsonHeaders(),
    body: JSON.stringify({ rating, comment }),
  })).json();

export const deleteReview = async (reviewId) =>
  (await fetch(`${BASE_URL}/reviews/${reviewId}`, {
    method: "DELETE",
    headers: await getJsonHeaders(),
  })).json();

// ==================================================
// BUSINESS VIEWS
// ==================================================
export const recordBusinessView = async (listingId) => {
  const res = await fetch(`${BASE_URL}/listing/${listingId}/views`, {
    method: "POST",
    headers: await getJsonHeaders(),
  });

  const data = await res.json();
  return data.total_views || 0;
};


export const getRatingStats = async (listingId) => {
  try {
    const res = await fetch(`${BASE_URL}/reviews/stats?listing_id=${listingId}`, {
      method: "GET",
      headers: await getJsonHeaders(),
    });

    const data = await res.json();
    return {
      average: data.average_rating || 0,
      count: data.total_reviews || 0,
    };
  } catch (err) {
    console.error("Fetch rating stats error:", err);
    return { average: 0, count: 0 };
  }
};

