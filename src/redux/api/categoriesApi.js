const { baseApi } = require("./baseApi");

const CategoriesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCategories: build.query({
      query: ({ page, limit, searchText }) => ({
        url: "/categories",
        method: "GET",
        params: { page, limit, searchTerm: searchText },
      }),
      providesTags: ["categories"],
    }),
    createCategory: build.mutation({
      query: (payload) => ({
        url: "/categories",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["categories"],
    }),
    updateCategory: build.mutation({
      query: ({ payload, id }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["categories"],
    }),
    deleteCategory: build.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["categories"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = CategoriesApi;
