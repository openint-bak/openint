/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export interface paths {
  "/health": {
    get: operations["health"];
  };
  "/resources": {
    get: operations["listResources"];
    post: operations["createResource"];
  };
  "/pipelines": {
    get: operations["listPipelines"];
  };
  "/pipelines/{id}": {
    delete: operations["deletePipeline"];
  };
  "/integration_infos": {
    get: operations["listIntegrationInfos"];
  };
  "/resources/{id}": {
    get: operations["getResource"];
    delete: operations["deleteResource"];
    patch: operations["updateResource"];
  };
  "/connect-token": {
    post: operations["createConnectToken"];
  };
  "/magic-link": {
    post: operations["createMagicLink"];
  };
  "/integrations": {
    get: operations["adminListIntegrations"];
    post: operations["adminUpsertIntegration"];
  };
  "/integrations/{id}": {
    get: operations["adminGetIntegration"];
    delete: operations["adminDeleteIntegration"];
  };
  "/passthrough": {
    post: operations["passthrough"];
  };
  "/resources/{id}/source_sync": {
    post: operations["sourceSync"];
  };
  "/accounting/account": {
    get: operations["accounting_account_list"];
  };
  "/accounting/expense": {
    get: operations["accounting_expense_list"];
  };
  "/accounting/vendor": {
    get: operations["accounting_vendor_list"];
  };
  "/": {
    get: operations["getOpenapiDocument"];
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    /**
     * Error
     * @description The error information
     * @example {
     *   "code": "INTERNAL_SERVER_ERROR",
     *   "message": "Internal server error",
     *   "issues": []
     * }
     */
    "error.INTERNAL_SERVER_ERROR": {
      /**
       * @description The error message
       * @example Internal server error
       */
      message: string;
      /**
       * @description The error code
       * @example INTERNAL_SERVER_ERROR
       */
      code: string;
      /**
       * @description An array of issues that were responsible for the error
       * @example []
       */
      issues?: {
          message: string;
        }[];
    };
    /** @description Must start with 'int_' */
    "id.int": string;
    resource: {
      createdAt: string;
      updatedAt: string;
      id: components["schemas"]["id.reso"];
      /** @description Unique name of the connector */
      providerName: string;
      displayName?: string | null;
      endUserId?: string | null;
      integrationId: components["schemas"]["id.int"];
      institutionId?: components["schemas"]["id.ins"] | null;
      settings?: {
        [key: string]: unknown;
      } | null;
      standard?: ({
        displayName: string;
        /** @enum {string|null} */
        status?: "healthy" | "disconnected" | "error" | "manual" | null;
        statusMessage?: string | null;
        labels?: string[];
      }) | null;
      disabled?: boolean;
    };
    /** @description Must start with 'reso_' */
    "id.reso": string;
    /** @description Must start with 'ins_' */
    "id.ins": string;
    /**
     * Error
     * @description The error information
     * @example {
     *   "code": "BAD_REQUEST",
     *   "message": "Invalid input data",
     *   "issues": []
     * }
     */
    "error.BAD_REQUEST": {
      /**
       * @description The error message
       * @example Invalid input data
       */
      message: string;
      /**
       * @description The error code
       * @example BAD_REQUEST
       */
      code: string;
      /**
       * @description An array of issues that were responsible for the error
       * @example []
       */
      issues?: {
          message: string;
        }[];
    };
    /**
     * Error
     * @description The error information
     * @example {
     *   "code": "NOT_FOUND",
     *   "message": "Not found",
     *   "issues": []
     * }
     */
    "error.NOT_FOUND": {
      /**
       * @description The error message
       * @example Not found
       */
      message: string;
      /**
       * @description The error code
       * @example NOT_FOUND
       */
      code: string;
      /**
       * @description An array of issues that were responsible for the error
       * @example []
       */
      issues?: {
          message: string;
        }[];
    };
    pipeline: {
      createdAt: string;
      updatedAt: string;
      id: components["schemas"]["id.pipe"];
      sourceId?: components["schemas"]["id.reso"];
      sourceState?: {
        [key: string]: unknown;
      };
      destinationId?: components["schemas"]["id.reso"];
      destinationState?: {
        [key: string]: unknown;
      };
      linkOptions?: unknown[] | null;
      lastSyncStartedAt?: string | null;
      lastSyncCompletedAt?: string | null;
      disabled?: boolean;
    };
    /** @description Must start with 'pipe_' */
    "id.pipe": string;
    integration: {
      createdAt: string;
      updatedAt: string;
      id: components["schemas"]["id.int"];
      envName?: string | null;
      providerName: string;
      config?: {
        [key: string]: unknown;
      } | null;
      /** @description Allow end user to create resources using this integration's configuration */
      endUserAccess?: boolean | null;
      orgId: components["schemas"]["id.org"];
      displayName?: string | null;
      disabled?: boolean;
    };
    /** @description Must start with 'org_' */
    "id.org": string;
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export interface operations {

  health: {
    responses: {
      /** @description Successful response */
      200: {
        content: {
          "application/json": string;
        };
      };
      /** @description Internal server error */
      500: {
        content: {
          "application/json": components["schemas"]["error.INTERNAL_SERVER_ERROR"];
        };
      };
    };
  };
  listResources: {
    parameters: {
      query?: {
        limit?: number;
        offset?: number;
        endUserId?: string | null;
        integrationId?: components["schemas"]["id.int"] | null;
        providerName?: string | null;
      };
    };
    responses: {
      /** @description Successful response */
      200: {
        content: {
          "application/json": components["schemas"]["resource"][];
        };
      };
      /** @description Invalid input data */
      400: {
        content: {
          "application/json": components["schemas"]["error.BAD_REQUEST"];
        };
      };
      /** @description Not found */
      404: {
        content: {
          "application/json": components["schemas"]["error.NOT_FOUND"];
        };
      };
      /** @description Internal server error */
      500: {
        content: {
          "application/json": components["schemas"]["error.INTERNAL_SERVER_ERROR"];
        };
      };
    };
  };
  createResource: {
    requestBody: {
      content: {
        "application/json": {
          integrationId: components["schemas"]["id.int"];
          settings?: {
            [key: string]: unknown;
          } | null;
        };
      };
    };
    responses: {
      /** @description Successful response */
      200: {
        content: {
          "application/json": string;
        };
      };
      /** @description Invalid input data */
      400: {
        content: {
          "application/json": components["schemas"]["error.BAD_REQUEST"];
        };
      };
      /** @description Internal server error */
      500: {
        content: {
          "application/json": components["schemas"]["error.INTERNAL_SERVER_ERROR"];
        };
      };
    };
  };
  listPipelines: {
    parameters: {
      query?: {
        limit?: number;
        offset?: number;
        resourceIds?: components["schemas"]["id.reso"][];
      };
    };
    responses: {
      /** @description Successful response */
      200: {
        content: {
          "application/json": components["schemas"]["pipeline"][];
        };
      };
      /** @description Invalid input data */
      400: {
        content: {
          "application/json": components["schemas"]["error.BAD_REQUEST"];
        };
      };
      /** @description Not found */
      404: {
        content: {
          "application/json": components["schemas"]["error.NOT_FOUND"];
        };
      };
      /** @description Internal server error */
      500: {
        content: {
          "application/json": components["schemas"]["error.INTERNAL_SERVER_ERROR"];
        };
      };
    };
  };
  deletePipeline: {
    parameters: {
      path: {
        id: components["schemas"]["id.pipe"];
      };
    };
    responses: {
      /** @description Successful response */
      200: {
        content: {
          "application/json": true;
        };
      };
      /** @description Invalid input data */
      400: {
        content: {
          "application/json": components["schemas"]["error.BAD_REQUEST"];
        };
      };
      /** @description Not found */
      404: {
        content: {
          "application/json": components["schemas"]["error.NOT_FOUND"];
        };
      };
      /** @description Internal server error */
      500: {
        content: {
          "application/json": components["schemas"]["error.INTERNAL_SERVER_ERROR"];
        };
      };
    };
  };
  listIntegrationInfos: {
    parameters: {
      query?: {
        type?: "source" | "destination" | null;
        id?: components["schemas"]["id.int"] | null;
        providerName?: string | null;
      };
    };
    responses: {
      /** @description Successful response */
      200: {
        content: {
          "application/json": ({
              id: components["schemas"]["id.int"];
              envName?: string | null;
              displayName?: string | null;
              providerName: string;
              isSource: boolean;
              isDestination: boolean;
            })[];
        };
      };
      /** @description Invalid input data */
      400: {
        content: {
          "application/json": components["schemas"]["error.BAD_REQUEST"];
        };
      };
      /** @description Not found */
      404: {
        content: {
          "application/json": components["schemas"]["error.NOT_FOUND"];
        };
      };
      /** @description Internal server error */
      500: {
        content: {
          "application/json": components["schemas"]["error.INTERNAL_SERVER_ERROR"];
        };
      };
    };
  };
  getResource: {
    parameters: {
      path: {
        id: components["schemas"]["id.reso"];
      };
    };
    responses: {
      /** @description Successful response */
      200: {
        content: {
          "application/json": components["schemas"]["resource"];
        };
      };
      /** @description Invalid input data */
      400: {
        content: {
          "application/json": components["schemas"]["error.BAD_REQUEST"];
        };
      };
      /** @description Not found */
      404: {
        content: {
          "application/json": components["schemas"]["error.NOT_FOUND"];
        };
      };
      /** @description Internal server error */
      500: {
        content: {
          "application/json": components["schemas"]["error.INTERNAL_SERVER_ERROR"];
        };
      };
    };
  };
  deleteResource: {
    parameters: {
      query?: {
        skipRevoke?: boolean;
      };
      path: {
        id: components["schemas"]["id.reso"];
      };
    };
    responses: {
      /** @description Successful response */
      200: {
        content: {
          "application/json": unknown;
        };
      };
      /** @description Invalid input data */
      400: {
        content: {
          "application/json": components["schemas"]["error.BAD_REQUEST"];
        };
      };
      /** @description Not found */
      404: {
        content: {
          "application/json": components["schemas"]["error.NOT_FOUND"];
        };
      };
      /** @description Internal server error */
      500: {
        content: {
          "application/json": components["schemas"]["error.INTERNAL_SERVER_ERROR"];
        };
      };
    };
  };
  updateResource: {
    parameters: {
      path: {
        id: components["schemas"]["id.reso"];
      };
    };
    requestBody: {
      content: {
        "application/json": {
          settings?: {
            [key: string]: unknown;
          } | null;
          displayName?: string | null;
        };
      };
    };
    responses: {
      /** @description Successful response */
      200: {
        content: {
          "application/json": components["schemas"]["resource"];
        };
      };
      /** @description Invalid input data */
      400: {
        content: {
          "application/json": components["schemas"]["error.BAD_REQUEST"];
        };
      };
      /** @description Not found */
      404: {
        content: {
          "application/json": components["schemas"]["error.NOT_FOUND"];
        };
      };
      /** @description Internal server error */
      500: {
        content: {
          "application/json": components["schemas"]["error.INTERNAL_SERVER_ERROR"];
        };
      };
    };
  };
  createConnectToken: {
    requestBody: {
      content: {
        "application/json": {
          /** @description Anything that uniquely identifies the end user that you will be sending the magic link to */
          endUserId?: string;
          /**
           * @description How long the magic link will be valid for (in seconds) before it expires
           * @default 3600
           */
          validityInSeconds?: number;
        };
      };
    };
    responses: {
      /** @description Successful response */
      200: {
        content: {
          "application/json": {
            token: string;
          };
        };
      };
      /** @description Invalid input data */
      400: {
        content: {
          "application/json": components["schemas"]["error.BAD_REQUEST"];
        };
      };
      /** @description Internal server error */
      500: {
        content: {
          "application/json": components["schemas"]["error.INTERNAL_SERVER_ERROR"];
        };
      };
    };
  };
  createMagicLink: {
    requestBody: {
      content: {
        "application/json": {
          /** @description Anything that uniquely identifies the end user that you will be sending the magic link to */
          endUserId?: string;
          /**
           * @description How long the magic link will be valid for (in seconds) before it expires
           * @default 3600
           */
          validityInSeconds?: number;
          /** @description What to call user by */
          displayName?: string | null;
          /** @description Where to send user to after connect / if they press back button */
          redirectUrl?: string | null;
          /** @description Which provider to use */
          providerName?: string | null;
          integrationId?: components["schemas"]["id.int"];
          /** @default true */
          showExisting?: boolean;
        };
      };
    };
    responses: {
      /** @description Successful response */
      200: {
        content: {
          "application/json": {
            url: string;
          };
        };
      };
      /** @description Invalid input data */
      400: {
        content: {
          "application/json": components["schemas"]["error.BAD_REQUEST"];
        };
      };
      /** @description Internal server error */
      500: {
        content: {
          "application/json": components["schemas"]["error.INTERNAL_SERVER_ERROR"];
        };
      };
    };
  };
  adminListIntegrations: {
    responses: {
      /** @description Successful response */
      200: {
        content: {
          "application/json": components["schemas"]["integration"][];
        };
      };
      /** @description Internal server error */
      500: {
        content: {
          "application/json": components["schemas"]["error.INTERNAL_SERVER_ERROR"];
        };
      };
    };
  };
  adminUpsertIntegration: {
    requestBody: {
      content: {
        "application/json": {
          id?: components["schemas"]["id.int"];
          providerName?: string;
          orgId: components["schemas"]["id.org"];
          config?: {
            [key: string]: unknown;
          } | null;
          displayName?: string | null;
          /** @description Allow end user to create resources using this integration's configuration */
          endUserAccess?: boolean | null;
        };
      };
    };
    responses: {
      /** @description Successful response */
      200: {
        content: {
          "application/json": components["schemas"]["integration"];
        };
      };
      /** @description Invalid input data */
      400: {
        content: {
          "application/json": components["schemas"]["error.BAD_REQUEST"];
        };
      };
      /** @description Internal server error */
      500: {
        content: {
          "application/json": components["schemas"]["error.INTERNAL_SERVER_ERROR"];
        };
      };
    };
  };
  adminGetIntegration: {
    parameters: {
      path: {
        id: components["schemas"]["id.int"];
      };
    };
    responses: {
      /** @description Successful response */
      200: {
        content: {
          "application/json": components["schemas"]["integration"];
        };
      };
      /** @description Invalid input data */
      400: {
        content: {
          "application/json": components["schemas"]["error.BAD_REQUEST"];
        };
      };
      /** @description Not found */
      404: {
        content: {
          "application/json": components["schemas"]["error.NOT_FOUND"];
        };
      };
      /** @description Internal server error */
      500: {
        content: {
          "application/json": components["schemas"]["error.INTERNAL_SERVER_ERROR"];
        };
      };
    };
  };
  adminDeleteIntegration: {
    parameters: {
      path: {
        id: components["schemas"]["id.int"];
      };
    };
    responses: {
      /** @description Successful response */
      200: {
        content: {
          "application/json": unknown;
        };
      };
      /** @description Invalid input data */
      400: {
        content: {
          "application/json": components["schemas"]["error.BAD_REQUEST"];
        };
      };
      /** @description Not found */
      404: {
        content: {
          "application/json": components["schemas"]["error.NOT_FOUND"];
        };
      };
      /** @description Internal server error */
      500: {
        content: {
          "application/json": components["schemas"]["error.INTERNAL_SERVER_ERROR"];
        };
      };
    };
  };
  passthrough: {
    requestBody: {
      content: {
        "application/json": {
          /** @enum {string} */
          method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";
          path: string;
          query?: {
            [key: string]: unknown;
          };
          headers?: {
            [key: string]: unknown;
          };
          body?: {
            [key: string]: unknown;
          };
        };
      };
    };
    responses: {
      /** @description Successful response */
      200: {
        content: {
          "application/json": unknown;
        };
      };
      /** @description Invalid input data */
      400: {
        content: {
          "application/json": components["schemas"]["error.BAD_REQUEST"];
        };
      };
      /** @description Internal server error */
      500: {
        content: {
          "application/json": components["schemas"]["error.INTERNAL_SERVER_ERROR"];
        };
      };
    };
  };
  sourceSync: {
    parameters: {
      path: {
        id: components["schemas"]["id.reso"];
      };
    };
    requestBody: {
      content: {
        "application/json": {
          state?: {
            [key: string]: unknown;
          };
        };
      };
    };
    responses: {
      /** @description Successful response */
      200: {
        content: {
          "application/json": {
              [key: string]: unknown;
            }[];
        };
      };
      /** @description Invalid input data */
      400: {
        content: {
          "application/json": components["schemas"]["error.BAD_REQUEST"];
        };
      };
      /** @description Internal server error */
      500: {
        content: {
          "application/json": components["schemas"]["error.INTERNAL_SERVER_ERROR"];
        };
      };
    };
  };
  accounting_account_list: {
    parameters: {
      query?: {
        limit?: number;
        offset?: number;
      };
    };
    responses: {
      /** @description Successful response */
      200: {
        content: {
          "application/json": {
            hasNextPage: boolean;
            items: ({
                id: string;
                number?: string | null;
                name: string;
                type: string;
                _original?: unknown;
              })[];
          };
        };
      };
      /** @description Invalid input data */
      400: {
        content: {
          "application/json": components["schemas"]["error.BAD_REQUEST"];
        };
      };
      /** @description Not found */
      404: {
        content: {
          "application/json": components["schemas"]["error.NOT_FOUND"];
        };
      };
      /** @description Internal server error */
      500: {
        content: {
          "application/json": components["schemas"]["error.INTERNAL_SERVER_ERROR"];
        };
      };
    };
  };
  accounting_expense_list: {
    parameters: {
      query?: {
        limit?: number;
        offset?: number;
      };
    };
    responses: {
      /** @description Successful response */
      200: {
        content: {
          "application/json": {
            hasNextPage: boolean;
            items: {
                id: string;
                amount: number;
                currency: string;
                payment_account: string;
                _original?: unknown;
              }[];
          };
        };
      };
      /** @description Invalid input data */
      400: {
        content: {
          "application/json": components["schemas"]["error.BAD_REQUEST"];
        };
      };
      /** @description Not found */
      404: {
        content: {
          "application/json": components["schemas"]["error.NOT_FOUND"];
        };
      };
      /** @description Internal server error */
      500: {
        content: {
          "application/json": components["schemas"]["error.INTERNAL_SERVER_ERROR"];
        };
      };
    };
  };
  accounting_vendor_list: {
    parameters: {
      query?: {
        limit?: number;
        offset?: number;
      };
    };
    responses: {
      /** @description Successful response */
      200: {
        content: {
          "application/json": {
            hasNextPage: boolean;
            items: {
                id: string;
                name: string;
                url: string;
                _original?: unknown;
              }[];
          };
        };
      };
      /** @description Invalid input data */
      400: {
        content: {
          "application/json": components["schemas"]["error.BAD_REQUEST"];
        };
      };
      /** @description Not found */
      404: {
        content: {
          "application/json": components["schemas"]["error.NOT_FOUND"];
        };
      };
      /** @description Internal server error */
      500: {
        content: {
          "application/json": components["schemas"]["error.INTERNAL_SERVER_ERROR"];
        };
      };
    };
  };
  getOpenapiDocument: {
    responses: {
      /** @description Successful response */
      200: {
        content: {
          "application/json": unknown;
        };
      };
      /** @description Internal server error */
      500: {
        content: {
          "application/json": components["schemas"]["error.INTERNAL_SERVER_ERROR"];
        };
      };
    };
  };
}