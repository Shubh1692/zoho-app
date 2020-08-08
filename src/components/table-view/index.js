import React, { useState, Fragment, useEffect } from 'react';
// Import material ui component and icons
import {
    Checkbox, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Toolbar, AppBar, Button,
    Select, FormControl, TextField, MenuItem, Box
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
// Import lodash for debounce component for search
import { debounce } from 'lodash';
// Import custom style css
import useStyles from './style';
// Import app configuration
import {
    TABLE_COLUMN, API_CONFIG, FILTER_OPTIONS
} from './constant';
const { BASE_URL, ENDPOINTS: {
    CONTACTS
} } = API_CONFIG || {};
/**
 * This is a state less component to view data in table view
 */
const TableView = () => {
    // Get state of component
    const classes = useStyles();
    const [contacts, setContacts] = useState([]);
    const [selectedDropdown, setSelectedDropdown] = useState(FILTER_OPTIONS[0].value);
    const [selectedContact, setSelectContacts] = useState({});
    const [isFetching, setFetchingFlag] = useState(true);
    const [search, setSearch] = useState('');
    // This is used as componentDidMount event for fetch contact from backend
    useEffect(() => {
        fetchContacts({
            filter_by: FILTER_OPTIONS[0].value,
            search_text: search
        });
    }, []);

    /**
     * This method used for fetch contacts from backend and set into component state
     */
    const fetchContacts = async (params) => {
        try {
            const queryString = Object.keys(params)
                .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                .join('&');
            const contactReq = await fetch(`${BASE_URL}${CONTACTS}?${queryString}`, {
                method: 'GET'
            });
            const contactRes = await contactReq.json();
            setContacts(contactRes.contacts);
            setFetchingFlag(false)
        } catch (error) {
            setContacts([]);
            setFetchingFlag(false)
        }
    }

    /**
     * This method used for select individual contact
     * @param index selected contact index position in contact array 
     */
    const onSelectContact = (index) => {
        let selectedContacts = { ...selectedContact };
        selectedContacts[index] = !selectedContacts[index];
        setSelectContacts(selectedContacts);
    }

    /**
     * This method used for select all contacts
     * @param allSelected all contact selected flag
     */
    const onSelectAllClick = (allSelected) => {
        let selectedContacts = { ...selectedContact };
        if (allSelected) {
            selectedContacts = {};
        } else {
            contacts.forEach((_value, index) => {
                selectedContacts[index] = true
            });
        }
        setSelectContacts(selectedContacts);
    }

    /**
     * This method used for select contact filter from header
     * @param event event object
     */
    const onSelectChange = async (event) => {
        setFetchingFlag(true);
        await fetchContacts({
            filter_by: event.target.value,
            search_text: search
        });
        setSelectedDropdown(event.target.value);
    }

    /**
     * This method used to search contact from backend
     */
    const onSearch = async (searchText) => {
        setSearch(searchText);
        setFetchingFlag(true);
        await fetchContacts({
            filter_by: selectedDropdown,
            search_text: searchText
        });
    }
    // Create a method for debounce
    const onSearchDelayed = debounce(onSearch, 1000);
    // This is used to check all contacts are selected or not
    const allSelected = contacts.length && contacts.length === Object.keys(selectedContact).length;
    return (
        <Fragment>
            <AppBar position="static" className={classes.appBar}>
                <Toolbar color="light">
                    
                    <Box width={1} display="flex" alignItems="center" justifyContent="flex-start">
                        <FormControl>
                            <Select
                                disabled={isFetching}
                                disableUnderline
                                value={selectedDropdown}
                                onChange={onSelectChange}
                            >
                                {FILTER_OPTIONS.map(({
                                    value, label
                                }) => (<MenuItem key={value} value={value}>{label}</MenuItem>))}
                            </Select>
                        </FormControl>
                        <FormControl className={classes.searchBox}>
                            <TextField id="standard-basic" placeholder="Search" onChange={(event) => onSearchDelayed(event.target.value)} />
                        </FormControl>
                    </Box>
                    <Box width={1} display="flex" alignItems="center" justifyContent="flex-end">
                        <Button disabled={isFetching} size="small" variant="contained" color="secondary" startIcon={<Add />}>
                            New
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box margin={1}>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow className={classes.header}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={allSelected}
                                        onChange={() => onSelectAllClick(allSelected)}
                                        inputProps={{ 'aria-label': 'select all desserts' }}
                                        disabled={!contacts.length || isFetching}
                                    />
                                </TableCell>
                                {TABLE_COLUMN.map(({
                                    id, numeric, disablePadding, label
                                }) => (
                                        <TableCell
                                            key={id}
                                            align={numeric ? 'right' : 'left'}
                                            padding={disablePadding ? 'none' : 'default'}
                                        >
                                            {label}
                                        </TableCell>
                                    ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!isFetching && contacts.map(({
                                contact_id, ...row
                            }, index) => (
                                    <TableRow key={contact_id}>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={!!selectedContact[index]}
                                                onChange={() => onSelectContact(index)}
                                                inputProps={{ 'aria-label': 'select all desserts' }}
                                            />
                                        </TableCell>
                                        {TABLE_COLUMN.map(({
                                            id, numeric, disablePadding, symbol, float
                                        }) => (
                                                <TableCell
                                                    key={id}
                                                    align={numeric ? 'right' : 'left'}
                                                    padding={disablePadding ? 'none' : 'default'}
                                                >
                                                    {float && symbol ? `${symbol}${parseFloat(row[id] || 0).toFixed()}` : row[id] || ''}
                                                </TableCell>
                                            ))}
                                    </TableRow>
                                ))}
                            {!isFetching && contacts.length === 0 &&
                                <TableRow >
                                    <TableCell colSpan={TABLE_COLUMN.length + 1} className={classes.noData}>
                                        No Data found
                                     </TableCell>
                                </TableRow>}
                            {isFetching && <Fragment>{[1, 2, 3, 4, 5].map((_value, index) => (
                                <TableRow key={index}>
                                    <TableCell padding="checkbox">
                                        <Skeleton />
                                    </TableCell>
                                    {TABLE_COLUMN.map(({
                                        id, numeric, disablePadding
                                    }) => (
                                            <TableCell
                                                key={id}
                                                align={numeric ? 'right' : 'left'}
                                                padding={disablePadding ? 'none' : 'default'}
                                            >
                                                <Skeleton />
                                            </TableCell>
                                        ))}
                                </TableRow>

                            ))}
                            </Fragment>}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Fragment>
    )
};

export default TableView;