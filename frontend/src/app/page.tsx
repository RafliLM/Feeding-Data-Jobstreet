"use client";

import JobModal from '@/components/jobmodal';
import Navbar from '@/components/navbar';
import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const Content = dynamic(() => import('@/components/content'), {ssr: false})

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
  show: boolean,
  mode: 'view' | 'edit' | 'create',
  job: Job | undefined
}

export default function Home() {
  const [keyword, setKeyword] = useState("")
  const [alert, setAlert] = useState({
    status: "success",
    message: "",
    show: false
  })
  const [modal, setModal] = useState<ModalProps>({
    show: false,
    mode: "view",
    job: undefined
  })
  const openModal = (mode: 'view' | 'edit' | 'create', job : Job | undefined) => {
    setModal({
      show: true,
      mode,
      job
    })
  }
  const useAlert = (status: 'error' | 'info' | 'success' | 'warning', message: string) => {
    setAlert({
      status,
      message,
      show: true
    })
  }
  const closeAlert = () => {
    setAlert({
      status: "success",
      message: "",
      show: false
    })
  }
  return (
    <main>
      <Navbar setKeyword={setKeyword} keyword={keyword} useAlert={useAlert} openModal={openModal}></Navbar>
      <Content modal={modal} keyword={keyword} useAlert={useAlert} openModal={openModal}></Content>
      <JobModal modal={modal} setModal={setModal} useAlert={useAlert}></JobModal>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={alert.show}
        autoHideDuration={5000}
        onClose={closeAlert}
      >
        <Alert severity={alert.status as any}>{alert.message} </Alert>
      </Snackbar>
    </main>
  );
}
