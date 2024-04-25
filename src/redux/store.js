import { combineSlices, configureStore } from "@reduxjs/toolkit";
import userSlice from "./users/userSlice";
import { createLogger } from "redux-logger";

const middlewares = []

const logger = createLogger({
	collapsed: (getState, action, logEntry) => !logEntry.error
})

middlewares.push(logger)

const store = configureStore({
	reducer: combineSlices(userSlice),
	devTools: process.env.NODE_ENV !== 'production',
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middlewares)
})

export default store