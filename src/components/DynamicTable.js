import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Configuration, OpenAIApi } from 'openai';
import React, { useState } from 'react';

const DynamicTable = ({ openaiEngine, apiKey, initData }) => {
    const [columns, setColumns] = useState(initData.columns || []);
    const [rows, setRows] = useState(initData.rows || []);
    const [open, setOpen] = useState(false);
    const [newColumnName, setNewColumnName] = useState('');
    const [loading, setLoading] = useState(false);

    const configuration = new Configuration({
        apiKey: apiKey,
    });
    const openai = new OpenAIApi(configuration);

    const addColumn = async () => {
        setLoading(true);
        setOpen(false);
        const newColumn = { field: newColumnName, headerName: newColumnName, width: 150 };
        setColumns([...columns, newColumn]);

        const updatedRows = await Promise.all(rows.map(async (row) => {
            const newRowData = await getGPT4Data(row, newColumnName);
            return { ...row, [newColumnName]: newRowData };
        }));

        setRows(updatedRows);
        setLoading(false);
    };

    const getGPT4Data = async (rowData, columnName) => {
        const prompt = `Given the following data: ${JSON.stringify(rowData)}, please provide a value (no extras, only values, no description) for the column "${columnName}":`;
        console.log(`before response`)
        const response = await openai.createCompletion({
            model: openaiEngine,
            prompt: prompt,
            max_tokens: 50,
            n: 1,
            stop: null,
            temperature: 0.5,
        }).catch(() => { });
        console.log(`response: ${JSON.stringify(response.data.choices[0].text?.trim().replace('\n', ''))}`)
        if (response.data.choices) {
            return response.data.choices[0]?.text?.trim().replace('\n', '');
        } else {
            return ''
        }
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div style={{ height: 400, width: '100%' }}>
            <Button variant="contained" color="primary" onClick={handleOpen}>
                Add Column
            </Button>
            <DataGrid
                columns={columns}
                rows={rows}
                pageSize={5}
                loading={loading}
            />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Column</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the name of the new column.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Column Name"
                        fullWidth
                        value={newColumnName}
                        onChange={(e) => setNewColumnName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={addColumn} color="primary">
                        Add Column
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default DynamicTable;