import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
import { Box, Button, Container, InputLabel, Select, SelectChangeEvent } from "@mui/material";
import { useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';


const keywords = [
    "",
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

const url = 'http://localhost:8081/jobs'

interface NavbarProps {
    setKeyword: (keyword: string) => void
    keyword: string
    openModal: (mode: 'view' | 'edit' | 'create', job : Job | undefined) => void
    useAlert: (status: 'error' | 'info' | 'success' | 'warning', message: string) => void
}


export default function Navbar ({ setKeyword, keyword, openModal, useAlert } : NavbarProps) {
    const [generateLoading, setGenerateLoading] = useState(false)
    const [scrapeLoading, setScrapeLoading] = useState(false)
    const list = keywords.map(k => <MenuItem key={k} value={k}>{(k == "") ? "No Keyword" : k}</MenuItem>)
    const selectKeyword = (event: SelectChangeEvent) => {
        setKeyword(event.target.value)
    }
    const scrapeJobs = () => {
        setScrapeLoading(true)
        fetch(`${url}/scrape/${keyword}`)
        .then(async (response) => {
            setScrapeLoading(false)
            useAlert("success", await response.text())
            setKeyword("")
        })
        .catch((error) => {
            setScrapeLoading(false)
            useAlert('error', error.message)
        })
    }

    const generateReport = () => {
        let filename = ''
        setGenerateLoading(true)
        fetch(`${url}/excel`, {
            method: 'GET'
            })
            .then((response) => {
                const header = response.headers.get('Content-Disposition');
                const parts = header!.split(';');
                filename = parts[1].split('=')[1];
                return response.blob()
            })
            .then((blob) => {
                const url = window.URL.createObjectURL(
                new Blob([blob]),
                );
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute(
                'download',
                filename,
                );
                document.body.appendChild(link);
                link.click();
                link.parentNode!.removeChild(link);
                setGenerateLoading(false)
                useAlert("success", "Successfully generated excel data!")
            })
            .catch((error) => {
                setGenerateLoading(false)
                useAlert("error", error.message)
            });
    }

    const createJob = () => {
        openModal("create", undefined)
    }
    return (
        <AppBar 
            sx={{ 
                position: "sticky"
            }}
        >
            <Toolbar>
                <Select
                    displayEmpty
                    renderValue={(value: any) => {
                        if (!value) 
                            return "Select Keyword";
                        return value;
                    }}
                    value={keyword} onChange={selectKeyword}>
                    {list}
                </Select>
                <Container 
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginRight: 0
                    }}
                >
                    { keyword != "" && <LoadingButton onClick={scrapeJobs} loading={scrapeLoading} variant='outlined' sx={{ marginX: "8px" }} color='secondary'>Scrape Jobs</LoadingButton>}
                    <LoadingButton onClick={generateReport} loading={generateLoading} variant='outlined' color='success' sx={{ marginX: "8px" }}>Generate Excel</LoadingButton>
                    <Button onClick={createJob} variant='outlined' sx={{ marginX: "8px" }}>Add Job</Button>
                </Container>
            </Toolbar>
        </AppBar>
    )
}