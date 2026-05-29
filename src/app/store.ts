import { Middleware, configureStore, isRejectedWithValue } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { adminApi } from "@/features/adminApi";

const rtkQueryErrorMiddleware: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const payload = typeof action.payload === "object" && action.payload !== null ? action.payload : null;
    const payloadData = payload && "data" in payload ? payload.data : null;
    const payloadMessage =
      typeof payloadData === "object" && payloadData !== null && "message" in payloadData
        ? payloadData.message
        : undefined;
    const error =
      "data" in action.error
        ? JSON.stringify(action.error.data)
        : payloadMessage ?? action.error?.message ?? "Request failed";

    toast.error("Request failed", {
      description: typeof error === "string" ? error : "Something went wrong.",
    });
  }

  return next(action);
};

export const store = configureStore({
  reducer: {
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(adminApi.middleware, rtkQueryErrorMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
