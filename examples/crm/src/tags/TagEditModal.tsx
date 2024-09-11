import { useUpdate } from 'react-admin';
import { Tag } from '../types';
import { TagDialog } from './TagDialog';

type TagEditModalProps = {
    tag: Tag;
    open: boolean;
    onClose(): void;
    onSuccess?(tag: Tag): Promise<void>;
};

export function TagEditModal({
    tag,
    open,
    onClose,
    onSuccess,
}: TagEditModalProps) {
    const [update] = useUpdate<Tag>();

    const handleEditTag = async (data: Pick<Tag, 'name' | 'color'>) => {
        await update(
            'tags',
            { id: tag.id, data, previousData: tag },
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
            title="Edit tag"
            onClose={onClose}
            onSubmit={handleEditTag}
            tag={tag}
        />
    );
}
