import {
  CRUD_GET_LIST,
  CRUD_GET_ONE,
  FETCH_END,
  GET_LIST,
  GET_ONE
} from "ra-core";

export const getFetchType = (actionType) => {
  if (actionType === CRUD_GET_LIST) {
    return GET_LIST;
  } else if (actionType === CRUD_GET_ONE) {
    return GET_ONE;
  } else {
    console.error(
      `unexpected action type: ${actionType}, should be only ${CRUD_GET_LIST} or ${CRUD_GET_ONE}`
    );
    return undefined;
  }
};

export default (
  { type, payload: requestPayload, meta: { fetch: restType, ...meta } },
  payload
) => ({
  type: `${type}_SUCCESS`,
  payload,
  requestPayload,
  meta: { ...meta, fetchResponse: getFetchType(type), fetchStatus: FETCH_END }
});
