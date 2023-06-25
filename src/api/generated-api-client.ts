/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Role {
  /** @example 1 */
  id: number;
  /** @example "Admin" */
  name: string;
}

export interface Status {
  /** @example 1 */
  id: number;
  /** @example "Active" */
  name: string;
}

export interface CreateUserDto {
  /** @example "test1@example.com" */
  email: object;
  password: string;
  /** @example "John" */
  firstName: object;
  /** @example "Doe" */
  lastName: object;
  role: Role;
  status: Status;
}

export interface UpdateUserDto {
  /** @example "test1@example.com" */
  email?: object;
  password?: string;
  /** @example "John" */
  firstName?: object;
  /** @example "Doe" */
  lastName?: object;
  role?: Role;
  status?: Status;
}

export interface PropertyDto {
  /**
   * The id of the property
   * @example "1"
   */
  id: string;
  name: string | null;
  street: string | null;
  city: string | null;
  zipcode: string | null;
  country: string | null;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  /** @format date-time */
  deletedAt: string;
}

export interface AuthEmailLoginDto {
  /** @example "test1@example.com" */
  email: string;
  password: string;
}

export interface AuthRegisterLoginDto {
  /** @example "test1@example.com" */
  email: string;
  password: string;
  /** @example "John" */
  firstName: string;
  /** @example "Doe" */
  lastName: string;
}

export interface AuthConfirmEmailDto {
  hash: string;
}

export interface AuthForgotPasswordDto {
  email: string;
}

export interface AuthResetPasswordDto {
  password: string;
  hash: string;
}

export interface AuthUpdateDto {
  /** @example "John" */
  firstName: string;
  /** @example "Doe" */
  lastName: string;
  password: string;
  oldPassword: string;
}

export interface AuthFacebookLoginDto {
  /** @example "abc" */
  accessToken: string;
}

export interface AuthGoogleLoginDto {
  /** @example "abc" */
  idToken: string;
}

export interface AuthTwitterLoginDto {
  /** @example "abc" */
  accessTokenKey: string;
  /** @example "abc" */
  accessTokenSecret: string;
}

export interface AuthAppleLoginDto {
  /** @example "abc" */
  idToken: string;
  firstName?: string;
  lastName?: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title API
 * @version 1.0
 * @contact
 *
 * API docs
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Home
   * @name HomeControllerAppInfo
   * @request GET:/
   */
  homeControllerAppInfo = (params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/`,
      method: "GET",
      ...params,
    });

  api = {
    /**
     * No description
     *
     * @tags Users
     * @name UsersControllerCreate
     * @request POST:/api/v1/users
     * @secure
     */
    usersControllerCreate: (data: CreateUserDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/users`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersControllerFindAll
     * @request GET:/api/v1/users
     * @secure
     */
    usersControllerFindAll: (
      query: {
        page: number;
        limit: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/users`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersControllerFindOne
     * @request GET:/api/v1/users/{id}
     * @secure
     */
    usersControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/users/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersControllerUpdate
     * @request PATCH:/api/v1/users/{id}
     * @secure
     */
    usersControllerUpdate: (id: number, data: UpdateUserDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/users/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersControllerRemove
     * @request DELETE:/api/v1/users/{id}
     * @secure
     */
    usersControllerRemove: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/users/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Property
     * @name PropertiesControllerFindAll
     * @request GET:/api/v1/properties
     */
    propertiesControllerFindAll: (
      query: {
        page: number;
        limit: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<PropertyDto[], any>({
        path: `/api/v1/properties`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Property
     * @name PropertiesControllerFindOne
     * @request GET:/api/v1/properties/{id}
     */
    propertiesControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/properties/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerLogin
     * @request POST:/api/v1/auth/email/login
     */
    authControllerLogin: (data: AuthEmailLoginDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/auth/email/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerAdminLogin
     * @request POST:/api/v1/auth/admin/email/login
     */
    authControllerAdminLogin: (data: AuthEmailLoginDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/auth/admin/email/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerRegister
     * @request POST:/api/v1/auth/email/register
     */
    authControllerRegister: (data: AuthRegisterLoginDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/auth/email/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerConfirmEmail
     * @request POST:/api/v1/auth/email/confirm
     */
    authControllerConfirmEmail: (data: AuthConfirmEmailDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/auth/email/confirm`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerForgotPassword
     * @request POST:/api/v1/auth/forgot/password
     */
    authControllerForgotPassword: (data: AuthForgotPasswordDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/auth/forgot/password`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerResetPassword
     * @request POST:/api/v1/auth/reset/password
     */
    authControllerResetPassword: (data: AuthResetPasswordDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/auth/reset/password`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerMe
     * @request GET:/api/v1/auth/me
     * @secure
     */
    authControllerMe: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/auth/me`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerUpdate
     * @request PATCH:/api/v1/auth/me
     * @secure
     */
    authControllerUpdate: (data: AuthUpdateDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/auth/me`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerDelete
     * @request DELETE:/api/v1/auth/me
     * @secure
     */
    authControllerDelete: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/auth/me`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthFacebookControllerLogin
     * @request POST:/api/v1/auth/facebook/login
     */
    authFacebookControllerLogin: (data: AuthFacebookLoginDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/auth/facebook/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthGoogleControllerLogin
     * @request POST:/api/v1/auth/google/login
     */
    authGoogleControllerLogin: (data: AuthGoogleLoginDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/auth/google/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthTwitterControllerLogin
     * @request POST:/api/v1/auth/twitter/login
     */
    authTwitterControllerLogin: (data: AuthTwitterLoginDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/auth/twitter/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthAppleControllerLogin
     * @request POST:/api/v1/auth/apple/login
     */
    authAppleControllerLogin: (data: AuthAppleLoginDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/auth/apple/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
}
