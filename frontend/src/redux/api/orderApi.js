import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const orderApi=createApi({
    reducerPath:"orderApi",
    tagTypes:['Order','AdminOrders'],
    baseQuery:fetchBaseQuery({baseUrl :"/api"}),
    endpoints:(builder)=>({
        createNewOrder:builder.mutation({
            query(body)
            {
                return{
                    url:"/orders/new",
                    method:"POST",
                    body,
                };
            },
        }),
        myOrders:builder.query({
            query:()=>`/me/orders`,
            
        }),
        orderDetails:builder.query({
            query:(id)=>`/orders/${id}`,
            providesTags:['Order']
            
        }),
        stripeCheckoutSession:builder.mutation({
            query(body){
                return{
                    url:"/payment/checkout_session",
                    method:"POST",
                    body,
                }
            }
        }),
        getAdminOrders:builder.query({
      query:()=>`/admin/orders`,
      providesTags:['AdminOrders'],
    }),
    updateOrder:builder.mutation({
            query({id,body})
            {
                return{
                    url:`/admin/orders/${id}`,
                    method:"PUT",
                    body,
                };
            },
            invalidatesTags:["Order"]
        }),
        deleteOrder:builder.mutation({
            query(id)
            {
                return{
                    url:`/admin/orders/${id}`,
                    method:"DELETE",
                    
                };
            },
            invalidatesTags:['AdminOrders'],
        }),
        
    }),
});

export const {useCreateNewOrderMutation,useStripeCheckoutSessionMutation,useMyOrdersQuery,useOrderDetailsQuery,useGetAdminOrdersQuery,useUpdateOrderMutation,useDeleteOrderMutation}=orderApi;