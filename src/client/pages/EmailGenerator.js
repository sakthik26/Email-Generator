import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useEffect, useState } from "react";
import axios from 'axios';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Collapse from '@material-ui/core/Collapse';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 380,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    spacing: {
        marginTop: 20,
    },
    cusor: {
        cursor: 'pointer'
    }
}));

export default function EmailGenerator() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [openErrorAlert, setOpenErrorAlert] = React.useState(true);
    const [companyDomainOptions, setCompanyDomainOptions] = React.useState([

    ])
    const [showGenerate, setShowGenerate] = React.useState(false);
    const [generatedEmail, setGeneratedEmail] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [success, setSuccess] = React.useState(false)
    const [failed, setFailed] = React.useState(false)
    const [lastName, setLastName] = React.useState('');
    const [createFirstName, setCreateFirstName] = React.useState('');
    const [createLastName, setCreateLastName] = React.useState('');
    const [createEmailAddress, setCreateEmailAddress] = React.useState('');
    const [domainSelected, setDomainSelected] = React.useState('')
    const handleChange = (event) => {
        console.log(event.target)
        setDomainSelected(event.target.value);
    };
    const changeFirstName = (e) => {
        setFirstName(e.target.value)
    }

    const changeLastName = (e) => {
        setLastName(e.target.value)
    }
    const changeCreateFirstName = (e) => {
        setCreateFirstName(e.target.value)
    }
    const changeCreateLastName = (e) => {
        setCreateLastName(e.target.value)
    }
    const changeEmail = (e) => {
        setCreateEmailAddress(e.target.value)
    }
    useEffect(() => {
        //Fetches all the domains of the company from the database
        axios
            .get("/api/getdomains", {
            })
            .then((response) => {

                setCompanyDomainOptions(response.data);
                setDomainSelected(response.data[0].domain)

            })
            .catch(function (e) {
                console.log(e);
            });

    }, []);

    // Generates the email address based on previous address of the domain
    const generateEmailAddress = (event) => {

        const payload = {
            firstname: firstName,
            lastname: lastName,
            domain: domainSelected
        }

        axios.post("/api/generatemail", payload, {
            headers: {
                "Content-type": "application/json"
            }
        })
            .then((response) => {
                setGeneratedEmail(response.data.data)
            })
            .catch(function (e) {
                console.log(e);
            });
    }

    //Creates new domain if the domain doesn't exist and reports if the domain already exists
    const createDomain = (event) => {

        const payload = {
            firstname: createFirstName,
            lastname: createLastName,
            email: createEmailAddress
        }
        axios.post("/api/createdomain", payload, {
            headers: {
                "Content-type": "application/json"
            }
        })
            .then((response) => {
                if (response.data.data === "Domain already exists") {
                    setFailed(true)
                    setSuccess(false)
                }
                else {
                    setCompanyDomainOptions([...companyDomainOptions, response.data.data])
                    setSuccess(true)
                    setFailed(false)
                }
            })
            .catch(function (e) {
                console.log(e);
            });
    }
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>

                </Avatar>
                <Typography component="h1" variant="h5">
                    Email Generator
                </Typography>
                <form className={classes.form} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="fname"
                                name="firstName"
                                variant="outlined"
                                required
                                onChange={changeFirstName}
                                value={firstName}
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                value={lastName}
                                fullWidth
                                id="lastName"
                                onChange={changeLastName}
                                label="Last Name"
                                name="lastName"
                                autoComplete="lname"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="demo-simple-select-label">Domain name</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={domainSelected}
                                    onChange={handleChange}
                                >
                                    {companyDomainOptions.map(item => (
                                        <MenuItem
                                            value={item.domain}
                                        >
                                            {item.domain}
                                        </MenuItem>
                                    ))}

                                </Select>
                            </FormControl>
                        </Grid>


                    </Grid>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={generateEmailAddress}
                    >
                        Generate Email address
                    </Button>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                id="outlined-read-only-input"
                                InputProps={{
                                    readOnly: true,
                                }}
                                fullWidth
                                label="Email address"
                                value={generatedEmail}
                                defaultValue="Email appears here"
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item className={classes.spacing}>
                            <Link onClick={() => setShowGenerate(true)} variant="body2" className={classes.cusor} >
                                Can't find the company domain?
                            </Link>
                        </Grid>
                        {showGenerate ?
                            <div>
                                <Grid item xs={12} className={classes.spacing}>
                                    <TextField
                                        autoComplete="fname"
                                        name="firstName"
                                        variant="outlined"
                                        required
                                        onChange={changeCreateFirstName}
                                        value={createFirstName}
                                        fullWidth
                                        id="firstName"
                                        label="First Name"
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item xs={12} className={classes.spacing}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        value={createLastName}
                                        fullWidth
                                        id="lastName"
                                        onChange={changeCreateLastName}
                                        label="Last Name"
                                        name="lastName"
                                        autoComplete="lname"
                                    />
                                </Grid>

                                <Grid item xs={12} className={classes.spacing}>
                                    <TextField
                                        autoComplete="email"
                                        name="email"
                                        variant="outlined"
                                        required
                                        onChange={changeEmail}
                                        value={createEmailAddress}
                                        fullWidth
                                        id="firstName"
                                        label="Enter Email"
                                        autoFocus
                                    />
                                </Grid>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    onClick={createDomain}
                                >
                                    Create Company Domain Name
                                </Button>
                            </div> : null}
                    </Grid>
                </form>
            </div >
            {success ?
                <div className={classes.root}>
                    <Collapse in={open}>
                        <Alert
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                        setOpen(false);
                                    }}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                        >
                            Domain Created Successfully
                        </Alert>
                    </Collapse>
                </div> : null}

            {failed ?
                <div className={classes.root}>
                    <Collapse in={openErrorAlert}>
                        <Alert severity="error"
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                        setOpenErrorAlert(false);
                                    }}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                        >
                            Domain already exists. Please choose another domain.
                        </Alert>
                    </Collapse>
                </div> : null}

        </Container >
    );
}