import { ConfigurationContextValue } from '../root/ConfigurationContext';
import { Deal } from '../types';

export type DealsByStage = Record<Deal['stage'], Deal[]>;

export const getDealsByStage = (
    unorderedDeals: Deal[],
    dealStages: ConfigurationContextValue['dealStages']
) => {
    if (!dealStages) return {};
    const dealsByStage: Record<Deal['stage'], Deal[]> = unorderedDeals.reduce(
        (acc, deal) => {
            acc[deal.stage].push(deal);
            return acc;
        },
        dealStages.reduce(
            (obj, stage) => ({ ...obj, [stage.value]: [] }),
            {} as Record<Deal['stage'], Deal[]>
        )
    );
    // order each column by index
    dealStages.forEach(stage => {
        dealsByStage[stage.value] = dealsByStage[stage.value].sort(
            (recordA: Deal, recordB: Deal) => recordA.index - recordB.index
        );
    });
    return dealsByStage;
};
