import React from 'react';
import { write, utils } from 'xlsx';

export const ConvertToXLSX = ({ data, filename }) => {
    // Convert the data to a worksheet
    const worksheet = utils.json_to_sheet(data);

    // Create a workbook and add the worksheet
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Generate a file and download it
    const wbout = write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
};

