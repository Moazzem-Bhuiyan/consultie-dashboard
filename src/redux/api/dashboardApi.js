import { baseApi } from "./baseApi";

const dashBoardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: ({ revenue_year, earning_year }) => ({
        url: `/meta/dashboard?revenue_year=${revenue_year}&earning_year=${earning_year}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetDashboardDataQuery } = dashBoardApi;
