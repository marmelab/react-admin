const rowStyle = (record) => {
    if (record.status === 'accepted') return { backgroundColor: '#dfd' };
    if (record.status === 'pending') return { backgroundColor: '#ffd' };
    if (record.status === 'rejected') return { backgroundColor: '#fdd' };
    return {};
};

export default rowStyle;
