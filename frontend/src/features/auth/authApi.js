import { baseApi } from '../../../services/baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: '/api/v1/auth/login',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Auth']
    }),

    register: builder.mutation({
      query: (data) => ({
        url: '/api/v1/auth/register',
        method: 'POST',
        body: data
      })
    }),
    refreshToken: builder.mutation({
      query: (data) => ({
        url: '/api/v1/auth/refresh-token',
        method: 'POST',
        body: data
      })
    }),
    // checkAuth: builder.query({
    //   query: () => '/api/v1/auth/admin-user/check',
    //   providesTags: ['Auth']
    // }),

    logout: builder.query({
      query: () => '/api/v1/auth/logout',
      providesTags: ['Auth']
    }),

    forgotPassword: builder.mutation({
      query: (data) => ({
        url: '/api/v1/auth/forgot-password',
        method: 'POST',
        body: data
      })
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: '/api/v1/auth/reset-password',
        method: 'POST',
        body: data
      })
    }),

    // Also add a mutation for updating the profile if you want "Save Changes" to work
    updateProfile: builder.mutation({
      query: (data) => ({
        url: 'api/v1/user/Dashboard/update/userProfile',
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['User'],
      
    }),

    updateImage: builder.mutation({
      query: (data) => ({
        url: '/api/v1/user/Dashboard/update-profile-image',
        method: 'PATCH',
        body: data,
        formData: true,
      }),
      // invalidatesTags: ['User'],
      
    }),

    // GET: Fetch User Details by ID
    getUserDetails: builder.query({
      query: (id) => ({
        url: `/api/v1/auth/get-userDetails/${id}`,
        method: 'GET'
      }),
      providesTags: ['User'] // Mark this data with the 'User' tag
    }),

    changePassword: builder.mutation({
      query: (credentials) => ({
        url: 'api/v1/user/Dashboard/change-password',
        method: 'PATCH',
        body: credentials
      })
    }),

    deleteAccount: builder.mutation({
      query: () => ({
        url: '/api/v1/user/Dashboard/deleteUser',
        method: 'DELETE'
      }),
      invalidatesTags: ['User']
    }),

    
  })
});

export const {
  useGetProfileQuery, // Export this
  useUpdateProfileMutation,
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useCheckAuthQuery,
  useLazyLogoutQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useDeleteAccountMutation,
  useChangePasswordMutation,
  useUpdateImageMutation,
  useGetUserDetailsQuery,
} = authApi;










