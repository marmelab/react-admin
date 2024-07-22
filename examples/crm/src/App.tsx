import { CRM } from './root/CRM';
import {
    defaultCompanySectors,
    defaultContactGender,
    defaultDealCategories,
    defaultDealStages,
    defaultLogo,
    defaultNoteStatuses,
    defaultTaskTypes,
    defaultTitle,
} from './root/defaultConfiguration';

const App = () => (
    <CRM
        contactGender={defaultContactGender}
        companySectors={defaultCompanySectors}
        dealCategories={defaultDealCategories}
        dealStages={defaultDealStages}
        logo={defaultLogo}
        noteStatuses={defaultNoteStatuses}
        taskTypes={defaultTaskTypes}
        title={defaultTitle}
    />
);

export default App;
