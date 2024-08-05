import { ImageList, ImageListItem, Stack } from '@mui/material';
import { AttachmentNote, ContactNote, DealNote, RAFile } from '../types';
import { FileField, useDataProvider } from 'react-admin';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useEffect, useState } from 'react';
export const NoteAttachments = ({ note }: { note: ContactNote | DealNote }) => {
    const dataProvider = useDataProvider();

    const [imageAttachments, setImageAttachments] = useState<RAFile[]>([]);
    const [otherAttachments, setOtherAttachments] = useState<RAFile[]>([]);

    useEffect(() => {
        const filterAttachments = async () => {
            if (!note.attachments) {
                return null;
            }
            const isImagePromises = note.attachments.map(
                async (attachment: AttachmentNote) => {
                    const isImage = await dataProvider.isImage(attachment);
                    return { attachment, isImage };
                }
            );

            const resolvedAttachments = await Promise.all(isImagePromises);

            const imageAttachments = resolvedAttachments
                .filter(({ isImage }) => isImage)
                .map(({ attachment }) => attachment);

            const otherAttachments = resolvedAttachments
                .filter(({ isImage }) => !isImage)
                .map(({ attachment }) => attachment);

            setImageAttachments(imageAttachments);
            setOtherAttachments(otherAttachments);
        };

        filterAttachments();
    }, [note.attachments, dataProvider]);

    if (!note.attachments || note.attachments.length === 0) {
        return null;
    }

    return (
        <Stack direction="column">
            {imageAttachments.length > 0 && (
                <ImageList cols={4} gap={8}>
                    {imageAttachments.map(
                        (attachment: AttachmentNote, index: number) => (
                            <ImageListItem key={index}>
                                <img
                                    src={attachment.src}
                                    alt={attachment.title}
                                    style={{
                                        width: '200px',
                                        height: '100px',
                                        objectFit: 'cover',
                                        cursor: 'pointer',
                                        objectPosition: 'left',
                                        border: '1px solid #e0e0e0',
                                    }}
                                    onClick={() =>
                                        window.open(attachment.src, '_blank')
                                    }
                                />
                            </ImageListItem>
                        )
                    )}
                </ImageList>
            )}
            {otherAttachments.length > 0 &&
                otherAttachments.map(
                    (attachment: AttachmentNote, index: number) => (
                        <Stack key={index} direction="row" alignItems="center">
                            <AttachFileIcon fontSize="small" />
                            <FileField
                                record={{ attachment }}
                                source="attachment.src"
                                title="attachment.title"
                                target="_blank"
                            />
                        </Stack>
                    )
                )}
        </Stack>
    );
};
