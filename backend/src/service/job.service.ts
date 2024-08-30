import axios from "axios";
import * as cheerio from "cheerio";
import prismaRepository from "../repository/prisma.repository";
import ExcelJS from "exceljs"

export default {
    getJobs : async (page : number, size: number, keyword: string) => {
        return {
            totalData : await prismaRepository.jobs.count({
                where: (keyword) ? {
                    keyword: keyword
                } : {}
            }),
            jobs : await prismaRepository.jobs.findMany({
                take: size,
                skip: (page - 1) * size,
                where: (keyword) ? {
                    keyword: keyword
                } : {}
            })
        }
    },
    getKeywords : async () => {
        return await prismaRepository.jobs.findMany({
            select: {
                keyword: true
            }
        })
    },
    scrapeData : async (keyword: string) => {
        const url = `https://id.jobstreet.com/id/${keyword.toLowerCase().replace(" ", "-")}-jobs`
        const { data } = await axios.get(url)
        const $ = cheerio.load(data)
        const result = $('[data-automation=server-state]').contents().text()
        
        let jobs = result.split("\n")[2]
        jobs = JSON.parse(jobs.slice(jobs.indexOf("{"), jobs.length-1)).results.results.jobs.map(job => ({
            id: job.id,
            title: job.title,
            teaser: job.teaser ? job.teaser : "",
            companyName: (job.companyName) ? job.companyName : "",
            location: job.location ? job.location : "",
            workType: job.workType ? job.workType : "",
            role: job.roleId ? job.roleId : "",
            salary: job.salary ? job.salary : "",
            keyword: keyword,
            listingDate: new Date(job.listingDate),
            bulletPoints: job.bulletPoints
        }))
        const insertJobs = await prismaRepository.jobs.createMany({
            data: jobs as any,
            skipDuplicates: true
        })
        return `Successfully scraped ${insertJobs.count} jobs data with ${keyword} keyword!`
    },
    addJob : async (data) => {
        await prismaRepository.jobs.create({
            data: data
        })
        return `Successfully created job data!`
    },
    editJob : async (jobId: number, data) => {
        await prismaRepository.jobs.update({
            where: {
                id: jobId
            },
            data
        })
        return `Successfully updated job data!`
    },
    deleteJob : async (jobId : number) => {
        await prismaRepository.jobs.delete({
            where: {
                id: jobId
            }
        })
        return `Successfully deleted job data!`
    },
    generateExcelReport : async () => {
        const jobs = await prismaRepository.jobs.findMany({
            omit: {
                id: true
            }
        })
        jobs.map(job => {
            job.listingDate = new Date(job.listingDate)
            // @ts-ignore
            job.bulletPoints = job.bulletPoints.join(" \n")
            return job
        })
        const excel = new ExcelJS.Workbook()
        const jobSheet = excel.addWorksheet('jobs')
        jobSheet.columns = [
            {
                header: "Title",
                key: "title"
            },
            {
                header: "Teaser",
                key: "teaser"
            },
            {
                header: "Company Name",
                key: "companyName"
            },
            {
                header: "Location",
                key: "location"
            },
            {
                header: "Work Type",
                key: "workType"
            },
            {
                header: "Role",
                key: "role"
            },
            {
                header: "Salary",
                key: "salary"
            },
            {
                header: "Keyword",
                key: "keyword"
            },
            {
                header: "Bullet Points",
                key: "bulletPoints"
            },
            {
                header: "Date",
                key: "listingDate"
            }
        ]
        jobSheet.addRows(jobs)

        return excel
    }
}