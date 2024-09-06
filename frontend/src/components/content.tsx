import { Container, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility'; 
import CreateIcon from '@mui/icons-material/Create';

interface ModalProps {
    show: boolean
    mode: 'view' | 'edit' | 'create'
    job: Job | undefined
}

interface ContentProps {
    modal: ModalProps
    keyword: string
    openModal: (mode: 'view' | 'edit' | 'create', job : Job | undefined) => void
    useAlert: (status: 'error' | 'info' | 'success' | 'warning', message: string) => void
}

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



const getJobs = async (page: number, size: number, keyword: string) => {
    const data = await fetch(url + "?" + new URLSearchParams({
        page: String(page + 1),
        size: String(size),
        keyword
    }).toString())
    const jobs = await data.json()
    return jobs
}



export default function Content({ modal, keyword, openModal, useAlert } : ContentProps) {
    const [page, setPage] = useState(0)
    const [size, setSize] = useState(10)
    const [totalData, setTotalData] = useState(0)
    const [jobs, setJobs] = useState<Job[]>([])
    const changePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage)
    }
    const changeSize = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        setSize(parseInt(event.target.value, 10));
        setPage(0);
    };

    const deleteJob = (jobId : number) => {
        fetch(`${url}${jobId}/`, {
            method: 'DELETE'
        })
        .then(async (response) => {
            useAlert("success", await response.text())
            getJobs(page, size, keyword).then(data => {
                setJobs(data.jobs)
                setTotalData(data.totalData)
            }).catch(error => {
                useAlert("error", error.message)
            })
        })
        .catch((error) => {
            useAlert('error', error.message)
        })
    }

    const Jobs = ({ jobs } : { jobs : Job[] | undefined }) => {
        if (!jobs || jobs.length == 0)
            return (
                <TableRow>
                    <TableCell colSpan={5}>No jobs found</TableCell>
                </TableRow>
            )
        return jobs.map(job => (
            <TableRow 
                key={job.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.role}</TableCell>
                <TableCell>{job.salary}</TableCell>
                <TableCell>{job.keyword}</TableCell>
                <TableCell>
                    <IconButton onClick={() => openModal("view", job)} color="primary"> <VisibilityIcon/> </IconButton>
                    <IconButton onClick={() => openModal("edit", job)} color="success"> <CreateIcon/> </IconButton>
                    <IconButton onClick={() => deleteJob(job.id)} color="error"> <DeleteIcon/> </IconButton>
                </TableCell>
            </TableRow>
        ))
    }


    useEffect(() => {
        if(!modal.show) {
            getJobs(page, size, keyword).then(data => {
                setJobs(data.jobs)
                setTotalData(data.totalData)
            }).catch(error => {
                useAlert("error", error.message)
            })
        }
    }, [keyword, page, size, modal])
    return (
        <Container
            maxWidth={false}
        >
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Salary</TableCell>
                            <TableCell>Keyword</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <Jobs jobs={jobs}></Jobs>
                    </TableBody>
                </Table>
            </TableContainer>
            { totalData > 0 && <Container
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginRight: 0
                }}>
                <TablePagination
                    sx={{
                        backgroundColor: "#121212"
                    }}
                    rowsPerPageOptions={[5,10,20]}
                    count={totalData}
                    page={page}
                    onPageChange={changePage}
                    rowsPerPage={size}
                    onRowsPerPageChange={changeSize}
                />
            </Container>}
            
        </Container>
    )
}