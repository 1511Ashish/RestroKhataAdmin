import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

export type SubscriptionStatus = "ACTIVE" | "SUSPENDED" | "DELETED";
export type SubscriptionPlan = "TRIAL" | "STARTER" | "GROWTH" | "ENTERPRISE";

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN";
  avatarUrl?: string | null;
  lastLoginAt?: string | null;
}

export interface AdminProfileResponse extends Partial<AdminProfile> {
  data?: Partial<AdminProfile>;
  result?: Partial<AdminProfile>;
  profile?: Partial<AdminProfile>;
  admin?: Partial<AdminProfile>;
  user?: Partial<AdminProfile>;
}

export interface TenantResponse {
  [key: string]: unknown;
  _id?: string;
  id?: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
  phone?: string;
  mobile?: string;
  contactNumber?: string;
  address?: string;
  city?: string;
  location?: string;
  storeLocation?: string;
  image?: string;
  logo?: string;
  avatar?: string;
  isVerified?: boolean;
  verified?: boolean;
  whatsapp?: string | boolean;
  whatsappNumber?: string;
  ownerUserId?: {
    _id?: string;
    name?: string;
    email?: string;
  } | null;
  owner?: {
    name?: string;
    email?: string;
  };
  ownerName?: string;
  email?: string;
  lastLogin?: string | null;
  lastLoginAt?: string | null;
  metrics?: {
    orders?: number;
    invoices?: number;
    staff?: number;
    users?: number;
  };
  subscription?: {
    plan?: SubscriptionPlan;
    status?: SubscriptionStatus;
    expiresAt?: string;
  };
}

export type TenantsResponse =
  | TenantResponse[]
  | {
      data?: TenantResponse[];
      result?: TenantResponse[];
      tenants?: TenantResponse[];
    };

export interface DashboardStatsPayload {
  totals: {
    tenants?: number;
    users?: number;
    orders?: number;
    invoices?: number;
  };
  recentTenants?: TenantResponse[];
}

interface DashboardSummary {
  totalTenants?: number;
  totalUsers?: number;
  totalOrders?: number;
  totalInvoices?: number;
}

export interface DashboardStatsResponse {
  totals?: DashboardStatsPayload["totals"];
  summary?: DashboardSummary;
  recentTenants?: TenantResponse[];
  totalTenants?: number;
  totalUsers?: number;
  totalOrders?: number;
  totalInvoices?: number;
  tenants?: number;
  users?: number;
  orders?: number;
  invoices?: number;
  recent_tenants?: TenantResponse[];
  latestTenants?: TenantResponse[];
  data?: DashboardStatsResponse;
  result?: DashboardStatsResponse;
  dashboard?: DashboardStatsResponse;
  contactNumber?: number;
}

export interface UpdateSubscriptionPayload {
  tenantId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  expiresAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  accessToken?: string;
  profile?: AdminProfile;
  admin?: AdminProfile;
  user?: AdminProfile;
  message?: string;
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "https://restro-backend-hpx8.onrender.com/api/admin",
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = window.localStorage.getItem("admin_token");

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    window.localStorage.removeItem("admin_token");
  }

  return result;
};

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Dashboard", "Tenants"],
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStatsResponse, void>({
      query: () => "/dashboard",
      providesTags: ["Dashboard"],
    }),
    getTenants: builder.query<TenantsResponse, void>({
      query: () => "/tenants",
      providesTags: [{ type: "Tenants" as const, id: "LIST" }],
    }),
    updateSubscription: builder.mutation<TenantResponse, UpdateSubscriptionPayload>({
      query: ({ tenantId, ...body }) => ({
        url: `/tenants/${tenantId}/subscription`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Tenants", id: arg.tenantId },
        { type: "Tenants", id: "LIST" },
        "Dashboard",
      ],
    }),
    logIn: builder.mutation<LoginResponse, LoginPayload>({
      query: (body) => ({
        url: `/login`,
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const token = data.token ?? data.accessToken;

          if (token) {
            window.localStorage.setItem("admin_token", token);
          }

          dispatch(adminApi.util.invalidateTags(["Dashboard", "Tenants"]));
          dispatch(adminApi.util.prefetch("getProfile", undefined, { force: true }));
        } catch {
          window.localStorage.removeItem("admin_token");
        }
      },
    }),
    getTenantBackup: builder.query<Blob, string>({
      query: (tenantId) => ({
        url: `/tenants/${tenantId}/backup`,
        responseHandler: async (response) => response.blob(),
        cache: "no-cache",
      }),
      keepUnusedDataFor: 0,
    }),
    getProfile: builder.query<AdminProfileResponse, void>({
      query: () => "/profile",
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetTenantsQuery,
  useUpdateSubscriptionMutation,
  useLazyGetTenantBackupQuery,
  useGetProfileQuery,
  useLogInMutation,
} = adminApi;
