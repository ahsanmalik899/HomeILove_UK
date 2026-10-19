import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    changepassword,
    resetpass,
    siginpost,
    SignInResponse,
    verifyuser
} from '@store/type/user/index';

export const Authapi = createApi({
  reducerPath: 'Authapi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://www.homeilove.co.uk/api/' }),
  endpoints: builder => ({
    Signup: builder.mutation<unknown, FormData>({
      query: formData => ({
        url: 'signup',
        method: 'POST',
           headers: {
        Accept: 'application/json',
      },
        body: formData,
      }),
    }),
    Resetpass: builder.mutation<unknown, resetpass>({
      query: email => ({
        url: 'sendForgotMail',
        method: 'Post',
                headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
        body: email,
      }),
    }),
    Signin: builder.mutation<SignInResponse, siginpost>({
      query: userdata => ({
        url: 'signin',
        method: 'POST',
          headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
        body: userdata,
      }),
    }),
    ResendVaerification: builder.mutation<undefined, resetpass>({
      query: email => ({
        url: 'reSendVerifyAccount',
        method: 'POST',
                headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
        body: email,
      }),
    }),
    ResendResetpaaword: builder.mutation<undefined, resetpass>({
      query: email => ({
        url: 'sendForgotMail',
        method: 'POST',
                headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
        body: email,
      }),
    }),
    Verifyaccount: builder.mutation<undefined, verifyuser>({
      query: token => ({
        url: `verifyAccount?token=${token}`,
        method: 'POST',
                headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
       
      }),
    }),
    Setpassword: builder.mutation<undefined, changepassword>({
      query: data => ({
        url: 'resetPassByLink',
        method: 'POST',
                headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
        body: data,
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useSigninMutation,
  useResetpassMutation,
  useResendVaerificationMutation,
  useResendResetpaawordMutation,
  useVerifyaccountMutation,
  useSetpasswordMutation,
} = Authapi;
