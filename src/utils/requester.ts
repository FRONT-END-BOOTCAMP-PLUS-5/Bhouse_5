import axios, { AxiosInstance, AxiosStatic, AxiosRequestConfig, AxiosResponse } from "axios";
import qs from "qs";
// eslint-disable-next-line import/no-cycle
import { getSessionId } from "./auth";

class Requester {
  client: AxiosInstance;
  baseURL: string;

  constructor(client: AxiosStatic) {
    // Ensure this logic runs only on the client
    if (typeof window === "undefined") {
      throw new Error("Requester must be used in a client-side context.");
    }

    const { host } = window.location;
    let baseURL = process.env.NEXT_APP_API_ENDPOINT_PROD || "";

    if (host.includes(process.env.NEXT_APP_HOST_LOCAL || "")) {
      baseURL = process.env.NEXT_APP_API_ENDPOINT_LOCAL || "";
    } else if (host === process.env.NEXT_APP_HOST_DEV) {
      baseURL = process.env.NEXT_APP_API_ENDPOINT_DEV || "";
    } else if (host === process.env.NEXT_APP_HOST_PROD) {
      baseURL = process.env.NEXT_APP_API_ENDPOINT_PROD || "";
    }

    const instance = client.create({
      baseURL,
      withCredentials: true,
      headers: {
        // "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

    // Add a request interceptor to attach the Access Token
    instance.interceptors.request.use(
      (config) => {
        const accessToken = typeof window !== "undefined" ? localStorage.getItem('accessToken') : null;

        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Avoid setting Content-Type globally here
        if (config.data instanceof FormData) {
          delete config.headers['Content-Type']; // Let Axios handle it
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add a response interceptor to handle token expiration
    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          console.warn("Access token expired. Attempting to refresh...");

          const refreshToken = typeof window !== "undefined" ? localStorage.getItem('refreshToken') : null;

          if (refreshToken) {
            try {
              // Request a new Access Token using the Refresh Token
              const response = await axios.post(
                `${baseURL}/api/auth/refresh`,
                { refreshToken }
              );

              const newAccessToken = response.data.accessToken;

              // Update localStorage with the new Access Token
              if (typeof window !== "undefined") {
                localStorage.setItem('accessToken', newAccessToken);
              }

              // Retry the original request with the new token
              error.config.headers.Authorization = `Bearer ${newAccessToken}`;
              return instance.request(error.config);
            } catch (refreshError) {
              console.error("Token refresh failed:", refreshError);
              if (typeof window !== "undefined") {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
              }
              window.location.href = "/login"; // Redirect to login if refresh fails
            }
          } else {
            console.warn("No refresh token available. Redirecting to login...");
            if (typeof window !== "undefined") {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
            }
            window.location.href = "/login"; // Redirect to login if no refresh token
          }
        }

        return Promise.reject(error);
      }
    );

    this.client = instance;
    this.baseURL = baseURL;
  }

  async request<T = any>(
    methodName: "get" | "post" | "put" | "delete",
    url: string,
    params?: Record<string, any> | FormData,
    type?: "file" | "json",
    headers?: Record<string, string>
  ): Promise<AxiosResponse<T>> {
    this.client.defaults.headers.common["SessionId"] = getSessionId() || "";

    const isFile = type === "file";

    // Adjust headers for file uploads
    const adjustedHeaders = isFile ? undefined : { "Content-Type": "application/json", ...headers };

    const requestConfig: AxiosRequestConfig = {
      method: methodName,
      url,
      headers: adjustedHeaders,
      data: methodName === "post" || methodName === "put" ? params : undefined, // Request body
      params: methodName === "get" || methodName === "delete" ? params : undefined, // Query parameters
      paramsSerializer: (parameters) => {
        return qs.stringify(parameters, { arrayFormat: "repeat" });
      },
    };

    try {
      const response = await this.client.request<T>(requestConfig);
      console.log("### API REQUEST SUCCESS (from requester): ", response);
      return response;
    } catch (error) {
      console.error("### API REQUEST ERROR (from requester): ", error);
      throw error;
    }
  }

  get<T = any>(url: string, params?: Record<string, any>): Promise<AxiosResponse<T>> {
    return this.request("get", url, params);
  }

  post<T = any>(url: string, params?: Record<string, any>): Promise<AxiosResponse<T>> {
    return this.request("post", url, params);
  }

  put<T = any>(url: string, params?: Record<string, any>): Promise<AxiosResponse<T>> {
    return this.request("put", url, params);
  }

  delete<T = any>(url: string, params?: Record<string, any>): Promise<AxiosResponse<T>> {
    return this.request("delete", url, params);
  }

  filePost<T = any>(url: string, formData: FormData): Promise<AxiosResponse<T>> {
    return this.request("post", url, formData, "file");
  }

}

export default typeof window !== "undefined" ? new Requester(axios) : null;
