const { baseApi } = require("./baseApi");

const ContentModerationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    moderateContent: builder.mutation({
      query: (data) => ({
        url: "/content-moderation/moderate",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["contentModeration"],
    }),
    getContentModeration: builder.query({
      query: ({ limit, page, searchText }) => ({
        url: "/feeds",
        method: "GET",
        params: { limit, page, searchText },
      }),
      providesTags: ["contentModeration"],
    }),
    deleteContentModeration: builder.mutation({
      query: (id) => ({
        url: `/content-moderation/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["contentModeration"],
    }),
    getContentModerationById: builder.query({
      query: (id) => ({
        url: `/feeds/${id}`,
        method: "GET",
      }),
      providesTags: ["contentModeration"],
    }),
    updateContentModeration: builder.mutation({
      query: ({ id, status }) => ({
        url: `/feeds/status/${id}`,
        method: "PATCH",
        body: {
          status,
        },
      }),
      invalidatesTags: ["contentModeration"],
    }),
  }),
});

export const {
  useModerateContentMutation,
  useGetContentModerationQuery,
  useDeleteContentModerationMutation,
  useGetContentModerationByIdQuery,
  useUpdateContentModerationMutation,
} = ContentModerationApi;
