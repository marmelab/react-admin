import { ImageList, ImageListItem, Stack } from '@mui/material';
import { AttachmentNote, ContactNote, DealNote } from '../types';
import { FileField } from 'react-admin';
import AttachFileIcon from '@mui/icons-material/AttachFile';

export const NoteAttachments = ({ note }: { note: ContactNote | DealNote }) => {
    if (!note.attachments || note.attachments.length === 0) {
        return null;
    }

    const imageAttachments = note.attachments.filter(
        (attachment: AttachmentNote) => isImage(attachment.src)
    );
    const otherAttachments = note.attachments.filter(
        (attachment: AttachmentNote) => !isImage(attachment.src)
    );

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

const isImage = (pathFile: string) => {
    const extension = pathFile.split('.').pop();
    if (!extension) {
        return false;
    }
    return ['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension);
};
