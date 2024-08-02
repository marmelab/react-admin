import { DealStage } from '../types';

export const findDealLabel = (dealStages: DealStage[], dealValue: string) => {
    return dealStages.find(dealStage => dealStage.value === dealValue)?.label;
};
