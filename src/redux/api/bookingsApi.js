import { baseApi } from "./baseApi";

export const BOOKING_STATUS = {
  pending: "pending",
  declined: "declined",
  confirmed: "confirmed",
  running: "running",
  completed: "completed",
  not_responded: "not_responded",
  cancelled: "cancelled",
};

const BookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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

    // get all booking
    getAllBookings: builder.query({
      query: ({
        page = 1,
        limit = 10,
        searchTerm = "",
        status = "",
        startDate = "",
        endDate = "",
      }) => {
        const params = new URLSearchParams();
        params.append("page", String(page));
        params.append("limit", String(limit));
        if (searchTerm) params.append("searchTerm", searchTerm);
        if (status) params.append("status", status);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        return {
          url: `/bookings?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["booking"],
    }),

    getSingleBooking: builder.query({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: "GET",
      }),
      providesTags: ["booking"],
    }),
  }),
});

export const {
  useGetExpertBookingQuery,
  useGetAllBookingsQuery,
  useGetSingleBookingQuery,
} = BookingApi;
