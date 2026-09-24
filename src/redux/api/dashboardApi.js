import { baseApi } from "./baseApi";

const dashBoardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();

        // Always send filterType (default to last_30_days if nothing selected)
        if (params.filterType) {
          searchParams.append("filterType", params.filterType);
        }

        // Optional params depending on filterType
        if (params.year) searchParams.append("year", params.year);
        if (params.month) searchParams.append("month", params.month);
        if (params.weekStart)
          searchParams.append("weekStart", params.weekStart);
        if (params.startDate)
          searchParams.append("startDate", params.startDate);
        if (params.endDate) searchParams.append("endDate", params.endDate);

        const queryString = searchParams.toString();
        return {
          url: `/meta/dashboard${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useGetDashboardDataQuery } = dashBoardApi;
