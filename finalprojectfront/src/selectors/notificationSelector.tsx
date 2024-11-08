import { createSelector } from "reselect";

import { RootState } from "../redux/store";

const selectNotifications = (state: RootState) => state.notifications;

export const selectNotificationsMemoized = createSelector(
  [selectNotifications],
  (notifications) => notifications
);
