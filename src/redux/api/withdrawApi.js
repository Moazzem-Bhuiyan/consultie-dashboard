const { baseApi } = require("./baseApi");

const withDrawApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ===================== WITHDRAW LIST =====================
    getWithdrawalRequests: builder.query({
      query: ({ page, limit, searchTerm, status, startDate, endDate }) => ({
        url: `/withdraw`,
        method: "GET",
        params: {
          page,
          limit,
          searchTerm: searchTerm || undefined,
          status: status || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        },
      }),
      providesTags: ["withdrawalRequests"],
    }),

    // ===================== SINGLE WITHDRAW =====================
    getWithdrawalById: builder.query({
      query: (id) => ({
        url: `/withdraw/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "withdrawalRequests", id }],
    }),

    // ===================== MANUAL HOLD =====================
    manualHoldWithdraw: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/withdraw/${id}/manual-hold`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: ["withdrawalRequests"],
    }),

    // ===================== MANUAL RELEASE =====================
    manualReleaseWithdraw: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/withdraw/${id}/manual-release`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: ["withdrawalRequests"],
    }),

    // (keep your old refund endpoints if still needed)
    getRefundRequests: builder.query({
      query: ({ page, limit, searchText }) => ({
        url: `/refunds?page=${page}&limit=${limit}&searchTerm=${searchText}`,
        method: "GET",
      }),
      providesTags: ["refundRequests"],
    }),
    updateRefundRequest: builder.mutation({
      query: (payload) => ({
        url: `/refunds/status/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["refundRequests"],
    }),
    deniedRefundRequest: builder.mutation({
      query: ({ id, data }) => ({
        url: `/refunds/${id}`,
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["refundRequests"],
    }),
  }),
});

export const {
  useGetWithdrawalRequestsQuery,
  useGetWithdrawalByIdQuery,
  useManualHoldWithdrawMutation,
  useManualReleaseWithdrawMutation,
  useGetRefundRequestsQuery,
  useUpdateRefundRequestMutation,
  useDeniedRefundRequestMutation,
} = withDrawApi;
