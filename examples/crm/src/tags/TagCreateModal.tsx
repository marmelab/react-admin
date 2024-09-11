import { useCreate } from 'react-admin';
import { Tag } from '../types';
import { TagDialog } from './TagDialog';

type TagCreateModalProps = {
    open: boolean;
    onClose(): void;
    onSuccess?(tag: Tag): Promise<void>;
};

export function TagCreateModal({
    open,
    onClose,
    onSuccess,
}: TagCreateModalProps) {
    const [create] = useCreate<Tag>();

    const handleCreateTag = async (data: Pick<Tag, 'name' | 'color'>) => {
        await create(
            'tags',
            { data },
            {
                onSuccess: async tag => {
                    await onSuccess?.(tag);
                },
            }
        );
    };

    return (
        <TagDialog
            open={open}
            title="Create a new tag"
            onClose={onClose}
            onSubmit={handleCreateTag}
        />
    );
}
