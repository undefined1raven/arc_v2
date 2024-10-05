import { configureStore } from "@reduxjs/toolkit";
import globalStyleReducer from "../hooks/globalStyles";
import loadingScreenMessageReducer from "@/hooks/loadingScreenMessage";
import { localUserIDsReducer } from "@/hooks/localUserIDs";
import arcFeatureConfigReducer from "@/hooks/arcFeatureConfig";
import { activeUserIDReducer } from "@/hooks/activeUserID";
import arcChunks from "@/hooks/arcChunks";
export default configureStore({
  reducer: {
    globalStyle: globalStyleReducer,
    loadingScreenMessage: loadingScreenMessageReducer,
    localUserIDs: localUserIDsReducer,
    arcFeatureConfig: arcFeatureConfigReducer,
    activeUserID: activeUserIDReducer,
    arcChunks: arcChunks,
  },
});
