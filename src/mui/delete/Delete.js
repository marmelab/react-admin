import { crudDelete as crudDeleteAction } from '../../actions/dataActions';
import translate from '../../i18n/translate';
import createConfirmationComponent from '../confirm/Confirm';

export default createConfirmationComponent(crudDeleteAction, {
  'submitLabel': 'aor.action.delete',
  'defaultTitle': 'aor.page.delete',
});
