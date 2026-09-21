const { baseApi } = require("./baseApi");

const WithDrawalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWithdrawals: builder.query({
      query: (params) => ({
        url: "/withdraw",
        method: "GET",
        params,
      }),
      providesTags: ["withdrawals"],
    }),

    getWithdrawalById: builder.query({
      query: (id) => ({
        url: `/withdraw/${id}`,
        method: "GET",
      }),
      providesTags: ["withdrawals"],
    }),
    updateHoldPeriod: builder.mutation({
      query: (data) => ({
        url: "/withdrawals/update-hold-period",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["withdrawals"],
    }),

    chnageWithdrawalStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/withdraw/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["withdrawals"],
    }),
  }),
});

export const {
  useGetWithdrawalsQuery,
  useUpdateHoldPeriodMutation,
  useChnageWithdrawalStatusMutation,
  useGetWithdrawalByIdQuery,
} = WithDrawalApi;
