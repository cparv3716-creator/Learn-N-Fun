"use client";

import { useEffect } from "react";
import type { AnalyticsPayload } from "@/lib/analytics";
import { trackAnalyticsEvent } from "@/lib/analytics";

type AnalyticsViewTrackerProps = {
  eventName: string;
  payload?: AnalyticsPayload;
};

export function AnalyticsViewTracker({
  eventName,
  payload,
}: AnalyticsViewTrackerProps) {
  useEffect(() => {
    trackAnalyticsEvent(eventName, payload);
  }, [eventName, payload]);

  return null;
}
