"use client";

export type AnalyticsPayload = Record<
  string,
  boolean | number | string | undefined
>;

type AnalyticsWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
  va?: {
    track?: (eventName: string, payload?: Record<string, unknown>) => void;
  };
};

export function trackAnalyticsEvent(
  eventName: string,
  payload: AnalyticsPayload = {},
) {
  if (typeof window === "undefined") {
    return;
  }

  const eventDetail = {
    eventName,
    payload,
    timestamp: Date.now(),
  };
  const analyticsWindow = window as AnalyticsWindow;

  window.dispatchEvent(
    new CustomEvent("learnnfun:analytics", {
      detail: eventDetail,
    }),
  );

  analyticsWindow.dataLayer?.push({
    event: eventName,
    ...payload,
  });

  analyticsWindow.va?.track?.(eventName, payload);
}
