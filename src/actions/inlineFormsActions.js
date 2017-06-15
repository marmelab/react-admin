export const INCREMENT_OPENED_FORMS = 'INCREMENT_OPENED_FORMS';
export const DECREMENT_OPENED_FORMS = 'DECREMENT_OPENED_FORMS';

export const incrementOpenedForms = () => ({
  type: INCREMENT_OPENED_FORMS,
});

export const decrementOpenedForms = () => ({
  type: DECREMENT_OPENED_FORMS,
});
