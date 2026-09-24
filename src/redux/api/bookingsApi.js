import { baseApi } from "./baseApi";

const BookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // get single booking
    // bookingApi.js
    getExpertBooking: builder.query({
      query: ({ id, page = 1, limit = 10, search }) => {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", limit);
        if (search) params.append("search", search);

        return {
          url: `/bookings/expert/${id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["booking"],
    }),
  }),
});

export const { useGetExpertBookingQuery } = BookingApi;
