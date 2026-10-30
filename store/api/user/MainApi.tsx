import {
  ContentPostType,
  FeedResponse,
  GetMyPostsOnly,
  GetPostType,
  GetProfiles,
} from "@/store/type/user";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const MainApi = createApi({
  reducerPath: "MainApi",
  tagTypes: [
    "PostEditData",
    "SinglePostData",
    "AlertPref",
    "ConnectionPref",
    "CommunityPref",
    "PropertyPref",
    "senderInquires",
    "Comments",
    "NewsFeeds",
    "MypostCount",
    "CheckProfile",
    "otherPastData",
    "myPost",
    "myProfile",
    "advertisementMedia",
    "getPostById",
    "Advatizemets",
    "savedAds",
    "checkReview",
    "RecivedRequest",
    "ConnectedUses",
    "SendedRequest",
    "AlerCount",
    "unreadChats",
    "conversations",
    "GetReviews",
    "YourPosts",
    "singlePost",
    "userRevies"
  ],
  baseQuery: fetchBaseQuery({ baseUrl: "https://www.homeilove.co.uk/api/" }),
  endpoints: (builder) => ({
    getYourpost: builder.query<FeedResponse, GetPostType>({
      query: ({ userid, page }) => ({
        url: `getUserGeneralPosts?user_id=${userid}&page=${page}`,
        method: "GET",
      }),
      providesTags:["YourPosts"]
    }),
     getSingleGeneralPost: builder.query<FeedResponse, any>({
      query: ({ userid, post_id,id }) => ({
        url: `getSingleGeneralPost?user_id=${userid}&post_id=${post_id}`,
        method: "GET",
      }),
    
    }),
    getHomepost: builder.query<FeedResponse, GetPostType>({
      query: ({ userid, page }) => ({
        url: `getHomeFeed/?userid=${userid}&page=${page}`,
        method: "GET",
      }),
      providesTags: ["NewsFeeds"],
    }),
    getContentpost: builder.query<FeedResponse, ContentPostType>({
      query: ({ userid, page, type }) => ({
        url: `getContentFeeds/?userid=${userid}&page=${page}&type=${type}`,
        method: "GET",
      }),
    }),
    createProfile: builder.mutation<any, FormData>({
      query: (formatData) => ({
        url: `createProfile`,
        method: "POST",
        body: formatData,
      }),
      invalidatesTags:["CheckProfile"]
    }),
    updateProfile: builder.mutation<any, FormData>({
      query: (formatData) => ({
        url: `updateProfile`,
        method: "POST",
        body: formatData,
      }),
      invalidatesTags:["myProfile"]
    }),
    getSinglePost: builder.query<any, any>({
      query: ({ type, id,user_id }) => ({
        url: `getSinglePostapi?type=${type}&id=${id}&user_id=${user_id}`,
        method: "GET",
        
      }),
      providesTags: (r: any, e: any, arg: { id: any }) => [
        { type: "SinglePostData", id: arg.id },
      ],
    }),
    postProperty: builder.mutation<any, FormData>({
      query: (formatData) => ({
        url: `property/create`,
        method: "POST",
        body: formatData,
      }),
    }),
    postCommunity: builder.mutation<any, FormData>({
      query: (formatData) => ({
        url: `community/create`,
        method: "POST",
        body: formatData,
      }),
    }),
    getProfiles: builder.query<any, GetProfiles>({
      query: ({ id }) => ({
        url: `check-profiles?id=${id}`,
        method: "GET",
      }),
      providesTags: ["CheckProfile"],
    }),
    getProfilesForConection: builder.query<any, GetProfiles>({
      query: ({ id }) => ({
        url: `checkProfilesForconnection?id=${id}`,
        method: "GET",
      }),
    }),
    postGeneralPost: builder.mutation<any, FormData>({
      query: (data) => ({
        url: `generalPost/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags:["YourPosts"]
    }),
     deleteGeneralPost: builder.mutation<any, FormData>({
      query: (data) => ({
        url: `deleteGeneralPost`,
        method: "POST",
        body: data,
      }),
    }),
    editGeneralPost: builder.mutation<any, FormData>({
      query: (data) => ({
        url: `editGeneralPost`,
        method: "POST",
        body: data,
      }),
    }),
    setPropertyPrefrence: builder.mutation<any, any>({
      query: (data) => ({
        url: `setPropertyPrefrence`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PropertyPref"],
    }),
    setCommunityPrefrence: builder.mutation<any, any>({
      query: (data) => ({
        url: `setCommunityPrefrence`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CommunityPref"],
    }),
    setConectionPrefrence: builder.mutation<any, any>({
      query: (data) => ({
        url: `setConnectionPrefrence`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ConnectionPref"],
    }),
    getInquieryAgent: builder.query<any, any>({
      query: (data) => ({
        url: `searchAgentForInquery?lat=${data.lat}&lng=${data.lng}&radius=${data.radius}&inquiry_type=${data.inquiry_type} &per_page=${data.per_page}&page=${data.page}&type=${data.type}&user_id=${data.user_id}`,
        method: "GET",
      }),
    }),
    updateAdvertisementMedia: builder.mutation<any, FormData>({
      query: (data) => ({
        url: `updateAdvertisementMedia`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["advertisementMedia"],
    }),
    postAdvatizement: builder.mutation<any, FormData>({
      query: (data) => ({
        url: `postAdvatizement`,
        method: "POST",
        body: data,
      }),
      invalidatesTags:["Advatizemets"]
    }),
    getYorSalePosts: builder.query<any, any>({
      query: ({ page, per_page, type, user_id, profile_type }) => ({
        url: `get/userProperty?page=${page}&per_page=${per_page}&type=${type}&user_id=${user_id}&profile_type=${profile_type}`,
        method: "GET",
      }),
      providesTags:["myPost"]
    }),
    userAgentPastPostsApi: builder.query<any, any>({
      query: ({ page, per_page, user_id }) => ({
        url: `get/userAgentPastPostsApi?page=${page}&per_page=${per_page}&user_id=${user_id}`,
        method: "GET",
      }),
    }),
    SendVisistRequest: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: `sendVisitRequest`,
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      }),
    }),
    getPostCount: builder.query<any, any>({
      query: ({ user_id }) => ({
        url: `getPostCount?user_id=${user_id}`,
        method: "GET",
      }),
      providesTags: ["MypostCount"],
    }),
    getDataForEdit: builder.query<any, GetMyPostsOnly>({
      query: ({ type, id }) => ({
        url: `getDataForEditPost?type=${type}&id=${id}`,
        method: "GET",
      }),
      providesTags: (r: any, e: any, arg: { id: any }) => [
        { type: "PostEditData", id: arg.id },
      ],
    }),
    updateProperty: builder.mutation<any, FormData>({
      query: (formatData) => ({
        url: `property/update`,
        method: "POST",
        body: formatData,
      }),
      invalidatesTags: (result, error, formData) => {
        const id = formData.get("post_id");
        if (!id || typeof id !== "string") return [];
        return [
          { type: "PostEditData" as const, id },
          { type: "SinglePostData" as const, id },
        ];
      },
    }),
    getHomeFeeds: builder.query<any, GetMyPostsOnly>({
      query: ({ type, id, page, limit }) => ({
        url: `getHomeFeed?userid=${id}&page=${page}&limit=${limit}&type=${type}`,
        method: "GET",
      }),
    }),
    updateCommunity: builder.mutation<any, FormData>({
      query: (formatData) => ({
        url: `community/update`,
        method: "POST",
        body: formatData,
      }),
      invalidatesTags: (result, error, formData) => {
        const id = formData.get("post_id");
        if (!id || typeof id !== "string") return [];
        return [
          { type: "PostEditData" as const, id },
          { type: "SinglePostData" as const, id },
        ];
      },
    }),
    deleteAlertApi:builder.mutation<any, any>({
      query: ({ alert_id,user_id }) => ({
        url: `/deleteAlertApi?alert_id=${alert_id}&user_id=${user_id}`,
        method: "POST",
      }),
      invalidatesTags: ["AlertPref","AlerCount"],
    }),
    saveAllerts: builder.mutation<any, FormData>({
      query: (formatdata) => ({
        url: `/saveUpdateAlert`,
        method: "POST",
        body: formatdata,
      }),
      invalidatesTags: ["AlertPref","AlerCount"],
    }),
    getUserAlertsEdit:builder.query<any, GetMyPostsOnly>({
      query: ({ type, id }) => ({
        url: `getUserAlertsEdit?alert_id=${id}`,
        method: "GET",
      }),
      providesTags: ["AlertPref"],
    }),
    alertCountApi:builder.query<any, any>({
      query: ({ type, id }) => ({
        url: `alertCountApi?user_id=${id}`,
        method: "GET",
      }),
      providesTags:["AlerCount"]
     
    }),
    getAlertPref: builder.query<any, GetMyPostsOnly>({
      query: ({ type, id }) => ({
        url: `GetAlertPref?user_id=${id}`,
        method: "GET",
      }),
      providesTags: ["AlertPref"],
    }),
    getConnectionPref: builder.query<any, GetMyPostsOnly>({
      query: ({ type, id }) => ({
        url: `GetConnectionPref?user_id=${id}`,
        method: "GET",
      }),
      providesTags: ["ConnectionPref"],
    }),
    getCommunityPref: builder.query<any, GetMyPostsOnly>({
      query: ({ type, id }) => ({
        url: `GetCommunityPref?user_id=${id}`,
        method: "GET",
      }),
      providesTags: ["CommunityPref"],
    }),
    getPropertyPref: builder.query<any, GetMyPostsOnly>({
      query: ({ type, id }) => ({
        url: `GetPropertyPref?user_id=${id}`,
        method: "GET",
      }),
      providesTags: ["PropertyPref"],
    }),
    getSingleProfile: builder.query<any, any>({
      query: ({ type, id, user_id }) => ({
        url: `getSingleProfile?type=${type}&id=${Number(id)}&user_id=${user_id}`,
        method: "GET",
      }),
      providesTags:["myProfile"]
    }),
    getDeveloperNames: builder.query({
      query: () => ({
        url: "/getDeveloperNames",
        method: "GET",
      }),
    }),
    getProfileNames: builder.query<any, any>({
      query: ({ type }) => ({
        url: `/getProfileNames?type=${type}`,
        method: "GET",
      }),
    }),
    getTrendingProfiles: builder.query<any, any>({
      query: ({ type }) => ({
        url: `getTrendingProfiles/?type=${type}`,
        method: "GET",
      }),
    }),

    getPropertyList: builder.query<any, any>({
      query: ({
        page,
        property_for,
        property_type,
        property_sub_type,
        condition,
        address,
        city,
        state,
        zip,
        lat,
        lng,
        radius,
        available_on,
        pet_allowers,
        min_price_range,
        max_price_range,
        max_rent_range,
        no_of_baths,
        sale_type,
        min_beds,
        purposeful_type,
        max_beds,
        tenure,
        tinency_tenure,
        price_type,
        sort,
        furnishing_type,
        purposeful_property,
          user_id,
      }) => ({
        url: "getPropertyListing",
        method: "GET",
        params: {
          page,
          purposeful_type,
          property_for,
          property_type,
          property_sub_type,
          condition,
          pet_allowers,
          address,
          city,
          state,
          zip,
          lat,
          lng,
          radius,
          min_price_range,
          max_price_range,
          max_rent_range,
          no_of_baths,
          sale_type,
          price_type,
          purposeful_property,
          tenure,
          furnishing_type,
          tinency_tenure,
          available_on,
          min_beds,
          max_beds,
          sort,
           user_id,
        },
      }),
    }),
    getCommunityList: builder.query<any, any>({
      query: ({
        page,
        developer_name,
        estate_type,
        development_status,
        address,
        city,
        state,
        zip,
        lat,
        lng,
        radius,
        min_range,
        max_range,
        sort,
        user_id,
        name,
      }) => ({
        url: "getCommunityListing",
        method: "GET",
        params: {
          page,
          developer_name,
          estate_type,
          development_status,
          address,
          city,
          state,
          zip,
          lat,
          lng,
          radius,
          min_range,
          max_range,
          sort,
          user_id,
          name,
        },
      }),
    }),
    getProfileListing: builder.query<any, any>({
      query: ({
        id,
        type,
        page,
        address,
        city,
        state,
        zip,
        lat,
        lng,
        radius,
        sort,
        user_id,
      }) => ({
        url: `GetProfilesListing`,
        method: "GET",
        params: {
          id,
          type,
          page,
          address,
          city,
          state,
          zip,
          lat,
          lng,
          radius,
          sort,
          user_id,
        },
      }),
    }),
    insertInquiry: builder.mutation<any, any>({
      query: (formatdata: FormData) => ({
        url: "insertInquiry",
        method: "POST",
        body: formatdata,
      }),
    }),
    getsendedInquiery: builder.query<any, any>({
      query: ({ id, page }) => ({
        url: `/getInquries?user_id=${id}&page=${page}`,
        method: "GET",
      }),
      providesTags: ["senderInquires"],
    }),
    deletSendedInquiry: builder.mutation<any, any>({
      query: (formatdata: FormData) => ({
        url: "deletSendedInquries",
        method: "POST",
        body: formatdata,
      }),
      invalidatesTags: ["senderInquires"],
    }),
    deleterecivedInquiries: builder.mutation<any, any>({
      query: (formatdata: FormData) => ({
        url: "deleterecivedInquiries",
        method: "POST",
        body: formatdata,
      }),
      invalidatesTags: ["senderInquires"],
    }),
    getRecivedInquiery: builder.query<any, any>({
      query: ({ id, page }) => ({
        url: `/getRecivedInquiries?user_id=${id}&page=${page}`,
        method: "GET",
      }),
      providesTags: ["senderInquires"],
    }),
    getReviews: builder.query<any, any>({
      query: ({ id, profile_type, type }) => ({
        url: `/get/userReviews?user_id=${id}&profile_type=${profile_type}&type=${type}`,
        method: "GET",
      }),
      providesTags:["GetReviews"]
    }),
    checkReviewApi: builder.query<any, any>({
      query: ({ sender_id,receiver_profile_id,profile_type }) => ({
        url: `checkReviewApi?sender_id=${sender_id}&receiver_profile_id=${receiver_profile_id}&profile_type=${profile_type}`,
        method: "GET",
      }),
      providesTags:["checkReview"] 
    }),
    sendRequest: builder.mutation<any, any>({
      query: (formatdata: FormData) => ({
        url: "sendRequestApi",
        method: "POST",
        body: formatdata,
      }),
       invalidatesTags:["myProfile","RecivedRequest",
    "ConnectedUses",
    "SendedRequest"]
    }),
  unfollowApi: builder.mutation<any, any>({
      query: (formatdata: FormData) => ({
        url: "unfollowApi",
        method: "POST",
        body: formatdata,
      }),
        invalidatesTags:["myProfile","RecivedRequest",
    "ConnectedUses",
    "SendedRequest"]
    }),
      UpdateConnectionApi: builder.mutation<any, any>({
      query: (formatdata: FormData) => ({
        url: "UpdateConnectionApi",
        method: "POST",
        body: formatdata,
      }),
        invalidatesTags:["myProfile","RecivedRequest",
    "ConnectedUses",
    "SendedRequest"]
    }),
  cancelRequestApi: builder.mutation<any, any>({
      query: (formatdata: FormData) => ({
        url: "cancelRequestApi",
        method: "POST",
        body: formatdata,
      }),
       invalidatesTags:["myProfile","RecivedRequest",
    "ConnectedUses",
    "SendedRequest"]
    }),
  acceptRequestApi: builder.mutation<any, any>({
      query: (formatdata: FormData) => ({
        url: "acceptRequestApi",
        method: "POST",
        body: formatdata,
      }),
       invalidatesTags:["myProfile","RecivedRequest","ConnectedUses","SendedRequest"]  
    }),
    deletePropertyPreferencesApi: builder.mutation<any, any>({
      query: (formatdata: FormData) => ({
        url: "deletePropertyPreferencesApi",
        method: "POST",
        body: formatdata,
      }),
    }),
    deleteConnectionPreferencesApi: builder.mutation<any, any>({
      query: (formatdata: FormData) => ({
        url: "deleteConnectionPreferencesApi",
        method: "POST",
        body: formatdata,
      }),
    }),
    deleteCommunityPreferencesApi: builder.mutation<any, any>({
      query: (formatdata: FormData) => ({
        url: "deleteCommunityPreferencesApi",
        method: "POST",
        body: formatdata,
      }),
    }),
    postCommentApi: builder.mutation<any, any>({
      query: (data) => ({
        url: "postCommentApi",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SinglePostData", "Comments"],
    }),
    postReplyApi: builder.mutation<any, any>({
      query: (data) => ({
        url: "postReplyApi",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Comments"],
    }),
    deleteCommentApi: builder.mutation({
      query: (id) => ({
        url: `deleteCommentApi`,
        method: "DELETE",
        body: { comment_id: id },
      }),
      invalidatesTags: ["Comments", "NewsFeeds"],
    }),
    getPostCommentsApi: builder.query<any, any>({
      query: ({ post_id }) => ({
        url: `/getPostCommentsApi?post_id=${post_id}`,
        method: "GET",
      }),
      providesTags: ["Comments"],
    }),
    getMyTrendingProfiles: builder.query<any, any>({
      query: ({ id }) => ({
        url: `getMyTrendingProfiles?user_id=${id}`,
        method: "GET",
      }),
    }),

    saveItemApi: builder.mutation<any, any>({
      query: (data) => ({
        url: "saveItemApi",
        method: "POST",
        body: data,
      }),
      invalidatesTags:["savedAds","SinglePostData","myProfile"]
    }),
    unsaveItemApi: builder.mutation<any, any>({
      query: (data) => ({
        url: "unsaveItemApi",
        method: "POST",
        body: data,
      }),
      invalidatesTags:["savedAds","SinglePostData","myProfile"]
    }),
    likePost: builder.mutation<any, any>({
      query: (data) => ({
        url: "likePost",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["NewsFeeds","getPostById"],
    }),
    unlikePost: builder.mutation<any, any>({
      query: (data) => ({
        url: "unlikePost",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["NewsFeeds","getPostById"],
    }),
    getConnectedUsersApi: builder.query<any, any>({
      query: ({ id }) => ({
        url: `getConnectedUsersApi?user_id=${id}`,
        method: "GET",
      }),
      providesTags:["ConnectedUses"]
    }),
    getReceivedRequestsApi: builder.query<any, any>({
      query: ({ id }) => ({
        url: `getReceivedRequestsApi?user_id=${id}`,
        method: "GET",
      }),
      providesTags:["RecivedRequest"]
    }),
    getSentRequestsApi: builder.query<any, any>({
      query: ({ id }) => ({
        url: `getSentRequestsApi?sender_id=${id}`,
        method: "GET",
      }),
      providesTags:["SendedRequest"]
    }),
    getNotifications: builder.query({
      query: ({ user_id, page = 1 }) =>
        `notifications/all?user_id=${user_id}&page=${page}`,
    }),

    markRead: builder.mutation({
      query: ({ id, user_id }) => ({
        url: `notifications/read/${id}`,
        method: "POST",
        body: { user_id },
      }),
      invalidatesTags:["unreadChats"]
    }),
    getChatListApi: builder.query<any, any>({
      query: ({ id }) => ({
        url: `getChatListApi?user_id=${id}`,
        method: "GET",
      }),
    }),
    HidePost: builder.mutation<any, any>({
      query: (data) => ({
        url: "hide-post",
        method: "POST",
        body: data,
      }),
    }),
    saveNotificationToken: builder.mutation<any, any>({
      query: (data) => ({
        url: "saveNotificationToken",
        method: "POST",
        body: data,
      }),
    }),
    LogoutApi: builder.mutation<any, any>({
      query: (data) => ({
        url: "logoutUser",
        method: "POST",
        body: data,
      }),
    }),
    PaybyPaypal: builder.mutation<any, any>({
      query: (data) => ({
        url: "create-paypal-order",
        method: "POST",
        body: data,
      }),
    }),
    DeletReview: builder.mutation<any, any>({
      query: (data) => ({
        url: "deleteReview",
        method: "POST",
        body: data,
      }),
    }),
    ReviseReview: builder.mutation<any, any>({
      query: (data) => ({
        url: "askForReview",
        method: "POST",
        body: data,
      }),
      invalidatesTags:["GetReviews"]
    }),
    getUnreadNotificationsCount: builder.query({
      query: ({ user_id }) =>
        `getUnreadNotificationsCountApi?user_id=${user_id}`,
    }),

    CapturePayment: builder.mutation<any, any>({
      query: (data) => ({
        url: "capturePaypalOrder",
        method: "POST",
        body: data,
      }),
    }),
    getUserWallet: builder.query<any, any>({
      query: ({ id }) => ({
        url: `getUserWallet?user_id=${id}`,
        method: "GET",
      }),
    }),
    getMessagesApi: builder.query({
      query: ({ userId, chatUserId, page = 1,per_page = 20, receiver_post_id,
      type }) => ({
        url: `getMessages`,
        params: {
          user_id: userId,
          chat_user_id: chatUserId,
          page,
          receiver_post_id,
          type,
          per_page
        },
      }),
    }),
   getInquireyMessagesApi: builder.query({
      query: ({ user_id, chat_user_id, page = 1,per_page = 20,post_id }) => ({
        url: `getInquireyMessages`,
        params: {
          user_id: user_id,
          chat_user_id: chat_user_id,
          page,
          post_id:post_id,
          per_page:per_page,
        },
      }),
    }),
    sendMessageApi: builder.mutation({
      query: (data) => ({
        url: `sendMessageApi`,
        method: "POST",
        body: data,
      }),
    }),
     sendInquireyMessageApi: builder.mutation({
      query: (data) => ({
        url: `sendInquireyMessageApi`,
        method: "POST",
        body: data,
        
      }),
      
    }),
    markAsReadApi: builder.mutation({
      query: (data) => ({
        url: "markAsRead",
        method: "POST",
        body: data,
      }),
        invalidatesTags:["unreadChats"]
    }),
     InquirymarkAsRead: builder.mutation({
      query: (data) => ({
        url: "InquirymarkAsRead",
        method: "POST",
        body: data,
      }),
    }),
    writeReviewApi: builder.mutation({
      query: (data) => ({
        url: "writeReviewApi",
        method: "POST",
        body: data,
      }),
       invalidatesTags:["checkReview","myProfile","userRevies"]
    }),
    updateReviewApi: builder.mutation({
      query: ({ body }) => ({
        url: `updateReview`,
        method: "POST",
        body,
      }),
       invalidatesTags:["userRevies"]
    }),
    updateAccountApi: builder.mutation({
      query: (formatdata:FormData) => ({
        url: "/updateAccount",
        method: "POST",
       body: formatdata,
      }),
    }),
    markAllAsSeen: builder.mutation({
      query: ({ user_id }) => ({
        url: "notifications/mark-all-seen",
        method: "POST",
        body: { user_id },
      }),
    }),
    deletePost: builder.mutation({
      query: (data) => ({
        url: "deletePost",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["MypostCount"],
    }),
    deleteChats:builder.mutation({
      query: (data) => ({
        url: "deleteChats",
        method: "POST",
        body: data,
      }),
     invalidatesTags:["conversations"]
    }),
    deleteProfile: builder.mutation({
      query: (body) => ({
        url: "deleteProfile",
        method: "POST",
        body,
      }),
      invalidatesTags: ["CheckProfile"],
    }),
    savePastWork: builder.mutation<any, FormData>({
      query: (formatData) => ({
        url: `savePastWork`,
        method: "POST",
        body: formatData,
      }),
    }),
    getotherPastWork: builder.query<any, any>({
      query: ({ user_id, work_section }) => ({
        url: `getPastWork?user_id=${user_id}&work_section=${work_section}`,
        method: "GET",
      }),
      providesTags: ["otherPastData"],
    }),
    askvaluationapi:builder.mutation<any, FormData>({
      query: (formatData) => ({
        url: `askvaluationapi`,
        method: "POST",
        body: formatData,
      }),

    }),
   resetPassword: builder.mutation<any, any>({
  query: (body) => ({
    url: "resetPassword",
    method: "POST",
    body,
  }),
}),
deleteAccount: builder.mutation<any, any>({
  query: (body) => ({
    url: "deleteAccountapi",
    method: "POST",
    body,
  }),
}),
    deletePastWork: builder.mutation<any, FormData>({
      query: (formatData) => ({
        url: `deletePastWork`,
        method: "POST",
        body: formatData,
      }),
      invalidatesTags: ["otherPastData"],
    }),
    share_postApi: builder.mutation<any,FormData>({
      query: (formatData) => ({
        url: "share_postApi",
        method: "POST",
        body: formatData,
      }),
    }),
    upgradePostApi: builder.mutation({
      query: (data) => ({
        url: "upgradePost",
        method: "POST",
        body: data,
      }),
      invalidatesTags:["myPost"]
    }),
    shareDetailPostApi: builder.mutation<any,FormData>({
      query: (formatData) => ({
        url: "shareDetailPostApi",
        method: "POST",
        body: formatData,
      }),
      
    }),
    share_profileApi:builder.mutation<any,FormData>({
      query: (formatData) => ({
        url: "share_profileApi",
        method: "POST",
        body: formatData,
      }),
      
    }),
    reportPost: builder.mutation<any,FormData>({
      query: (formatData) => ({
        url: "reportPost",
        method: "POST",
        body: formatData,
      }),
      
    }),
    upgradeProfileApi: builder.mutation({
      query: (data) => ({
        url: "upgradeProfile",
        method: "POST",
        body: data,
      }),
      invalidatesTags:["myProfile"]
    }),
    PromoteProfile: builder.mutation({
      query: (data) => ({
        url: "PromoteProfile",
        method: "POST",
        body: data,
      }),
      invalidatesTags:["myProfile"]
    }),
    getPostById: builder.query<any, any>({
      query: ({ post_id,userid }) => ({
        url: `getPostById?post_id=${post_id}&userid=${userid}`,
        method: "GET",
      }),
      providesTags:["getPostById"]
    }),
    getConversationList:builder.query<any, any>({
      query: ({ userid }) => ({
        url: `getConversationList?user_id=${userid}`,
        method: "GET",
      }),
   providesTags:["conversations"]
    }),
    getPrice:builder.query<any,any>({
      query: ({price_type,profile_type}) => ({
        url: "getPrice",
        method: "GET",
        params: {price_type,profile_type},
      }),
    }),
     getAdvatizementPrice:builder.query<any,any>({
      query: ({type}) => ({
        url: "getAdvatizementPrice",
        method: "GET",
        params: {type},
      }),
      providesTags:["Advatizemets"]
    }),
    getRandomAd:builder.query<any,any>({
      query: ({on_page}) => ({
        url: "getRandomAd",
        method: "GET",
        params: {on_page},
      }),
    }),
    getUnreadConversationCount:builder.query<any,any>({
      query: ({user_id}) => ({
        url: "getUnreadConversationCount",
        method: "GET",
        params: {user_id},
      }),
      providesTags:["unreadChats"]
    }),

      getUserAdvertisements:builder.query<any,any>({
      query: ({user_id}) => ({
        url: "getUserAdvertisements",
        method: "GET",
        params: {user_id},
      }),
      providesTags: ["advertisementMedia"],
    }),
getSavedAdsApi:builder.query<any,any>({
  query: ({user_id,page,limit}) => ({
    url: "getSavedAdsApi",
    method: "GET",
    params: {user_id,page,limit},
  }),
providesTags:["savedAds"],
}),
getBlockedProfileMessage: builder.query({
    query: (body) => ({
        url: "/getBlockedProfileMessage",
        method: "POST",
        body,
    }),
}),
getUserStatus: builder.query({
  query: (body) => ({
    url: "/getUserStatus",
    method: "POST",
    body,
  }),
}),
sendBlockedProfileMessage: builder.mutation({
    query: (body) => ({
        url: "/sendBlockedProfileMessage",
        method: "POST",
        body,
    }),
}),
editCommentApi: builder.mutation({
  query: (body) => ({
    url: "/editCommentApi",
    method: "POST",
    body,
  }),
}),
calculateLoanApi: builder.mutation({
  query: (body) => ({
    url: "morgageCalculator", 
    method: "POST",
    body,
  }),
}),
   getProfileReviews: builder.query<any,
  {
    receiver_profile_id: string;
    receiver_profile_type: string;
  }>({
  query: (params) => ({
    url: "getProfileReviews",
    method: "GET",
    params,
  }),
   providesTags:["userRevies"]
}),
getLoanInterestRate: builder.query<any, void>({
  query: () => ({
    url: "loan-interest-rate",
    method: "GET",
  }),
}),
getBundlesPrice: builder.query({
  query: () => ({
    url: "bundles-price",
    method: "GET",
  }),
}),
  }),
});

export const {
  useCalculateLoanApiMutation,
   useGetBundlesPriceQuery,
  useGetLoanInterestRateQuery,
  useGetYourpostQuery,
  useGetContentpostQuery,
  useGetHomepostQuery,
  useCreateProfileMutation,
  useGetSinglePostQuery,
  usePostPropertyMutation,
  useGetProfilesQuery,
    useGetUserStatusQuery,
  usePostCommunityMutation,
  usePostGeneralPostMutation,
  useSetPropertyPrefrenceMutation,
  useSetCommunityPrefrenceMutation,
  useSetConectionPrefrenceMutation,
  useLazyGetInquieryAgentQuery,
  usePostAdvatizementMutation,
  useGetYorSalePostsQuery,
  useSendVisistRequestMutation,
  useGetPostCountQuery,
  useGetDataForEditQuery,
   useGetProfileReviewsQuery,
  useUpdatePropertyMutation,
  useUpdateCommunityMutation,
  useGetHomeFeedsQuery,
  useSaveAllertsMutation,
  useGetAlertPrefQuery,
  useGetConnectionPrefQuery,
  useGetCommunityPrefQuery,
  useGetPropertyPrefQuery,
  useGetPropertyListQuery,
  useGetCommunityListQuery,
  useGetProfileListingQuery,
  useGetSingleProfileQuery,
  useGetProfileNamesQuery,
 useEditCommentApiMutation,
  useGetDeveloperNamesQuery,
  useGetTrendingProfilesQuery,
  useInsertInquiryMutation,
  useGetsendedInquieryQuery,
  useDeletSendedInquiryMutation,
  useGetRecivedInquieryQuery,
  useDeleterecivedInquiriesMutation,
  useGetReviewsQuery,
  useSendRequestMutation,
  useGetProfilesForConectionQuery,
  useDeletePropertyPreferencesApiMutation,
  useDeleteConnectionPreferencesApiMutation,
  useDeleteCommunityPreferencesApiMutation,
  useGetPostCommentsApiQuery,
  useDeleteAccountMutation,
  usePostCommentApiMutation,
  useResetPasswordMutation,
  useUpgradeProfileApiMutation,
  useDeleteCommentApiMutation,
  usePostReplyApiMutation,
  useGetMyTrendingProfilesQuery,
  useSaveItemApiMutation,
  useUnsaveItemApiMutation,
  useLikePostMutation,
  useUnlikePostMutation,
  useGetConnectedUsersApiQuery,
  useGetReceivedRequestsApiQuery,
  useGetNotificationsQuery,
  useMarkReadMutation,
  useGetUnreadConversationCountQuery,
  useGetChatListApiQuery,
  useHidePostMutation,
  useSaveNotificationTokenMutation,
  usePaybyPaypalMutation,
  useDeletReviewMutation,
  useReviseReviewMutation,
  useGetUnreadNotificationsCountQuery,
  useCapturePaymentMutation,
  useGetUserWalletQuery,
  useSendMessageApiMutation,
  useGetMessagesApiQuery,
  useMarkAsReadApiMutation,
  useWriteReviewApiMutation,
  useUpdateReviewApiMutation,
  useUpdateAccountApiMutation,
  useMarkAllAsSeenMutation,
  useDeletePostMutation,
  useDeleteProfileMutation,
  useUpdateProfileMutation,
  useUserAgentPastPostsApiQuery,
  useSavePastWorkMutation,
  useGetotherPastWorkQuery,
  useDeletePastWorkMutation,
  useLazyGetotherPastWorkQuery,
  useGetSentRequestsApiQuery,
  useLazyUserAgentPastPostsApiQuery,
  useUpgradePostApiMutation,
  useSendInquireyMessageApiMutation,
  useLazyGetInquireyMessagesApiQuery,
  useInquirymarkAsReadMutation,
  useGetSingleGeneralPostQuery,
  useUnfollowApiMutation,
  useCancelRequestApiMutation,
  useAcceptRequestApiMutation,
  useUpdateConnectionApiMutation,
  useLogoutApiMutation,
  useDeleteGeneralPostMutation,
  useEditGeneralPostMutation,
  useShare_profileApiMutation,
  useAskvaluationapiMutation,
  useGetPostByIdQuery,
  useShare_postApiMutation,
  useShareDetailPostApiMutation,
  useReportPostMutation,
  useLazyGetPostCommentsApiQuery,
  useGetPriceQuery,
  useLazyGetPriceQuery,
  useGetAdvatizementPriceQuery,
  useLazyGetAdvatizementPriceQuery,
  usePromoteProfileMutation,
  useGetUserAdvertisementsQuery,
  useUpdateAdvertisementMediaMutation,
  useGetRandomAdQuery,
  useLazyGetRandomAdQuery,
  useGetSavedAdsApiQuery,
  useGetUserAlertsEditQuery,
  useDeleteAlertApiMutation,
  useAlertCountApiQuery,
  useCheckReviewApiQuery,
  useDeleteChatsMutation,
  useGetConversationListQuery,
  useGetBlockedProfileMessageQuery,
  useSendBlockedProfileMessageMutation,
} = MainApi;
