import { Box, Button, FormControl, Input, InputLabel, MenuItem, Modal, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Grid2 as Grid }  from "@mui/material";
import { DatePicker, LoadingButton } from "@mui/lab";

const keywords = [
    "Java Spring",
    "Python Django",
    "Python Flask",
    "NodeJs Express",
    "NodeJs Nest",
    ".Net Core", 
    "Angular",
    "Reactjs",
    "React Native",
    "Flutter"
]

const url = 'http://localhost:8081/jobs/'

interface Job {
    id: number,
    title: string,
    teaser: string,
    companyName: string,
    location: string,
    workType: string,
    role: string,
    salary: string,
    keyword: string,
    listingDate: string,
    bulletPoints: string[]
}

interface ModalProps {
    show: boolean
    mode: 'view' | 'edit' | 'create'
    job: Job | undefined
}

interface ComponentProps {
    modal: ModalProps
    setModal : (modal : ModalProps) => void
    useAlert: (status: 'error' | 'info' | 'success' | 'warning', message: string) => void
}

export default function JobModal ({ modal, setModal, useAlert} : ComponentProps) {
    const [form, setForm] = useState<Job>({
        id: 0,
        title: "",
        teaser: "",
        companyName: "",
        location: "",
        workType: "",
        role: "",
        salary: "",
        keyword: keywords[0],
        listingDate: "",
        bulletPoints: []
    })
    const list = keywords.map(k => <MenuItem key={k} value={k}>{(k == "") ? "No Keyword" : k}</MenuItem>)
    
    useEffect(() => {
        setForm(modal.job ? modal.job : {
            id: 0,
            title: "",
            teaser: "",
            companyName: "",
            location: "",
            workType: "",
            role: "",
            salary: "",
            keyword: keywords[0],
            listingDate: "",
            bulletPoints: []
        })
    }, [modal])

    const closeModal = () => {
        setModal({
            show: false,
            mode: 'edit',
            job: undefined
        })
    }

    const selectKeyword = (event: SelectChangeEvent) => {
        setForm({
            ...form,
            keyword: event.target.value
        })
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setForm({
          ...form,
          [name]: value,
        });
    };

    const handleBulletPointChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const bulletPoints = event.target.value.split('\n');
        setForm(prevForm => ({
          ...prevForm,
          bulletPoints
        }));
    };

    const validateForm = () => {
        for(const [key, value] of Object.entries(form)){
            if (key != 'bulletPoints' && key != 'listingDate' && key != 'id'){
                if (!value)
                    return false
            }
        }
        return true
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (validateForm()) {
            if (modal.mode == 'create') {
                fetch(url, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(form)
                })
                .then(async response => {
                    useAlert("success", await response.text())
                })
                .catch(error => {
                    useAlert("error", error.message)
                })
                .finally(() => {
                    closeModal()
                })
            }
            else {
                fetch(`${url}${form.id}/`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        ...form,
                        listingDate: new Date(form.listingDate)
                    })
                })
                .then(async response => {
                    useAlert("success", await response.text())
                })
                .catch(error => {
                    useAlert("error", error.message)
                })
                .finally(() => {
                    closeModal()
                })
            }
        }
    }

    return (
        <Modal
            open={modal.show}
            onClose={closeModal}
            sx={{
                display: "flex",
                justifyContent: "center"
            }}
        >
            <Box sx={{
                scrollbarWidth: "none",
                overflowY: "scroll",
                maxWidth: "50%",
                backgroundColor: `black`,
                border: '2px solid #000',
                boxShadow: 24,
                padding: 4
            }}>
                <form onSubmit={handleSubmit}>
                    <Typography variant="h5" marginBottom={2}>
                        { modal.mode == 'create' ? "Create Job" : modal.mode == "edit" ? "Edit Job" : "View Job" }
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <TextField
                                required
                                disabled={modal.mode == 'view'}
                                name="title"
                                value={form.title}
                                label="Title"
                                onChange={handleChange}
                                error={!form.title}
                                helperText={form.title ? "" : "Title is required"}
                                fullWidth
                            ></TextField>
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                required
                                disabled={modal.mode == 'view'}
                                name="teaser"
                                value={form.teaser}
                                label="Teaser"
                                onChange={handleChange}
                                error={!form.teaser}
                                helperText={form.teaser ? "" : "Teaser is required"}
                                fullWidth
                                multiline
                            ></TextField>
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                required
                                disabled={modal.mode == 'view'}
                                name="companyName"
                                value={form.companyName}
                                label="Company Name"
                                onChange={handleChange}
                                error={!form.companyName}
                                helperText={form.companyName ? "" : "Company Name is required"}
                                fullWidth
                            ></TextField>
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                required
                                disabled={modal.mode == 'view'}
                                name="location"
                                value={form.location}
                                label="Location"
                                onChange={handleChange}
                                error={!form.location}
                                helperText={form.location ? "" : "Location is required"}
                                fullWidth
                            ></TextField>
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                required
                                disabled={modal.mode == 'view'}
                                name="workType"
                                value={form.workType}
                                label="Work Type"
                                onChange={handleChange}
                                error={!form.workType}
                                helperText={form.workType ? "" : "Work Type is required"}
                                fullWidth
                            ></TextField>
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                required
                                disabled={modal.mode == 'view'}
                                name="role"
                                value={form.role}
                                label="Role"
                                onChange={handleChange}
                                error={!form.role}
                                helperText={form.role ? "" : "Role is required"}
                                fullWidth
                            ></TextField>
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                required
                                disabled={modal.mode == 'view'}
                                name="salary"
                                value={form.salary}
                                label="Salary"
                                onChange={handleChange}
                                error={!form.salary}
                                helperText={form.salary ? "" : "Salary is required"}
                                fullWidth
                            ></TextField>
                        </Grid>
                        <Grid size={12}>
                            <FormControl>
                                <InputLabel id="keyword" error={!form.keyword}>Keyword</InputLabel>
                                <Select
                                    required
                                    disabled={modal.mode == 'view'}
                                    labelId="keyword"
                                    label="Keyword"
                                    value={form.keyword} onChange={selectKeyword}
                                    error={!form.keyword}
                                    fullWidth
                                >
                                    {list}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                disabled={modal.mode == 'view'}
                                fullWidth
                                multiline
                                rows={4}
                                name="bulletPoints"
                                label="Bullet Points (one per line)"
                                value={form.bulletPoints.join('\n')}
                                onChange={handleBulletPointChange}
                            />
                        </Grid>
                        { modal.mode == 'view' && <Grid size={12}>
                            <TextField
                                disabled
                                label="Listing Date"
                                value={form.listingDate}
                            ></TextField>
                        </Grid>}
                        <Grid 
                            size={12} 
                            sx={{
                                display: "flex", 
                                justifyContent: "flex-end"
                            }}
                        >
                            <Button onClick={closeModal} color="error">{ modal.mode == 'view' ? "Close" : "Cancel" }</Button>
                            { modal.mode != 'view' && <LoadingButton type="submit"> Save </LoadingButton>}
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Modal>
    )
}