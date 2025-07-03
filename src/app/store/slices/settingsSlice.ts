import requester from "@/utils/requester";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { setLoading } from "./loadingSlice";

interface AuthState {
  isLoggedIn: boolean;
  profilePhoto: string | null;
  userId: number | null;
  activeProfileId: number | null;
}

interface SettingsState {
  auth: AuthState;
  profile: {
    name: string;
    email: string;
  };
  preferences: {
    theme: string;
    notifications: boolean;
  };
  loading: boolean;
  error: string | null;
  user: null;
  profiles: [];
}

const initialState: SettingsState = {
  auth: {
    isLoggedIn: false,
    profilePhoto: null,
    userId: null,
    activeProfileId: null,
  },
  profile: {
    name: "John Doe",
    email: "john.doe@example.com",
  },
  preferences: {
    theme: "light",
    notifications: true,
  },
  loading: false,
  error: null,
  user: null,
  profiles: [],
};

//Async thunk for login
export const loginAsync = createAsyncThunk(
  "settings/login",
  async (
    credentials: { email: string; password: string },
    thunkAPI
  ): Promise<{
    isLoggedIn: boolean;
    profilePhoto: string | null;
    userId: string | null;
    activeProfileId: string | null;
  }> => {
    try {
      thunkAPI.dispatch(setLoading(true));

      const loginResponse = await requester!.post(
        "/api/auth/login",
        credentials
      );
      if (loginResponse.status === 200) {
        localStorage.setItem("accessToken", loginResponse.data.accessToken);
        localStorage.setItem("refreshToken", loginResponse.data.refreshToken);
      }

      const statusResponse = await requester!.get("/api/auth/status");
      const statusData = statusResponse.data;

      return {
        isLoggedIn: statusData.loggedIn,
        profilePhoto: statusData.profilePhoto || null,
        userId: statusData.userId || null,
        activeProfileId: statusData.activeProfileId || null,
      };
    } catch (err) {
      console.error("LoginAsync error:", err);
      return thunkAPI.rejectWithValue(
        "Failed to login and fetch authentication status"
      );
    } finally {
      thunkAPI.dispatch(setLoading(false));
    }
  }
);

// Async thunk for logout
export const logoutAsync = createAsyncThunk(
  "settings/logout",
  async (_, thunkAPI) => {
    try {
      // Perform logout API call
      const response = await requester!.post("/api/auth/logout");
      if (response.status === 200) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        return {
          isLoggedIn: false,
          profilePhoto: null,
          userId: null,
          activeProfileId: null,
        };
      }
      throw new Error("Logout failed");
    } catch (error) {
      console.error("LogoutAsync error:", error);
      return thunkAPI.rejectWithValue("Failed to logout");
    }
  }
);

// Async thunk for status
export const checkLoginAsync = createAsyncThunk(
  "settings/status",
  async (_, thunkAPI) => {
    try {
      // Perform status API call
      const response = await requester!.get("/api/auth/status");
      if (response.data) {
        return {
          isLoggedIn: response.data.loggedIn,
          profilePhoto: response.data.profilePhoto || null,
          userId: response.data.userId || null,
          activeProfileId: response.data.activeProfileId || null,
        };
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Handle unauthorized user (token expired)
        console.error("Unauthorized: Logging out user");
        return thunkAPI.rejectWithValue("Unauthorized");
      } else if (error.response?.status === 404) {
        // Route not found, but this is not an auth issue
        console.warn("404 error: Unrelated to authentication");
        return thunkAPI.rejectWithValue("Route not found");
      }
      console.error("Unexpected error:", error);
      return thunkAPI.rejectWithValue("Unexpected error");
    }
  }
);

// Async thunk for updating profile
export const updateProfileAsync = createAsyncThunk(
  "settings/updateProfile",
  async (profile: { name: string; email: string }, thunkAPI) => {
    try {
      const response = await requester!.post("/api/settings/profile", profile);
      return response.data; // 실제 응답 데이터 반환
    } catch (error) {
      console.error("Failed to update profile:", error);
      return thunkAPI.rejectWithValue("Failed to update profile");
    }
  }
);

// Async thunk for updating preferences
export const updatePreferencesAsync = createAsyncThunk(
  "settings/updatePreferences",
  async (preferences: { theme: string; notifications: boolean }, thunkAPI) => {
    try {
      const response = await requester!.post(
        "/api/settings/preferences",
        preferences
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update preferences:", error);
      return thunkAPI.rejectWithValue("Failed to update preferences");
    }
  }
);

export const fetchUserProfileAsync = createAsyncThunk(
  "user/fetchProfile",
  async (_, thunkAPI) => {
    try {
      const response = await requester!.get("/api/user");
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data || "Failed to fetch user"
      );
    }
  }
);

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginAsync.fulfilled,
        (
          state,
          action: PayloadAction<{
            isLoggedIn: boolean;
            profilePhoto: string;
            userId: number;
            activeProfileId: number;
          }>
        ) => {
          state.loading = false;
          state.auth.isLoggedIn = action.payload.isLoggedIn;
          state.auth.profilePhoto = action.payload.profilePhoto;
          state.auth.userId = action.payload.userId;
          state.auth.activeProfileId = action.payload.activeProfileId;
        }
      )
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to login";
      });
    // Logout handling
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        logoutAsync.fulfilled,
        (
          state,
          action: PayloadAction<{
            isLoggedIn: boolean;
            profilePhoto: string | null;
            userId: number | null;
            activeProfileId: number | null;
          }>
        ) => {
          state.loading = false;
          state.auth.isLoggedIn = action.payload.isLoggedIn;
          state.auth.profilePhoto = action.payload.profilePhoto;
          state.auth.userId = action.payload.userId;
          state.auth.activeProfileId = action.payload.activeProfileId;
        }
      )
      .addCase(logoutAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to logout";
      });

    // check status
    builder
      .addCase(
        checkLoginAsync.fulfilled,
        (
          state,
          action: PayloadAction<{
            isLoggedIn: boolean;
            profilePhoto: string | null;
            userId: number | null;
            activeProfileId: number | null;
          }>
        ) => {
          state.auth.isLoggedIn = action.payload.isLoggedIn;
          state.auth.profilePhoto = action.payload.profilePhoto;
          state.auth.userId = action.payload.userId;
          state.auth.activeProfileId = action.payload.activeProfileId;
        }
      )
      .addCase(checkLoginAsync.rejected, (state, action) => {
        if (action.payload === "Unauthorized") {
          // Only log out for unauthorized errors
          state.auth.isLoggedIn = false;
          state.auth.profilePhoto = null;
        } else if (action.payload === "Route not found") {
          // Ignore 404 errors for auth
          console.warn("Route not found, no auth changes.");
        }
      });

    // Update Profile
    builder
      .addCase(updateProfileAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateProfileAsync.fulfilled,
        (state, action: PayloadAction<{ name: string; email: string }>) => {
          state.loading = false;
          state.profile = action.payload;
        }
      )
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update profile";
      });

    // Update Preferences
    builder
      .addCase(updatePreferencesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updatePreferencesAsync.fulfilled,
        (
          state,
          action: PayloadAction<{ theme: string; notifications: boolean }>
        ) => {
          state.loading = false;
          state.preferences = action.payload;
        }
      )
      .addCase(updatePreferencesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update preferences";
      });
    builder
      .addCase(fetchUserProfileAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfileAsync.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.profiles = action.payload.profiles;
        state.loading = false;
      })
      .addCase(fetchUserProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default settingsSlice.reducer;
