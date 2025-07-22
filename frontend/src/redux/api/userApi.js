import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setIsAuthenticated, setLoading, setUser } from '../features/userSlice';

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
  baseUrl: "/api",
  credentials: "include",
}),


  tagTypes:["User","AdminUsers","AdminUser"],
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => "/me",
      transformResponse: (response) => response.user,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
  try {
    const { data } = await queryFulfilled;

    if (data && data._id) { // or any other reliable field
      dispatch(setUser(data));
      dispatch(setIsAuthenticated(true));
    } else {
      dispatch(setIsAuthenticated(false));
    }

    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setIsAuthenticated(false));
    dispatch(setLoading(false));
    console.log(error);
  }
},

      providesTags:["User"],

    }),
    updateProfile:builder.mutation({
      query(body)
      {
        return{
          url:"/me/update",
          method:"PUT",
          body,
        };
      },
      invalidatesTags:["User"],
    }),
    uploadAvatar:builder.mutation({
      query(body)
      {
        return{
          url:"/me/upload_avatar",
          method:"PUT",
          body,
        };
      },
      invalidatesTags:["User"],
    }),
    updatePassword:builder.mutation({
      query(body)
      {
        return{
          url:"/me/password/update",
          method:"PUT",
          body,
        };
      },
      
    }),  
    forgotPassword:builder.mutation({
      query(body)
      {
        return{
          url:"/password/forgot",
          method:"POST",
          body,
        };
      },
      
    }),  
    resetPassword:builder.mutation({
      query({token,body})
      {
        return{
          url:`/password/reset/${token}`,
          method:"PUT",
          body,
        };
      },
      
    }),  
    getAdminUsers:builder.query({
            query:()=>`/admin/users`,
            providesTags:['AdminUsers']
        }),
        getUserDetails:builder.query({
            query:(id)=>`/admin/users/${id}`,
            providesTags:['AdminUser']
        }),
        updateUser:builder.mutation({
      query({id,body})
      {
        return{
          url:`/admin/users/${id}`,
          method:"PUT",
          body,
        };
      },
      
    }),
    deleteUser:builder.mutation({
      query(id,)
      {
        return{
          url:`/admin/users/${id}`,
          method:"DELETE",
          
        };
      },
      invalidatesTags:["AdminUsers"]
    }),
  }),
});

export const { useGetMeQuery,useUpdateProfileMutation,useUploadAvatarMutation ,useUpdatePasswordMutation,useForgotPasswordMutation,useResetPasswordMutation,useGetAdminUsersQuery,useGetUserDetailsQuery,useUpdateUserMutation,useDeleteUserMutation} = userApi;

