const { baseApi } = require("./baseApi");

const TransactionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTransactions: build.query({
      query: ({ page, limit, searchText, status, startDate, endDate }) => ({
        url: "/meta/transaction",
        method: "GET",
        params: {
          page,
          limit,
          searchTerm: searchText || undefined,
          status: status || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        },
      }),
      providesTags: ["transactions"],
    }),
    getTransactionById: build.query({
      query: ({ transactionID }) => ({
        url: `/payments/${transactionID}`,
        method: "GET",
      }),
      providesTags: ["transactions"],
    }),
    createTransaction: build.mutation({
      query: (payload) => ({
        url: "/transactions",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["transactions"],
    }),
    updateTransaction: build.mutation({
      query: ({ payload, id }) => ({
        url: `/transactions/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["transactions"],
    }),
    deleteTransaction: build.mutation({
      query: (id) => ({
        url: `/transactions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["transactions"],
    }),

    // refund
    createRefund: build.mutation({
      query: ({ id, data }) => ({
        url: `/payments/${id}/refund`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["transactions"],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
  useGetTransactionByIdQuery,
  useCreateRefundMutation,
} = TransactionApi;
