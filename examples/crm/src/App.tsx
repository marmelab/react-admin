import { CRM } from './CRM/CRM';
import { crmConfig } from './CRM/crm.config';

const App = () => (
    <CRM
        title={crmConfig.title}
        logo={crmConfig.logo}
        companySectors={crmConfig.companySectors}
        dealStages={crmConfig.dealStages}
        dealCategories={crmConfig.dealCategories}
    />
);

export default App;
