import { Router } from "express";
import jobService from "../service/job.service";
import { body, query, validationResult } from 'express-validator';
import { BadRequestError } from "../exception/errors/BadRequest.error";

const router = Router()

router.get('/' , 
    query('page').isNumeric().withMessage("Parameter Page can't be empty!"), 
    query('size').isNumeric().withMessage("Parameter Size can't be empty!"), 
    async (req, res, next) => {
    try {
        const validate = validationResult(req)
        if (!validate.isEmpty()){
            throw new BadRequestError(validate.array()[0].msg)
        }
        const page : number = parseInt(req.query!.page as string)
        const size : number = parseInt(req.query!.size as string)
        return res.status(200).json(await jobService.getJobs(page, size, req.query!.keyword as string))
    } catch (error) {
        next(error)
    }
})

router.get('/keywords', async (req,res,next) => {
    try {
        return res.status(200).send(await jobService.getKeywords())
    } catch (error) {
        next(error)
    }
})

router.get('/scrape/:keyword', async (req, res, next) => {
    try {
        return res.status(200).send(await jobService.scrapeData(req.params.keyword))
    } catch (error) {
        next(error)
    }
})

router.get('/excel', async (req, res, next) => {
    try {
        const excel = await jobService.generateExcelReport()
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader("Content-Disposition", `attachment; filename=job-report-${Date.now()}.xlsx`);
        res.header('Access-Control-Expose-Headers', 'Content-Disposition');
        await excel.xlsx.write(res)
        return res.end()
    } catch (error) {
        next(error)
    }
})

router.post('/',
    body('title').notEmpty().withMessage("Title can't be empty!"),
    body('companyName').notEmpty().withMessage("CompanyName can't be empty!"),
    body('location').notEmpty().withMessage("Location can't be empty!"),
    body('workType').notEmpty().withMessage("WorkType can't be empty!"),
    body('role').notEmpty().withMessage("Role can't be empty!"),
    body('keyword').notEmpty().withMessage("Keyword can't be empty!"),
    body('bulletPoints').isArray().withMessage("BulletPoints should be an array of strings!"),
    async (req, res, next) => {
    try {
        const validate = validationResult(req)
        if (!validate.isEmpty()){
            throw new BadRequestError(validate.array()[0].msg)
        }
        let data : {
            title: string,
            teaser: string | undefined,
            companyName: string,
            location: string,
            workType: string,
            role: string,
            salary: string,
            keyword: string,
            listingDate: Date,
            bulletPoints: string []
        } = req.body
        data.listingDate = new Date()
        if ('id' in data)
            delete data['id']
        return res.status(201).send(await jobService.addJob(data))
    } catch (error) {
        next(error)
    }
})

router.put('/:jobId',
    body('title').notEmpty().withMessage("Title can't be empty!"),
    body('companyName').notEmpty().withMessage("CompanyName can't be empty!"),
    body('location').notEmpty().withMessage("Location can't be empty!"),
    body('workType').notEmpty().withMessage("WorkType can't be empty!"),
    body('role').notEmpty().withMessage("Role can't be empty!"),
    body('keyword').notEmpty().withMessage("Keyword can't be empty!"),
    body('listingDate').notEmpty().withMessage("ListingDate can't be empty!"),
    body('bulletPoints').isArray().withMessage("BulletPoints should be an array of strings!"),
    async (req, res, next) => {
    try {
        const data : {
            title: string,
            teaser: string | undefined,
            companyName: string,
            location: string,
            workType: string,
            role: string,
            salary: string,
            keyword: string,
            listingDate: Date,
            bulletPoints: string []
        } = req.body
        if ('id' in data)
            delete data['id']
        return res.status(200).send(await jobService.editJob(parseInt(req.params!.jobId), data))
    } catch (error) {
        next(error)
    }
})

router.delete('/:jobId', async (req, res, next) => {
    try {
        return res.status(200).send(await jobService.deleteJob(parseInt(req.params.jobId)))
    } catch (error) {
        next(error)
    }
})

export default router