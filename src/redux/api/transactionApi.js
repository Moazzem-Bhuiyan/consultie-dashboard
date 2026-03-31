const { baseApi } = require("./baseApi");

const TransactionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTransactions: build.query({
      query: ({ page, limit, searchText }) => ({
        url: "/meta/transaction",
        method: "GET",
        params: { page, limit, searchTerm: searchText },
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
  }),
});

export const {
  useGetTransactionsQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = TransactionApi;
